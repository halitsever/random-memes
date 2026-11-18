---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Random Meme API for Node.js
description: "random-memes is a random meme API for Node.js with a CLI. Get a random meme image, caption and link from Lemmy communities in one call, with no API key and zero dependencies."

hero:
  name: "Random Memes"
  text: "Random meme API for Node.js"
  tagline: Get a random meme from Lemmy in one call or one command. No API key, zero dependencies.
  actions:
    - theme: brand
      text: Get Started
      link: /usage
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
