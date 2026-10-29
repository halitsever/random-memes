# reddit()

::: warning Deprecated
Reddit blocks most unauthenticated requests, so this method fails with HTTP 403 in most environments. It prints a `DeprecationWarning` on first use and will be removed in v5. Use [`random()`](/random) instead.
:::

Fetches a random image post from the hot listing of a subreddit.

## Parameters

All parameters are optional.

| Name | Type | Default | Description |
|---|---|---|---|
| `locale` | `"br" \| "de" \| "en" \| "es" \| "fr" \| "in" \| "it" \| "ru" \| "tr"` | `"en"` | Picks a meme subreddit for the language. An unknown locale throws before any request is sent. |
| `customSubredditName` | `string` | | Subreddit to use instead of the locale's. |
| `fullRawBody` | `boolean` | `false` | Return the raw Reddit post instead of the object below. |

Pinned posts and posts that are not direct image links (videos, galleries, text posts) are skipped.

## Returns

```typescript
Promise<{
  image: string;
  category: string | null; // post flair
  caption: string;
  permalink: string; // relative to https://www.reddit.com
}>
```

Rejects when Reddit blocks the request, when the request fails, or when the listing has no image posts. The underlying error is on `error.cause`.
