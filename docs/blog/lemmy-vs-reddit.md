---
title: "Lemmy vs Reddit for Developers"
titleTemplate: false
description: "Lemmy vs Reddit from a developer's side: API access, keys, rate limits, federation and data rules, and why random-memes switched its source to Lemmy."
date: 2026-11-28
faq:
  - q: "What is the difference between Lemmy and Reddit?"
    a: "Reddit is one company's site. Lemmy is open-source software that anyone can run; each server is an instance, and instances federate so users on one can join communities on another. Communities work much like subreddits."
  - q: "Does the Lemmy API need a key?"
    a: "Reading public posts does not. GET requests such as /api/v3/post/list work without an account on instances like lemmy.world and lemmy.ml. Posting, voting and other actions need a login."
  - q: "Is Lemmy a good replacement for the Reddit API?"
    a: "For reading public posts from active communities, often yes, and with less setup. It has far fewer users than Reddit, so niche topics may have small or no communities, and each instance sets its own rules."
  - q: "Can I use Lemmy from a browser?"
    a: "lemmy.world and lemmy.ml answered cross-origin requests with Access-Control-Allow-Origin set to the requesting origin when checked on 28 November 2026, so a web page can read their public API directly."
---

# Building on Lemmy or Reddit: what a developer gets from each

<p class="post-meta">Halit Sever · 28 November 2026</p>

The random-memes package fetched memes from Reddit for years. Today its main function reads Lemmy instead. This post compares the two as a data source for code: getting access, limits, how the data is spread out, and what you owe the platform. Everything below was checked on 28 November 2026 against Reddit's help pages and live requests to two Lemmy instances.

## At a glance

| | Reddit | Lemmy |
| --- | --- | --- |
| Who runs it | Reddit, Inc. | anyone; each server is an instance |
| Software | proprietary | open source, AGPL-3.0, written in Rust |
| Read public posts without auth | blocked (HTTP 403) | yes |
| Access process | request and approval, then OAuth | none for reading |
| Documented free limit | 100 queries per minute per OAuth client | set by each instance |
| Communities | subreddits | communities, followed across instances |
| Browser (CORS) access | n/a without auth | allowed on lemmy.world and lemmy.ml |

## Access

**Reddit.** Its [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) requires you to "request access and get explicit approval before accessing any Reddit data through our API." Once approved, requests go through OAuth with a descriptive User-Agent. Without OAuth, the Data API Wiki says traffic "will be blocked". [How to get a Reddit API key](/blog/reddit-api-key) has the steps.

**Lemmy.** Public reads need nothing. This is the request random-memes makes, and it works from `curl` with no headers at all:

```bash
curl "https://lemmy.world/api/v3/post/list?community_name=memes&sort=Hot&limit=50"
```

Logging in is only needed to post, vote, comment or report.

## Federation

A Lemmy community lives on one instance, such as `memes@lemmy.world`, but users from other instances can follow and post to it, and each instance keeps a copy of the posts it federates. For a developer this means:

- You pick an instance to query. The same community can be read through different instances, with possibly different local rules and copies.
- Popular content is spread over several communities on several instances. random-memes reads three (`memes` and `dankmemes` on lemmy.world, `memes` on lemmy.ml) and merges cross-posts of the same image.
- Every instance is run by different people, so be a polite client.

## Being a polite client

Reddit documents its limits. Lemmy instances are often run by volunteers, which is a reason to send fewer requests than you could. random-memes:

- sends a `random-memes/<version>` User-Agent with a link to the repository, so an instance admin can see who is calling;
- fetches each community once and keeps the list for 10 minutes;
- shares one in-flight request between concurrent callers;
- stops after one page of 50 posts per community, the largest page lemmy.world accepted (a `limit=100` request returned `couldnt_get_posts`).

## Data rules

Reddit's Data API Wiki requires you to delete content that users delete on Reddit and recommends deleting stored user data within 48 hours. Its policy also forbids commercial use and AI training without written approval.

Lemmy has no central developer terms; each instance publishes its own rules. Posts carry `removed` and `deleted` flags, and random-memes skips both. If you store Lemmy content, honor deletions in the same spirit.

## Trade-offs

Lemmy is not a drop-in Reddit. It has far fewer users, so a niche subreddit may have no equivalent community, and an instance can go down or change its rules. For a meme bot or a demo, those trade-offs are small next to an approval process. For research that needs Reddit's own data, there is no substitute for applying.

## Try it

The [random meme page](/random-meme/) reads Lemmy from your browser, and in Node.js:

```javascript
const { random } = require("random-memes");

const meme = await random();
```

## FAQ

<Faq />

## Related

- [Lemmy API in JavaScript](/blog/lemmy-api): the request and the fields, step by step
- [Is the Reddit API free?](/blog/is-reddit-api-free): Reddit's free access, explained
- [Filter NSFW posts from Lemmy](/blog/lemmy-nsfw-filter): the flags to check
- [random()](/random): how the package reads Lemmy
- [Reddit alternatives](/blog/reddit-alternatives): Lemmy, PieFed, Mbin and Tildes side by side
