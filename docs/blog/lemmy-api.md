---
title: "Lemmy API: Fetch Posts From a Community in JavaScript"
titleTemplate: false
description: "Use the Lemmy API from JavaScript: fetch a community's posts with /api/v3/post/list, the parameters, response fields, paging and the 50-post limit."
date: 2026-11-28
faq:
  - q: "Does the Lemmy API need authentication?"
    a: "Not for reading public posts. GET /api/v3/post/list works without a token on public instances. Actions such as posting or voting need a logged-in user."
  - q: "How many posts can I fetch from the Lemmy API at once?"
    a: "Up to 50 per request. On lemmy.world, a request with limit=100 returned the error couldnt_get_posts when checked on 28 November 2026. Use next_page or page for more."
  - q: "How do I get posts from one community?"
    a: "Pass community_name, for example community_name=memes. For a community on another instance, use the name@instance form, such as memes@lemmy.ml."
  - q: "Can I call the Lemmy API from a web page?"
    a: "lemmy.world and lemmy.ml returned Access-Control-Allow-Origin matching the requesting origin when checked, so fetch() from a browser works for public reads."
---

# Reading a Lemmy community's posts from JavaScript

<p class="post-meta">Halit Sever · 28 November 2026</p>

[Lemmy](https://join-lemmy.org) exposes a JSON API on every instance, and reading public posts needs no key and no account. This post shows the one request random-memes is built on, what comes back, and how to page through more. Examples were run against lemmy.world and lemmy.ml (Lemmy 0.19.21) on 28 November 2026.

## The request

```txt
GET https://lemmy.world/api/v3/post/list?community_name=memes&sort=Hot&limit=50
```

| Parameter | Example | Notes |
| --- | --- | --- |
| `community_name` | `memes` | a community on this instance, or `name@instance` for a remote one |
| `community_id` | `2` | the numeric alternative to `community_name` |
| `sort` | `Hot` | also `New`, `Active`, `TopDay`, `TopWeek` and others |
| `limit` | `50` | 50 is the most lemmy.world accepted; `limit=100` returned `couldnt_get_posts` |
| `page` | `2` | page number |
| `page_cursor` | from `next_page` | cursor for the next page |

## In JavaScript

Node.js 18+ and every current browser have `fetch` built in:

```javascript
const listPosts = async (instance, community) => {
  const url = `${instance}/api/v3/post/list?community_name=${community}&sort=Hot&limit=50`;
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const { posts, next_page } = await response.json();
  return { posts, next_page };
};

const { posts } = await listPosts("https://lemmy.world", "memes");
console.log(posts.length, posts[0].post.name);
```

In Node.js, add a `User-Agent` header that names your app, as random-memes does with `random-memes/<version> (+https://github.com/halitsever/random-memes)`. Browsers do not let a page set it.

## What comes back

The response has `posts` and `next_page`. Each item in `posts` is a "post view" with these parts:

| Field | What is in it |
| --- | --- |
| `post` | `name` (title), `url`, `body`, `nsfw`, `removed`, `deleted`, `featured_community`, `featured_local`, `ap_id`, `published` |
| `community` | `name`, `title`, `nsfw` and more |
| `creator` | the author's account |
| `counts` | `score`, `upvotes`, `downvotes`, `comments` |

`post.url` is the link the post points to, which for an image post is the image itself. `post.ap_id` is the post's canonical URL on its home instance, the right thing to link to.

## How random-memes uses it

The package's `random()` reduces each post view to four fields:

```javascript
const toMeme = ({ post, community }) => ({
  image: post.url,
  category: community.name,
  caption: post.name,
  permalink: post.ap_id,
});
```

Before that, it keeps only posts that point at an image and are not NSFW, removed, deleted or pinned; [Filter NSFW posts from Lemmy](/blog/lemmy-nsfw-filter) goes through that check. It reads three communities in parallel with `Promise.allSettled`, so one slow instance does not break the call, and merges posts that share the same image.

## Paging

For more than 50 posts, pass the `next_page` value back:

```javascript
let cursor;
const all = [];
for (let i = 0; i < 3; i++) {
  const url = `https://lemmy.world/api/v3/post/list?community_name=memes&sort=New&limit=50${cursor ? `&page_cursor=${cursor}` : ""}`;
  const { posts, next_page } = await (await fetch(url)).json();
  all.push(...posts);
  if (!next_page) break;
  cursor = next_page;
}
```

Keep the number of pages small. Instances are often run by volunteers, and random-memes reads one page per community and caches it for 10 minutes for that reason.

## From the browser

lemmy.world and lemmy.ml send `Access-Control-Allow-Origin` with the requesting origin, so the same `fetch` works on a web page. The [random meme page](/random-meme/) on this site does exactly that: it reads the three communities from your browser and shows the image posts one at a time.

## FAQ

<Faq />

## Related

- [Building on Lemmy or Reddit: what a developer gets from each](/blog/lemmy-vs-reddit): access and data rules compared
- [Filter NSFW posts from Lemmy](/blog/lemmy-nsfw-filter): the flags in `post` and `community`
- [random()](/random): the package's full picking rules
- [Meme API as JSON](/meme-api): serving the result over HTTP
- [JavaScript fetch timeout](/blog/javascript-fetch-timeout): giving each request a deadline
- [User-Agent in fetch](/blog/fetch-user-agent): identifying your client to the instance
