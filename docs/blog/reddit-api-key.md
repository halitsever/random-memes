---
title: "How to Get a Reddit API Key (and When You Don't Need One)"
titleTemplate: false
description: "How to get a Reddit API key today: Reddit's approval requirement, OAuth client IDs, rate limits and User-Agent rules, plus the Lemmy route that needs no key."
date: 2026-11-28
faq:
  - q: "How do I get a Reddit API key?"
    a: "Reddit's Responsible Builder Policy says you must request access and get explicit approval before using its API. Once approved, your app authenticates with a registered OAuth client, which gives you a client ID and secret."
  - q: "Can I use the Reddit API without a key?"
    a: "Not reliably. Reddit's Data API Wiki says traffic not using OAuth or login credentials will be blocked. Unauthenticated requests to the public JSON listings return HTTP 403 from most environments."
  - q: "What is the Reddit API rate limit?"
    a: "For approved free access, 100 queries per minute per OAuth client ID, averaged over a 10-minute window, according to Reddit's Data API Wiki."
  - q: "Is there a meme API that needs no key?"
    a: "The random-memes package reads Lemmy meme communities, whose public API needs no key or account. It returns a random meme's image URL, caption, community and post link."
---

# How to get a Reddit API key (and when you don't need one)

<p class="post-meta">Halit Sever · 28 November 2026</p>

Getting a Reddit API key used to mean creating an app at reddit.com/prefs/apps and copying its client ID. That is no longer the whole story. This post covers what Reddit's own help pages say today, what you need to send with each request, and why the random-memes package stopped using Reddit altogether. Reddit's pages were read on 28 November 2026.

## Step 1: approval comes first

Reddit's [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) opens with three restrictions on all access to Reddit data. The first:

> Approval is required: You must request access and get explicit approval before accessing any Reddit data through our API, and you must agree to comply with all applicable terms.

The policy also says developers of non-commercial apps "should use the Developer Platform ("Devvit") to build apps on Reddit", and that commercial use needs explicit written approval. The [Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki) links a contact form for requesting access.

So the first step is not a settings page. It is describing your use case to Reddit and waiting for an answer.

## Step 2: an OAuth client

The wiki is clear on authentication: "Clients must authenticate with a registered OAuth token. We can and will freely throttle or block unidentified Data API users." An approved app gets a client ID and secret, and exchanges them for an access token through OAuth2. Every API request then carries that token.

There is no separate "API key" in Reddit's terms. When people say Reddit API key, they mean the OAuth client ID and secret.

## Step 3: a proper User-Agent

The wiki asks for a descriptive User-Agent in this format:

```txt
<platform>:<app ID>:<version string> (by /u/<reddit username>)
```

Its example is `android:com.example.myredditapp:v1.2.3 (by /u/kemitche)`. It warns that default User-Agents such as `Python/urllib` "are drastically limited", and says plainly: "NEVER lie about your User-Agent."

## Rate limits

For approved free access, the wiki gives:

| Limit | Value |
| --- | --- |
| Requests | 100 queries per minute per OAuth client ID |
| Averaging window | 10 minutes, so short bursts are allowed |
| Without OAuth | "will be blocked, and the default rate limit will not apply" |

Watch the `X-Ratelimit-Used`, `X-Ratelimit-Remaining` and `X-Ratelimit-Reset` response headers to stay under it.

## Data you must delete

The wiki also requires you to delete content that users delete on Reddit, including post titles, bodies and embedded URLs, and recommends deleting stored user data within 48 hours. For a meme bot that only posts a link and moves on, that is easy. For anything that caches posts, plan for it.

## When you don't need one

If what you want is random memes for a bot or an app, you may not need Reddit at all.

random-memes used to read Reddit's public JSON listings without a key. Reddit now answers those requests with HTTP 403 in most environments, so the package's `reddit()` method is deprecated and will be removed in v5. Its replacement, `random()`, reads three [Lemmy](https://join-lemmy.org) meme communities instead. Lemmy's API is public: no key, no account, no approval.

```javascript
const { random } = require("random-memes");

const { image, caption, category, permalink } = await random();
```

[Lemmy vs Reddit for developers](/blog/lemmy-vs-reddit) compares the two in more detail, and the [random meme page](/random-meme/) shows the result live in your browser.

## FAQ

<Faq />

## Related

- [Is the Reddit API free?](/blog/is-reddit-api-free): what "free access" covers
- [Lemmy API in JavaScript](/blog/lemmy-api): fetching posts with no key
- [reddit() (deprecated)](/reddit): why the package moved away from Reddit
- [Usage](/usage): install random-memes and get a meme
