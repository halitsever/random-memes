---
description: "reddit() fetches a random image post from a subreddit. It is deprecated and will be removed in random-memes v5."
---

# reddit()

::: warning Deprecated
Reddit blocks most unauthenticated requests, so this method fails with HTTP 403 in most environments. It prints a `DeprecationWarning` on first use and will be removed in v5. Use [`random()`](/random) instead.
:::

Fetches a random image post from the hot listing of a subreddit.

## Parameters

All parameters are optional.

| Name                  | Type                                                                   | Default | Description                                                                                   |
| --------------------- | ---------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `locale`              | `"br" \| "de" \| "en" \| "es" \| "fr" \| "in" \| "it" \| "ru" \| "tr"` | `"en"`  | Picks a meme subreddit for the language. An unknown locale throws before any request is sent. |
| `customSubredditName` | `string`                                                               |         | Subreddit to use instead of the locale's.                                                     |
| `fullRawBody`         | `boolean`                                                              | `false` | Return the raw Reddit post instead of the object below.                                       |

## Subreddits by locale

| Locale | Subreddit         |
| ------ | ----------------- |
| `br`   | r/ItHadToBeBrazil |
| `de`   | r/GermanMemes     |
| `en`   | r/dankmemes       |
| `es`   | r/memesesp        |
| `fr`   | r/FrenchMemes     |
| `in`   | r/IndianDankMemes |
| `it`   | r/italianmemes    |
| `ru`   | r/YouSeeComrade   |
| `tr`   | r/burdurland      |

When `customSubredditName` is set, `locale` is ignored. The name is URL-encoded before the request.

## Example

```javascript
const { reddit } = require("random-memes");

const meme = await reddit({ locale: "de" });
const raw = await reddit({ customSubredditName: "memes", fullRawBody: true });
```

The method reads up to 100 posts from the subreddit's hot listing. Pinned posts and posts that are not direct image links (videos, galleries, text posts) are skipped, and one of the rest is picked at random.

## Returns

```typescript
Promise<{
  image: string;
  category: string | null; // post flair
  caption: string;
  permalink: string; // relative to https://www.reddit.com
}>;
```

With `fullRawBody: true` the promise resolves to the post exactly as it appears in Reddit's listing, an object with `kind` and `data`.

## Errors

- `Unknown locale "xx". Available locales: ...` is thrown before any request when the locale is not in the table above.
- `Failed to fetch memes from r/<name>.` means the request failed. On HTTP 403 the message adds that Reddit blocks most unauthenticated requests. The underlying error, with its `status`, is on `error.cause`.
- `No image posts found in r/<name>` means the listing had no usable image post.

## Deprecation warning

The first call in a process emits a `DeprecationWarning` with the code `RANDOM_MEMES_REDDIT`. Later calls stay quiet.

## Moving to random()

`random()` returns the same four fields, with two differences: `category` is the Lemmy community name instead of the post flair, and `permalink` is a full URL instead of a path on reddit.com. It takes no options, so locale and subreddit choices have no equivalent. See [random()](/random).
