---
title: "JavaScript fetch Timeout With AbortSignal.timeout()"
titleTemplate: false
description: "fetch has no timeout option. Set one with AbortSignal.timeout(), tell a TimeoutError from an AbortError, combine signals and know Node's 300-second defaults."
date: 2026-11-28
faq:
  - q: "What is the default timeout for fetch in JavaScript?"
    a: "The Fetch standard defines none, so browsers have no fetch-specific limit. Node.js fetch uses undici, whose client defaults are 300 seconds for headers and 300 seconds between body chunks."
  - q: "How do I set a timeout on fetch?"
    a: "Pass signal: AbortSignal.timeout(ms). If the time runs out, fetch rejects with a DOMException named TimeoutError."
  - q: "How do I combine a timeout with a cancel button?"
    a: "Use AbortSignal.any([controller.signal, AbortSignal.timeout(ms)]). The request is aborted by whichever fires first, and the error name tells you which one it was."
---

# Giving fetch a deadline: timeouts with AbortSignal

<p class="post-meta">Halit Sever · 28 November 2026</p>

`fetch` has no `timeout` option. A request to a server that accepts the connection and then never answers can hang for minutes. The fix is one argument, `signal: AbortSignal.timeout(ms)`, and it is what random-memes passes on every request to Lemmy. This post shows it running, the errors you get, and the defaults you live with if you skip it.

## The one-liner

```js
const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
```

From random-memes' `src/utils/http.js`:

```js
const response = await fetch(url, {
  headers: { "User-Agent": USER_AGENT },
  signal: AbortSignal.timeout(30_000),
});
```

30 seconds is generous for a JSON listing, but Lemmy instances are volunteer-run and sometimes slow; the point is that a stuck server cannot hang a bot forever.

## What happens when it fires

A local server that waits five seconds before answering, and three ways to give up on it:

```js
import http from "node:http";

const server = http.createServer((req, res) => setTimeout(() => res.end("late"), 5000)).listen(4197);

const started = Date.now();
try {
  await fetch("http://localhost:4197/", { signal: AbortSignal.timeout(1000) });
} catch (error) {
  console.log(error.name, "after", Date.now() - started, "ms:", error.message);
}

const controller = new AbortController();
setTimeout(() => controller.abort(), 200);
try {
  await fetch("http://localhost:4197/", { signal: controller.signal });
} catch (error) {
  console.log(error.name, "from a manual abort:", error.message);
}

const user = new AbortController();
try {
  await fetch("http://localhost:4197/", { signal: AbortSignal.any([user.signal, AbortSignal.timeout(500)]) });
} catch (error) {
  console.log(error.name, "from AbortSignal.any");
}
server.close();
server.closeAllConnections();
```

Node.js 22, 28 November 2026:

```txt
TimeoutError after 1015 ms: The operation was aborted due to timeout
AbortError from a manual abort: This operation was aborted
TimeoutError from AbortSignal.any
```

So the error name tells you why the request stopped:

| `error.name` | Cause |
| --- | --- |
| `TimeoutError` | an `AbortSignal.timeout()` ran out |
| `AbortError` | something called `controller.abort()` |
| `TypeError` | a network failure such as DNS or a refused connection, with details in `error.cause` |

[MDN's AbortSignal.timeout page](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) documents the same split, so code like this works in browsers too:

```js
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
} catch (error) {
  if (error.name === "TimeoutError") showMessage("The server took too long.");
  else if (error.name === "AbortError") return; // the user cancelled
  else throw error;
}
```

## The timeout covers the body too

The signal stays attached while you read the response. If headers arrive in time but `await res.json()` is still streaming when the timer runs out, the read rejects with the same `TimeoutError`. A test on the same day, with a server that sent the headers at once and the rest of the JSON three seconds later, got the status 200 and then `TimeoutError` from `res.json()` after one second. That is usually what you want: the deadline is for the whole operation, not only the first byte.

## Defaults when you set nothing

- **The Fetch standard** defines no timeout.
- **Browsers** have no fetch-specific limit; how long a request waits depends on the browser's networking code.
- **Node.js** implements `fetch` with [undici](https://github.com/nodejs/undici). Its client defaults are `headersTimeout: 300e3` and `bodyTimeout: 300e3`: five minutes to receive the headers, and five minutes between body chunks.

Five minutes is far longer than a user, a bot command or a serverless function will wait. Set your own.

## Older patterns you can drop

Before `AbortSignal.timeout()` existed, code wrapped an `AbortController` in `setTimeout` and had to clear the timer after success, or raced `fetch` against a timer with `Promise.race`. The race version is worse than it looks: the losing request keeps running, holding a socket. `AbortSignal.timeout()` aborts the request and cleans up its own timer. It is available in Node.js 17.3 and later and in current browsers, and random-memes' minimum of Node 20 includes it.

## Testing the timeout branch

You do not need a slow server in tests. Mock `fetch` to reject with the error your code checks for:

```js
t.mock.method(globalThis, "fetch", async () => {
  throw new DOMException("The operation was aborted due to timeout", "TimeoutError");
});
```

[Testing fetch with the Node test runner](/blog/node-test-runner-mock-fetch) shows the full setup.

## FAQ

<Faq />

## Related

- [Promise.all vs Promise.allSettled](/blog/promise-allsettled): what happens when one of several requests fails
- [Setting a User-Agent in fetch](/blog/fetch-user-agent): the other header option random-memes sets
- [Lemmy API in JavaScript](/blog/lemmy-api): the requests this timeout protects
- [Build a Discord meme bot](/blog/discord-meme-bot): where a hanging request would hurt
