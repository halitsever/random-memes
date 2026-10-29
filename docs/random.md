# random()

Picks a random image post from the hot listings of these [Lemmy](https://join-lemmy.org) communities:

- [memes@lemmy.world](https://lemmy.world/c/memes)
- [dankmemes@lemmy.world](https://lemmy.world/c/dankmemes)
- [memes@lemmy.ml](https://lemmy.ml/c/memes)

Pinned, NSFW, removed and non-image posts are skipped. The posts are fetched once and reused for 10 minutes, so repeated calls are fast and do not hit the instances again.

Takes no parameters.

Returns:

```typescript
Promise<{
  image: string;
  category: string; // community name, e.g. "memes"
  caption: string; // post title
  permalink: string; // link to the original post
}>
```

If one community is unreachable, the others are still used. The call rejects only when every community fails or none of them has an image post. In the first case `error.cause` is an `AggregateError` holding each failure.
