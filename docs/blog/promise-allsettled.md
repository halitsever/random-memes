---
title: "Promise.all vs Promise.allSettled in JavaScript"
titleTemplate: false
description: "Promise.all rejects on the first failure; Promise.allSettled waits for every promise and reports each result. A real run with three APIs and when to use each."
date: 2026-11-28
faq:
  - q: "What is the difference between Promise.all and Promise.allSettled?"
    a: "Promise.all fulfills with an array of values only if every promise fulfills, and rejects as soon as one rejects. Promise.allSettled always fulfills, once every promise has settled, with one status object per promise."
  - q: "Does Promise.allSettled ever reject?"
    a: "Not because of the promises you pass in. It fulfills with an array of objects that have status fulfilled with a value, or status rejected with a reason. It only rejects if its argument is not iterable."
  - q: "Does Promise.all cancel the other promises when one fails?"
    a: "No. JavaScript promises cannot be cancelled. The other requests keep running; Promise.all just stops waiting for them. Use an AbortSignal if you need to stop them."
---

# Wait for all, or stop at the first failure? Promise.all and Promise.allSettled

<p class="post-meta">Halit Sever · 28 November 2026</p>

Both functions take a list of promises and give you one promise back. The difference is what happens when one of them fails. `Promise.all` gives up at the first rejection; `Promise.allSettled` waits for everything and tells you how each one ended. random-memes uses `allSettled` to read three Lemmy communities at once, and the example below is the same pattern with one source that cannot work.

## The behaviour, side by side

From [MDN's Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) and [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) pages:

| | `Promise.all` | `Promise.allSettled` |
| --- | --- | --- |
| Fulfills when | every input fulfills | every input has settled, either way |
| Fulfills with | an array of values | an array of `{ status, value }` or `{ status, reason }` |
| Rejects when | the first input rejects, with that reason | not because of the inputs |
| Use it when | you need all results or none | partial results are useful |

Neither stops the other promises. A promise is not a running task you can cancel, so when `Promise.all` rejects, the remaining requests still finish in the background; their results are just ignored.

## A run with real requests

Three Lemmy listings, the third on a host that does not exist (`.invalid` is reserved and never resolves):

```js
const sources = [
  "https://lemmy.world/api/v3/post/list?community_name=memes&sort=Hot&limit=5",
  "https://lemmy.world/api/v3/post/list?community_name=dankmemes&sort=Hot&limit=5",
  "https://lemmy.invalid/api/v3/post/list?community_name=memes&sort=Hot&limit=5",
];
const getJson = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": "settled-demo/1.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
};

try {
  const all = await Promise.all(sources.map(getJson));
  console.log("Promise.all:", all.length, "results");
} catch (error) {
  console.log("Promise.all rejected:", error.cause?.code ?? error.message);
}

const settled = await Promise.allSettled(sources.map(getJson));
for (const r of settled) {
  console.log(r.status, r.status === "fulfilled" ? `${r.value.posts.length} posts` : (r.reason.cause?.code ?? r.reason.message));
}
```

Saved as `settled.mjs` and run with Node.js 22 on 28 November 2026:

```txt
Promise.all rejected: ENOTFOUND
fulfilled 5 posts
fulfilled 5 posts
rejected ENOTFOUND
```

`Promise.all` threw away ten good posts because one host failed. `allSettled` kept them and told us which source broke. In Node, `fetch` wraps network failures in a `TypeError` whose `cause` carries the system error code, which is why the example reads `error.cause?.code`.

## How random-memes uses it

`src/lib/random.js` reads its three sources like this:

```js
const results = await Promise.allSettled(SOURCES.map(fetchSource));
const failures = results.filter(({ status }) => status === "rejected").map(({ reason }) => reason);

if (failures.length === SOURCES.length) {
  throw new Error("Failed to fetch memes from Lemmy", { cause: new AggregateError(failures, "Every source failed") });
}
```

Two details worth copying:

- **Fail only when nothing worked.** One Lemmy server being down should not stop a meme from appearing, so the function throws only if every source rejected.
- **Keep every reason.** The thrown error carries an `AggregateError` with all failures as its `cause`, so the caller can log why each source failed instead of seeing only the first.

The successful results are then merged by image URL, because a cross-post can appear in more than one community.

## When to use which

- **`Promise.all`**: the results only make sense together, such as loading a user and that user's permissions before rendering a page. Failing fast saves waiting for the rest.
- **`Promise.allSettled`**: the inputs are independent and partial success is useful, such as fan-out to several sources, sending notifications, or batch jobs where you report failures at the end.
- **`Promise.any`**: you need just one success and the first one wins, such as mirrors of the same file. It rejects with an `AggregateError` only if all fail.
- **`Promise.race`**: you want whichever settles first, success or failure. A timeout is the classic case, though [`AbortSignal.timeout`](/blog/javascript-fetch-timeout) is the better tool for `fetch`.

## Support

`Promise.allSettled` is part of ES2020. The Baseline data MDN uses lists it in every major browser since July 2020 and as widely available since January 2023, and Node.js has had it since 12.9. random-memes requires Node 20 or later, so it is always there, along with the built-in `fetch`.

## FAQ

<Faq />

## Related

- [JavaScript fetch timeout](/blog/javascript-fetch-timeout): `AbortSignal.timeout` and its errors
- [Lemmy API in JavaScript](/blog/lemmy-api): the request each source makes
- [random()](/random): how the package picks a meme
- [Testing fetch with the Node test runner](/blog/node-test-runner-mock-fetch): how these branches are tested without network
