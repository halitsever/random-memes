---
title: "Filter NSFW Posts From Lemmy in Your App"
titleTemplate: false
description: "Keep NSFW posts out of an app that reads Lemmy: the post and community nsfw flags, removed, deleted and pinned posts, image-only links, the exact filter."
date: 2026-11-28
faq:
  - q: "How do I hide NSFW posts from the Lemmy API?"
    a: "Check post.nsfw and community.nsfw on every post view and drop the post if either is true. Checking only the post misses posts in communities that are NSFW as a whole."
  - q: "Should I rely on the instance to hide NSFW posts?"
    a: "Filter on the flags in your own code instead. The check is a few lines and gives the same result whichever instance you query."
  - q: "What other posts should a meme app skip?"
    a: "Removed and deleted posts, which moderators or authors took down, and pinned posts, which are usually rules or announcements rather than memes. random-memes also keeps only links that end in an image extension."
  - q: "Is the NSFW flag enough to keep a feed safe?"
    a: "No. It only catches posts that someone marked. Unmarked posts can still be offensive, so give users a way to report and keep a block list if your app needs one."
---

# Filter NSFW posts from Lemmy in your app

<p class="post-meta">Halit Sever · 28 November 2026</p>

If your app shows Lemmy posts to people, you want to leave out what is marked NSFW and what moderators took down. Lemmy's API gives you the flags for that on every post. This post walks through the check random-memes uses, flag by flag.

## The filter

From `src/lib/random.js` in random-memes:

```javascript
const isUsable = ({ post, community }) =>
  isImageUrl(post.url) &&
  !post.nsfw &&
  !community.nsfw &&
  !post.removed &&
  !post.deleted &&
  !post.featured_community &&
  !post.featured_local;
```

It runs on each item of `posts` from `GET /api/v3/post/list`. Every item has a `post` and a `community` object. Here is what each check does.

## post.nsfw

Set when the post is marked NSFW by its author or a moderator. The obvious check, and the one most code stops at.

## community.nsfw

Set when the whole community is marked NSFW. Posts in such a community are not necessarily marked one by one, so checking only `post.nsfw` lets them through. Checking both costs nothing.

## post.removed and post.deleted

`removed` means a moderator or admin took the post down. `deleted` means its author deleted it. Both flags come with the post in the listing, so skip both: showing something its author deleted is rude, and showing something moderators removed is worse.

## featured_community and featured_local

These mark pinned posts: pinned in the community, or pinned on the instance's front page. In a meme community, pinned posts are usually rules or announcements. They are not NSFW, but they are not what a "random meme" button should show.

## Image links only

```javascript
const IMAGE_EXTENSION = /\.(jpe?g|png|gif|webp)$/i;

const isImageUrl = (url) => {
  try {
    return IMAGE_EXTENSION.test(new URL(url).pathname);
  } catch {
    return false;
  }
};
```

Not a safety check, but it narrows what can show up: text posts, videos and links to other websites are dropped, and only direct image files remain. Testing the URL's `pathname` instead of the whole string means query strings like `?format=webp` do not break the match, and the `try` handles posts with no URL at all.

## How well it works

On 28 November 2026, the three communities random-memes reads returned 150 hot posts, and 135 passed the filter (46, 50 and 39).

The flags only catch what someone marked. An unmarked post can still be crude or offensive, so:

- give users a way to report, the way the [random meme page](/random-meme/) links each meme to its post on Lemmy for reporting;
- keep your own block list of post IDs or image URLs if your app needs stricter rules;
- choose communities whose rules match your audience.

## Using it

The filter is internal to random-memes, so you get it by calling `random()`:

```javascript
const { random } = require("random-memes");

const { image, caption, permalink } = await random();
```

To apply it to your own Lemmy requests, copy the two functions above. They have no dependencies. [Lemmy API in JavaScript](/blog/lemmy-api) shows the request they run on.

## FAQ

<Faq />

## Related

- [Lemmy API in JavaScript](/blog/lemmy-api): the request and response fields
- [Lemmy vs Reddit for developers](/blog/lemmy-vs-reddit): moderation and data rules
- [random()](/random): every rule random-memes applies
- [Random meme](/random-meme/): the filter, live in your browser
