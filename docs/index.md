---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Random Meme API for Node.js
description: "random-memes is a random meme API for Node.js with a CLI: get a meme image, caption and link from Lemmy in one call, with no API key and zero dependencies."

hero:
  name: "Random Memes"
  text: "Random meme API for Node.js"
  tagline: Get a random meme from Lemmy in one call or one command. No API key, zero dependencies.
  actions:
    - theme: brand
      text: Get Started
      link: /usage
    - theme: alt
      text: See a random meme
      link: /random-meme/
    - theme: alt
      text: Github Repository
      link: https://github.com/halitsever/random-memes
  image:
    src: /favicon.png
    alt: Random Memes Icon

features:
  - title: Simple
    icon: ✋
    details: Simple integration, let random-memes cook
  - title: Fresh memes
    icon: 🎲
    details: Picks a random image post from Lemmy meme communities, with image, caption, category and a link to the post
  - title: CLI
    icon: 💻
    details: Run npx random-memes to get a meme in your terminal
---

## A random meme generator for bots and apps

random-memes is a Node.js package that picks a random image post from Lemmy meme communities and returns its image URL, caption, community and post link. Use it to add memes to a Discord or Telegram bot, a web page or a terminal script. To call it from other languages, see how to [serve it as your own meme API](/meme-api).

```javascript
import { random } from "random-memes";

const { image, caption } = await random();
```

## What a call gives you

Each call to `random()` resolves to a plain object with four fields: `image`, a direct link to a JPEG, PNG, GIF or WebP file; `caption`, the post title; `category`, the Lemmy community the post came from; and `permalink`, a link to the original post. That is enough to post the image in a chat, show it on a page or credit the source.

## How it works

The package reads the hot posts of three Lemmy meme communities through Lemmy's public API, using the `fetch` built into Node.js. It drops pinned, NSFW, removed and non-image posts, merges cross-posts that share an image, and keeps the result in memory for 10 minutes. Calls in that window pick from the cached list without sending new requests, so a busy bot does not flood the Lemmy instances. If one community is down, the other two are still used.

There is no hosted server between you and Lemmy and nothing to sign up for. Your process talks to the instances directly.

## Requirements

- Node.js 20 or newer.
- Network access to lemmy.world and lemmy.ml.

The package ships its own TypeScript declarations and works with both `require` and named ES module imports.

## Where to go next

- [Usage](/usage): installation, CommonJS, ES modules, TypeScript, the CLI and error handling.
- [random()](/random): the communities, the filters, the cache and when a call rejects.
- [Meme API](/meme-api): serve memes as JSON from your own HTTP endpoint.
- [reddit()](/reddit): the deprecated Reddit method, kept until v5.
