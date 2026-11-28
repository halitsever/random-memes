---
title: "Reddit Alternatives: Lemmy, PieFed, Mbin and Tildes"
titleTemplate: false
description: "Reddit alternatives compared from their own sites: Lemmy, PieFed and Mbin on the fediverse, and invite-only Tildes. How each works and which have an open API."
date: 2026-11-28
faq:
  - q: "What is the best Reddit alternative?"
    a: "It depends on what you miss. Lemmy is the largest Reddit-style option on the fediverse and has the most apps. PieFed and Mbin federate with Lemmy and add their own features. Tildes is a single, invite-only site focused on discussion."
  - q: "Is Lemmy a good Reddit alternative?"
    a: "Lemmy describes itself as a decentralised discussion platform with upvotes, threaded comments and communities, and says all the important features from Reddit are available. You join one server and can follow communities on others."
  - q: "Which Reddit alternative has a free API?"
    a: "Lemmy, PieFed and Mbin answered public read requests without a key when checked on 28 November 2026. Reddit answered the same kind of anonymous request with HTTP 403."
---

# Where to go instead of Reddit: four alternatives compared

<p class="post-meta">Halit Sever · 28 November 2026</p>

People look for a Reddit alternative for many reasons, from how the site is run to which apps still work with it. This post compares four options using what each project says about itself, and adds one thing a developer cares about: whether you can read posts without an API key. That question is why [random-memes](/) moved from Reddit to Lemmy.

## The short version

| | Lemmy | PieFed | Mbin | Tildes |
| --- | --- | --- | --- | --- |
| Model | Federated (many servers) | Federated | Federated | One site |
| Talks to other fediverse software | Yes | Yes (ActivityPub) | Yes (ActivityPub) | No |
| Sign-up | Pick a server | Pick a server | Pick a server | Invite only |
| Self-host | Yes | Yes | Yes | Code is open (AGPLv3) |
| Ads | No | No | Not stated on its home page | Not stated; its docs ask for donations |
| Public read API without a key | Yes (`/api/v3`) | Yes (`/api/alpha`) | Yes (`/api`) | Not covered here |

The API row comes from requests made on 28 November 2026, described below. The rest is from each project's own pages on the same day.

## Lemmy

[join-lemmy.org](https://join-lemmy.org/) calls Lemmy "a decentralised discussion platform for communities". It has upvotes and downvotes, sort options and threaded comments, and the page says "all the important features from Reddit are available". It lists more than a dozen apps for iOS, Android, desktop and web, and states that Lemmy is not controlled by any company, with no profit motive, advertising or user tracking.

Lemmy is federated: you create an account on one server, such as lemmy.world or lemmy.ml, and can join communities hosted on others. That is the main adjustment for people coming from Reddit, and the thing that makes it hard for one company to change the rules for everyone. [Building on Lemmy or Reddit: what a developer gets from each](/blog/lemmy-vs-reddit) compares the two in more depth.

## PieFed

[PieFed](https://join.piefed.social/) presents itself as an ad-free forum: "Federated, open-source, ad-free", with no ads, no tracking and no addictive algorithms. Posts on one server can be seen and discussed from any other, over ActivityPub, so PieFed communities and Lemmy communities can talk to each other. It is written in Python and AGPL licensed, and runs a flagship server at piefed.social.

## Mbin

[Mbin](https://joinmbin.org/) is "a decentralized content aggregator, voting, discussion and microblogging platform running on the fediverse network". It is a community fork of /kbin and says it can communicate with Kbin, Mastodon, Lemmy, Pleroma and PeerTube. The microblogging side means Mbin shows link threads and short posts in one place, which makes it a middle ground between Reddit and Mastodon.

## Tildes

[Tildes](https://tildes.net/) is a single site, not a federated network. Its registration page says registration is invite-only and needs a valid invite code. Its [implementation notes](https://docs.tildes.net/philosophy/site-implementation) say the code is licensed under AGPLv3, which its creator describes as a commitment similar to organizing as a non-profit. Topics live in groups such as `~tech` or `~games`.

## For developers: reading posts without a key

Reddit asks developers to request access and authenticate with OAuth ([how to get a Reddit API key](/blog/reddit-api-key)). An anonymous request to `https://www.reddit.com/r/memes/hot.json?limit=1` answered HTTP 403 on 28 November 2026, which is the same answer that made random-memes deprecate its `reddit()` function.

The fediverse options answered the equivalent request without credentials, each with a descriptive `User-Agent` header:

| Request | Status |
| --- | --- |
| `GET https://lemmy.world/api/v3/post/list?community_name=memes&sort=Hot&limit=1` | 200 |
| `GET https://piefed.social/api/alpha/post/list?sort=Hot&limit=2` | 200, posts shaped like Lemmy's (`post`, `community`, `counts`) |
| `GET https://fedia.io/api/magazines?perPage=1` (an Mbin server) | 200 |
| `GET https://www.reddit.com/r/memes/hot.json?limit=1` | 403 |

Open does not mean unlimited. These servers are often run by volunteers, so cache answers and keep request rates low. random-memes reads one page per community and keeps it for 10 minutes ([the Lemmy API post](/blog/lemmy-api) shows the call and its fields).

## Which one to try

- **You want Reddit's format and many communities:** Lemmy, on a large general server.
- **You want the same network with a different interface or moderation tools:** PieFed or Mbin. Both federate with Lemmy.
- **You want a smaller, discussion-first site:** Tildes, if you can get an invite.
- **You are building a bot or app:** any of the three federated ones gives you posts without a key. For memes specifically, `npm install random-memes` does the Lemmy part for you, with NSFW posts filtered out ([how the filter works](/blog/lemmy-nsfw-filter)).

## FAQ

<Faq />

## Related

- [Building on Lemmy or Reddit: what a developer gets from each](/blog/lemmy-vs-reddit): access and data rules compared
- [Is the Reddit API free?](/blog/is-reddit-api-free): what free access covers
- [Lemmy API in JavaScript](/blog/lemmy-api): the post list call and its fields
- [Random meme page](/random-meme/): Lemmy memes in your browser
