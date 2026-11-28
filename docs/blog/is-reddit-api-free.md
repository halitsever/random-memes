---
title: "Is the Reddit API Free? What Free Access Covers"
titleTemplate: false
description: "Is the Reddit API free? What Reddit's own pages say about free access, the 100 queries per minute limit, approval, commercial use and 403 errors."
date: 2026-11-28
faq:
  - q: "Is the Reddit API free?"
    a: "Reddit's Data API Wiki describes free access with a limit of 100 queries per minute per OAuth client ID. Access requires approval first under the Responsible Builder Policy, and commercial use needs explicit written approval."
  - q: "Can I use Reddit data commercially for free?"
    a: "Reddit's policy says you must not sell, license, share or otherwise commercialize Reddit data without express written approval, and that commercial use needs explicit written approval. Contact Reddit for terms."
  - q: "Why do I get HTTP 403 from Reddit's JSON endpoints?"
    a: "Reddit's wiki says traffic not using OAuth or login credentials will be blocked. Requests to URLs like reddit.com/r/memes/hot.json without authentication return 403 from most environments."
  - q: "Can I train an AI model on Reddit data?"
    a: "Not without approval. The Responsible Builder Policy lists using data to train machine learning or AI models among the things that require express written approval."
---

# Is the Reddit API free?

<p class="post-meta">Halit Sever · 28 November 2026</p>

The short answer: Reddit offers free access to its Data API, with a rate limit, after you are approved, and for non-commercial use. Commercial use and AI training need written approval. Unauthenticated requests are blocked. This post walks through each part from Reddit's own help pages, read on 28 November 2026, and from what happened to the random-memes package when Reddit started blocking it.

## What "free access" means

The [Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki) says: "We enforce rate limits for those eligible for free access usage of our Data API. The limit is: 100 queries per minute (QPM) per OAuth client id." The limit is averaged over 10 minutes, so short bursts are fine.

Free access also includes limits for chat messages: 2,000 per day per recipient and 3,000 per day in total.

## Who is eligible

The [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) sets the conditions:

- **Approval is required** before accessing any Reddit data through the API.
- **Non-commercial developers** are pointed to Reddit's Developer Platform, Devvit, and to a ticket form if Devvit does not fit their use case.
- **Commercial use** needs "explicit written approval".
- **No unapproved commercialization or AI training**: you must not sell, license or share Reddit data, or use it to train machine learning or AI models, without express written approval.

So free means free of charge within those limits, not open to anyone for anything.

## What you get without authentication

Nothing dependable. The wiki: "Traffic not using OAuth or login credentials will be blocked, and the default rate limit will not apply."

You can see it with one request:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://www.reddit.com/r/memes/hot.json?limit=5"
```

From the machine this post was written on, that prints `403`, with or without a custom User-Agent.

## What that meant for random-memes

random-memes originally fetched memes from subreddits through those public JSON listings, with no key. Once Reddit blocked unauthenticated traffic, the `reddit()` method started failing with HTTP 403 in most environments. Rather than ask every user to apply for Reddit API access for a meme bot, the package added `random()`, which reads [Lemmy](https://join-lemmy.org) meme communities instead, and deprecated `reddit()`. It will be removed in v5.

Lemmy's API is public and needs no key, so this works with no setup:

```javascript
const { random } = require("random-memes");

const meme = await random();
// { image, category, caption, permalink }
```

## If you still need Reddit

If your project needs Reddit data specifically:

1. Read the Responsible Builder Policy and check whether Devvit fits your use case.
2. Request access through the form linked from the Data API Wiki.
3. Once approved, authenticate with OAuth and send a User-Agent in Reddit's format.
4. Stay under 100 queries per minute and delete content users delete.

[How to get a Reddit API key](/blog/reddit-api-key) covers those steps in more detail.

## FAQ

<Faq />

## Related

- [How to get a Reddit API key](/blog/reddit-api-key): approval, OAuth and User-Agent
- [Lemmy vs Reddit for developers](/blog/lemmy-vs-reddit): what changes when you switch
- [Random meme](/random-meme/): Lemmy memes, live in the browser
- [reddit() (deprecated)](/reddit): the old method and how to migrate
