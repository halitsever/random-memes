---
title: "Random Meme: A New Meme With Every Click"
titleTemplate: false
description: "See a random meme, then another: random memes pulled live from Lemmy meme communities, with NSFW posts filtered out. One click per meme, no sign-up, no ads."
sidebar: false
aside: false
faq:
  - q: "Where do these random memes come from?"
    a: "From the hot listings of three Lemmy communities: memes and dankmemes on lemmy.world and memes on lemmy.ml. Your browser asks their public API directly each time you open the page."
  - q: "Are the memes safe for work?"
    a: "Posts that Lemmy marks NSFW, and every post from a community marked NSFW, are left out, as are removed and deleted posts. The rest is what people post to those communities, so a meme can still be crude or offensive."
  - q: "How do I report a meme?"
    a: "Use Report it on Lemmy under the meme to open the post, then report it there. Reporting needs a Lemmy account on any instance. The community's moderators handle reports."
  - q: "Can I get random memes in my own app?"
    a: "Yes. The random-memes npm package gives Node.js apps and bots the same random meme as an object with the image URL, caption, community and post link, with no API key."
---

# Random meme

A random meme from Lemmy's meme communities. Press **Next meme** for another one.

<RandomMeme />

## Where the memes come from

Each time you open this page, your browser asks three [Lemmy](https://join-lemmy.org) communities for their 50 hottest posts:

- [memes@lemmy.world](https://lemmy.world/c/memes)
- [dankmemes@lemmy.world](https://lemmy.world/c/dankmemes)
- [memes@lemmy.ml](https://lemmy.ml/c/memes)

Lemmy is open-source, federated forum software, organized in communities much like subreddits. Its API is public, so no key or account is needed to read it. The page shuffles the image posts it gets back and shows them one at a time; when it runs out, it shuffles again. Click a meme to open the original post and its comments.

## What gets filtered out

The page applies the same rules as the random-memes package:

- **Only image posts.** The link has to end in `.jpg`, `.jpeg`, `.png`, `.gif` or `.webp`. Text posts, videos and links to other sites are skipped.
- **No NSFW.** A post marked NSFW is skipped, and so is every post from a community marked NSFW.
- **No removed or deleted posts**, and no posts pinned by moderators.
- **No duplicates.** A meme cross-posted to two communities shows up once.

What is left is what people post. Lemmy's moderators remove rule-breaking posts, but a meme can still be crude. If one should not be there, use **Report it on Lemmy** under it; reporting needs a Lemmy account on any instance.

If the communities do not answer, the page says so and offers a retry instead of showing an empty frame. An image that fails to load is skipped.

## Random memes in your own app

The same memes are one function call away in Node.js, with the [random-memes](https://www.npmjs.com/package/random-memes) package:

```bash
npm install random-memes
```

```javascript
const { random } = require("random-memes");

const { image, caption, category, permalink } = await random();
```

It has no dependencies and needs no API key. It keeps the meme list for 10 minutes, so a busy bot does not hit the instances on every call. For a terminal, `npx random-memes` prints a random meme's caption, image URL and post link. [Usage](/usage) covers ES modules, TypeScript and errors, and the [Meme API](/meme-api.html) page shows how to serve memes as JSON from your own endpoint.

## FAQ

<Faq />

## Read next

- [Build a Discord meme bot](/blog/discord-meme-bot.html): a `/meme` command in discord.js
- [Lemmy API in JavaScript](/blog/lemmy-api.html): the exact request this page makes
- [Filter NSFW posts from Lemmy](/blog/lemmy-nsfw-filter.html): the filter, line by line
- [random()](/random): how the package picks a meme
