---
title: "Meme Generator API vs Random Meme API"
titleTemplate: false
description: "A meme generator API puts your text on a template; a random meme API returns memes people made. How Imgflip, memegen.link and random-memes differ."
date: 2026-11-28
faq:
  - q: "What is a meme generator API?"
    a: "An API that takes a template and your caption text and returns a new meme image. Imgflip's caption_image endpoint and memegen.link are two examples."
  - q: "Is there a free meme generator API?"
    a: "memegen.link is free and open source, and builds the image from the URL itself, with no key. Imgflip's caption_image is free with an API key, adds an Imgflip watermark on free accounts, and has paid premium endpoints."
  - q: "What is a random meme API?"
    a: "An API that returns an existing meme, picked at random from a source such as a community. random-memes does this for Node.js from Lemmy meme communities, returning the image URL, caption, community and post link."
  - q: "Which one should a chat bot use?"
    a: "Use a generator when users write the caption, for example /meme drake \"top\" \"bottom\". Use a random meme API when the bot should post something funny without input."
---

# Generating memes or fetching them: two kinds of meme API

<p class="post-meta">Halit Sever · 28 November 2026</p>

People search for "meme API" meaning two different things. A **meme generator API** draws your text onto a template and gives back a new image. A **random meme API** gives back a meme someone already made and posted. They solve different problems, and picking the wrong one leads to awkward workarounds. Here are both kinds with one example each, checked on 28 November 2026.

## The difference in one table

| | Meme generator API | Random meme API |
| --- | --- | --- |
| Input | a template and caption text | nothing, or a category |
| Output | a new image with your text | an existing meme with its title and source |
| Typical use | "make a meme" commands, meme makers | "post a meme" commands, feeds, fun widgets |
| Examples | Imgflip `caption_image`, memegen.link | random-memes (Lemmy) |

## Generator example: memegen.link

[memegen.link](https://memegen.link) is a free, open-source (MIT) meme generator. The image is built from the URL, so there is no request body and no key:

```txt
https://api.memegen.link/images/buzz/memes/memes_everywhere.png
```

The first path part is the template, the rest are the text lines, with `_` for spaces. `https://api.memegen.link/templates/` lists the templates; it returned 209 of them when checked.

## Generator example: Imgflip

[Imgflip's API](https://imgflip.com/api) has a free `get_memes` endpoint that lists 100 popular templates, and a `caption_image` endpoint that takes a `template_id` with `text0`/`text1` (or `boxes`) and returns a captioned image. `caption_image` needs an API key. On free accounts the watermark text is limited to Imgflip's own, and other endpoints, such as GIF captions and search, are part of a paid premium plan.

## Random meme example: random-memes

[random-memes](/) is a random meme API for Node.js. It reads three Lemmy meme communities and returns one image post:

```javascript
const { random } = require("random-memes");

const meme = await random();
// {
//   image: "https://lemmy.world/pictrs/image/....png",
//   category: "memes",
//   caption: "the post title",
//   permalink: "https://lemmy.world/post/..."
// }
```

No key, no template, no input. It skips NSFW, removed, deleted and pinned posts, and caches the list for 10 minutes. You can see the same memes on the [random meme page](/random-meme/).

## Choosing

- **Your users write the joke**: a generator. A `/meme drake "writing tests" "shipping"` command maps directly onto a template and two lines of text.
- **You want something funny without input**: a random meme API. A `/meme` command with no arguments, a daily meme in a channel, a 404 page with a meme.
- **You want both**: they combine fine. A bot can have `/meme` for a random one and `/makememe` for a generated one.

## Why random-memes does not generate memes

It started as a way to fetch memes from Reddit for chat bots, and the job has stayed the same since it moved to Lemmy: return a real meme that someone posted, with a link back to the post so the original poster gets the credit. Generating images would need templates, fonts and image rendering, which would end the package's zero-dependency design.

## FAQ

<Faq />

## Related

- [Build a Discord meme bot](/blog/discord-meme-bot): a `/meme` command with random-memes
- [Meme API as JSON](/meme-api): serve random memes from your own endpoint
- [Random memes in the terminal](/blog/random-memes-cli): the CLI
- [Lemmy API in JavaScript](/blog/lemmy-api): where the memes come from
