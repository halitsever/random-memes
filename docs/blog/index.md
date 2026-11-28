---
title: "Random Memes Blog: Meme APIs, Lemmy and Bots"
titleTemplate: false
description: "Guides on meme APIs, the Reddit and Lemmy APIs, Reddit alternatives, meme bots and fetch in Node.js, written from the package source and official docs."
---

# Random Memes blog

Notes from building [random-memes](/), a random meme API for Node.js: where memes can come from, what the Reddit and Lemmy APIs require, and how to put memes in a bot or a terminal. To just look at memes, open the [random meme page](/random-meme/).

<ul class="post-list">
  <li>
    <a href="./reddit-api-key.html">Getting a Reddit API key, and the route that needs none</a>
    <p>Reddit's approval requirement, OAuth, User-Agent rules and rate limits.</p>
  </li>
  <li>
    <a href="./is-reddit-api-free.html">Is the Reddit API free?</a>
    <p>What free access covers, what needs written approval, and the 403 without auth.</p>
  </li>
  <li>
    <a href="./discord-meme-bot.html">A /meme slash command for Discord with discord.js</a>
    <p>A /meme slash command with discord.js and random-memes in about 40 lines.</p>
  </li>
  <li>
    <a href="./lemmy-vs-reddit.html">Building on Lemmy or Reddit: what a developer gets from each</a>
    <p>Access, limits, federation and data rules compared.</p>
  </li>
  <li>
    <a href="./lemmy-api.html">Reading a Lemmy community's posts from JavaScript</a>
    <p>The request, the response fields, paging and the 50-post limit.</p>
  </li>
  <li>
    <a href="./meme-generator-api.html">Generating memes or fetching them: two kinds of meme API</a>
    <p>Imgflip, memegen.link and random-memes, and which one a bot needs.</p>
  </li>
  <li>
    <a href="./lemmy-nsfw-filter.html">Keeping NSFW and removed posts out of a Lemmy feed</a>
    <p>The post and community flags, removed and pinned posts, image-only links.</p>
  </li>
  <li>
    <a href="./random-memes-cli.html">A random meme in your terminal, one npx command away</a>
    <p>Plain and JSON output, saving the image, and a meme in your shell greeting.</p>
  </li>
  <li>
    <a href="./reddit-alternatives.html">Where to go instead of Reddit: four alternatives compared</a>
    <p>Lemmy, PieFed, Mbin and Tildes compared, and which answer API reads without a key.</p>
  </li>
  <li>
    <a href="./promise-allsettled.html">Wait for all, or stop at the first failure? Promise.all and Promise.allSettled</a>
    <p>Fail fast or collect every result, with a real run against three Lemmy sources.</p>
  </li>
  <li>
    <a href="./commonjs-vs-esm.html">One package, two module systems: CommonJS and ESM in Node.js</a>
    <p>How Node finds named exports in CommonJS, why a spread hides them, and require(esm).</p>
  </li>
  <li>
    <a href="./node-test-runner-mock-fetch.html">Testing fetch calls with node:test and no dependencies</a>
    <p>Mock fetch with t.mock.method, assert on calls and fake Date, with no test library.</p>
  </li>
  <li>
    <a href="./javascript-fetch-timeout.html">Giving fetch a deadline: timeouts with AbortSignal</a>
    <p>AbortSignal.timeout, TimeoutError vs AbortError, combined signals and Node's defaults.</p>
  </li>
  <li>
    <a href="./fetch-user-agent.html">Can you set the User-Agent header with fetch?</a>
    <p>Why Chrome drops it, what Node sends by default and what a bot should send.</p>
  </li>
</ul>
