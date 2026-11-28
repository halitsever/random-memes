---
title: "Node Test Runner: Mock fetch Without a Library"
titleTemplate: false
description: "Test code that calls fetch with the built-in Node.js test runner: mock globalThis.fetch with t.mock.method, check the calls and fake Date, no npm packages."
date: 2026-11-28
faq:
  - q: "How do I mock fetch in the Node.js test runner?"
    a: "Inside a test, call t.mock.method(globalThis, 'fetch', async () => new Response(...)). The mock records every call and is restored automatically when the test ends."
  - q: "Do I need Jest or Vitest to test Node.js code?"
    a: "Not for many projects. node:test ships with Node.js and has tests, subtests, mocks, mock timers and coverage. random-memes runs its whole suite with node --test and no test dependencies."
  - q: "How do I run tests with the Node test runner?"
    a: "Run node --test. With no arguments it finds files matching patterns such as *.test.js and files in test directories, and runs each in its own process."
---

# Testing fetch calls with node:test and no dependencies

<p class="post-meta">Halit Sever · 28 November 2026</p>

random-memes has 19 tests, all run with `node --test`, and none of them touch the network or install a test framework. Every test replaces `globalThis.fetch` with a mock from the built-in [`node:test`](https://nodejs.org/docs/latest-v22.x/api/test.html) module. This post shows the pattern on a small example, then the parts of the real suite that use it.

## The smallest useful example

Code under test:

```js
// weather.js
const getTitle = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": "demo/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { title } = await res.json();
  return title;
};
module.exports = { getTitle };
```

The test:

```js
// weather.test.js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { getTitle } = require("./weather");

const json = (body, status = 200) => new Response(JSON.stringify(body), { status });

test("returns the title", async (t) => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => json({ title: "hello" }));

  assert.equal(await getTitle("https://api.example/post/1"), "hello");
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(fetchMock.mock.calls[0].arguments[0], "https://api.example/post/1");
  assert.equal(fetchMock.mock.calls[0].arguments[1].headers["User-Agent"], "demo/1.0");
});

test("throws on an HTTP error", async (t) => {
  t.mock.method(globalThis, "fetch", async () => json({}, 503));

  await assert.rejects(getTitle("https://api.example/post/1"), /HTTP 503/);
});

test("fetch is real again after a test", () => {
  assert.equal(fetch.mock, undefined);
});
```

`node --test` on Node.js 22, 28 November 2026: `# tests 3`, `# pass 3`. The third test shows the property that makes this pleasant: a mock created with `t.mock` belongs to that test and is restored when it ends, so one test's fake `fetch` never leaks into the next.

Three things make it work without a library:

- **`Response` is global** in Node 18 and later, so the mock returns the same object type the real `fetch` does, with `ok`, `status` and `.json()`.
- **`t.mock.method(object, name, implementation)`** swaps a method and records each call's `arguments`, `result` and `this`.
- **`mock.calls` and `mock.callCount()`** let you assert on the URL and headers that were sent, not just on the result.

## How random-memes uses it

The helpers in `tests/helpers.js` are three lines:

```js
const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), { status });

const mockFetch = (t, body, status = 200) => t.mock.method(globalThis, "fetch", async () => jsonResponse(body, status));

const requestedUrl = (fetchMock) => fetchMock.mock.calls[0].arguments[0];
```

`tests/random.test.js` goes one step further: its mock reads the requested URL and answers per Lemmy community, so one test can make `lemmy.world/memes` answer HTTP 500 and `lemmy.ml/memes` HTTP 503 while `lemmy.world/dankmemes` returns a post. That covers the branch where [`Promise.allSettled`](/blog/promise-allsettled) sees some sources fail and the function still returns a meme.

Another test asserts the exact `User-Agent` header, which embeds the version from package.json, so a release cannot ship with a wrong one ([why the header matters](/blog/fetch-user-agent)).

## Faking time for a cache

`random()` keeps its posts for ten minutes. Waiting ten minutes in a test is not an option, so the suite fakes `Date`:

```js
test("reuses fetched posts for ten minutes", async (t) => {
  t.mock.timers.enable({ apis: ["Date"], now: 0 });
  const fetchMock = mockLemmy(t, { "lemmy.world/memes": [lemmyPost()] });
  const random = loadRandom();

  await random();
  await random();
  assert.equal(fetchMock.mock.callCount(), 3);

  t.mock.timers.tick(10 * 60 * 1000);
  await random();
  assert.equal(fetchMock.mock.callCount(), 6);
});
```

Three calls are the three sources of one load; the second `random()` reuses the cache; after the clock moves ten minutes, three more calls show the cache expired. `mock.timers` can also fake `setTimeout`, `setInterval` and `setImmediate`.

## Fresh modules between tests

The cache lives in module scope, so a module loaded once would carry state from test to test. The suite clears it from `require.cache` before each load:

```js
const loadRandom = () => {
  delete require.cache[require.resolve("../src/lib/random")];
  return require("../src/lib/random");
};
```

That works for CommonJS. For ES modules, design the state so it can be reset, or test through a factory function, because `import` has no cache you can delete from.

## Running the suite

```bash
git clone https://github.com/halitsever/random-memes.git
cd random-memes && npm ci && npm test
```

`npm test` is `node --test`. On 28 November 2026 it reported 19 tests, 19 passing, in under a second, with no network access needed. CI runs the same command on Node 20, 22 and 24.

## FAQ

<Faq />

## Related

- [Promise.all vs Promise.allSettled](/blog/promise-allsettled): the code these tests cover
- [JavaScript fetch timeout](/blog/javascript-fetch-timeout): another branch worth a test
- [CommonJS vs ESM](/blog/commonjs-vs-esm): why the package stays CommonJS
- [random()](/random): the function under test
