---
description: "random() returns a random meme image post from Lemmy meme communities, with image, caption, category and post link."
---

# random()

Picks a random image post from the hot listings of these [Lemmy](https://join-lemmy.org) communities:

- [memes@lemmy.world](https://lemmy.world/c/memes)
- [dankmemes@lemmy.world](https://lemmy.world/c/dankmemes)
- [memes@lemmy.ml](https://lemmy.ml/c/memes)

Pinned, NSFW, removed and non-image posts are skipped. The posts are fetched once and reused for 10 minutes, so repeated calls are fast and do not hit the instances again.

Takes no parameters.

```javascript
const { random } = require("random-memes");

const { image, caption, category, permalink } = await random();
```

## Returns

```typescript
Promise<{
  image: string;
  category: string; // community name, e.g. "memes"
  caption: string; // post title
  permalink: string; // link to the original post
}>;
```

If one community is unreachable, the others are still used. The call rejects only when every community fails or none of them has an image post. In the first case `error.cause` is an `AggregateError` holding each failure.

## How a meme is picked

1. For each community, the package requests up to 50 hot posts from the instance's public API (`/api/v3/post/list`). Each request sends a `random-memes/<version>` User-Agent and times out after 30 seconds.
2. A post is kept only if its link ends in `.jpg`, `.jpeg`, `.png`, `.gif` or `.webp`, it is not marked NSFW, it is not removed or deleted, and it is not pinned. Posts from an NSFW community are dropped too.
3. Cross-posts that point at the same image are merged, so one image is not more likely than another just because it was shared to two communities.
4. One meme is chosen at random from the remaining list, and you get a copy of it.

## Caching

The list from steps 1 to 3 is kept in memory for 10 minutes. If several calls arrive while the list is loading, they all wait for the same load instead of each sending its own requests. When a load fails, it is forgotten right away, so the next call tries again instead of returning the same error for 10 minutes.

The cache lives in the process. A restart, or a second process, starts with an empty cache.

## Errors

| Message                            | When                                            | `error.cause`                                 |
| ---------------------------------- | ----------------------------------------------- | --------------------------------------------- |
| `Failed to fetch memes from Lemmy` | All three communities failed                    | `AggregateError` with one error per community |
| `No image posts found on Lemmy`    | Requests worked, but no post passed the filters | none                                          |

A failed HTTP request carries the status code on `status`. See [Usage](/usage#errors) for a full example, or [Meme API](/meme-api) to serve the result over HTTP.
