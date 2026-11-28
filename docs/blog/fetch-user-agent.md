---
title: "User-Agent in fetch: Forbidden Header or Not?"
titleTemplate: false
description: "Can you set User-Agent in fetch? MDN says it is no longer a forbidden header, but Chrome drops it, and Node.js sends node by default. Tests and what to send."
date: 2026-11-28
faq:
  - q: "Is User-Agent a forbidden header in fetch?"
    a: "Not any more. MDN notes that User-Agent used to be forbidden but no longer is. Chrome still silently drops it from fetch requests, so in Chrome the browser's own User-Agent is sent."
  - q: "What User-Agent does Node.js fetch send?"
    a: "The string node, unless you set one. A local echo server received exactly node from Node.js 22 when no header was given."
  - q: "What should a bot or library put in its User-Agent?"
    a: "A name, a version and a way to reach you, for example my-tool/1.2.0 (+https://example.com/contact). Some APIs ask for this, and some servers block generic values."
---

# Can you set the User-Agent header with fetch?

<p class="post-meta">Halit Sever · 28 November 2026</p>

Every request random-memes sends to Lemmy carries `User-Agent: random-memes/4.0.0 (+https://github.com/halitsever/random-memes)`, and a test fails if it does not. Setting that header is a one-liner in Node.js. In a browser it is a different story, and the answer to "is User-Agent a forbidden header?" changed over the years. Here is what the documentation says and what two runtimes actually did.

## What MDN says

MDN's [forbidden request header](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header) page lists the headers scripts cannot set because the browser keeps control of them: `Cookie`, `Host`, `Origin`, `Referer`, `Content-Length`, anything starting with `Sec-` or `Proxy-`, and others. `User-Agent` is not on the list. A note explains:

> The User-Agent header used to be forbidden, but no longer is. However, Chrome still silently drops the header from Fetch requests.

The note links Chromium bug 571722. So the standard allows it, and one major browser does not do it.

## What actually gets sent

A local echo server that returns the `User-Agent` it received, called three ways on 28 November 2026:

| Client | Header set in code | Server received |
| --- | --- | --- |
| Node.js 22 `fetch` | none | `node` |
| Node.js 22 `fetch` | `random-memes/4.0.0 (+https://github.com/halitsever/random-memes)` | the same string |
| Chrome 157 (headless), `fetch` from a page | `my-bot/1.0` | `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ...`, the browser's own |

Chrome did not throw an error or warn: the request went out with its own value, as MDN describes.

## Why the default matters on servers

`node` says nothing about who is calling, and some services treat a generic value as a sign of an unwanted script. While writing a post for another project the same day, rdap.org answered HTTP 403 to Node's default `User-Agent` and the normal redirect to a request with a descriptive one. Reddit's API wiki goes further: it asks for a descriptive User-Agent in a set format and warns that default ones are drastically limited ([how to get a Reddit API key](/blog/reddit-api-key) quotes it).

A good value has three parts: a product name, a version, and a contact. random-memes builds it from package.json so it can never fall behind a release:

```js
const { version } = require("../../package.json");

const USER_AGENT = `random-memes/${version} (+https://github.com/halitsever/random-memes)`;

const response = await fetch(url, {
  headers: { "User-Agent": USER_AGENT },
  signal: AbortSignal.timeout(30_000),
});
```

The suite checks it against the same version, so a wrong value fails CI ([the test](/blog/node-test-runner-mock-fetch)). For Lemmy servers, which volunteers run, a recognisable name means an admin who sees unusual traffic can find the project instead of blocking an anonymous address.

## In the browser: what to do instead

Since Chrome drops the header, browser code cannot identify itself through `User-Agent` reliably. Options:

- **Use a custom header** such as `X-Client: my-app/1.2`, if the server expects it. A non-safelisted header makes cross-origin requests send a CORS preflight, and the server has to allow it in `Access-Control-Allow-Headers`.
- **Put it in the URL** as a query parameter, when the API documents one.
- **Do nothing.** For public reads like Lemmy's API, the browser's own `User-Agent` is fine. The [random meme page](/random-meme/) on this site fetches from Lemmy in your browser that way.

## FAQ

<Faq />

## Related

- [JavaScript fetch timeout](/blog/javascript-fetch-timeout): the other option on every random-memes request
- [Lemmy API in JavaScript](/blog/lemmy-api): calling Lemmy from Node and the browser
- [How to get a Reddit API key](/blog/reddit-api-key): Reddit's User-Agent rules
- [Testing fetch with the Node test runner](/blog/node-test-runner-mock-fetch): asserting on headers
