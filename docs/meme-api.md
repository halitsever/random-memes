---
title: "Meme API: Get Random Memes as JSON"
description: "Use random-memes as a random meme API in Node.js: get a meme as JSON from Lemmy with no API key, or serve it from your own HTTP endpoint."
---

# Meme API: random memes as JSON in Node.js

random-memes gives your Node.js code a random meme API without signing up anywhere. There is no hosted server and no API key: `random()` calls the public post API of a few [Lemmy](https://join-lemmy.org) meme communities from your own process and hands back one meme.

If you were looking for a Reddit meme API: Reddit now blocks most requests that are not signed in, so random-memes v4 takes its memes from Lemmy instead. The old `reddit()` method still exists but is [deprecated](/reddit).

## What a call returns

```javascript
const { random } = require("random-memes");

const meme = await random();
```

A real response looks like this:

```json
{
  "image": "https://feddit.org/pictrs/image/e3ac8edd-8d82-4ddd-8ae7-6c5f12927774.jpeg",
  "category": "dankmemes",
  "caption": "You probably went over a bump or something.",
  "permalink": "https://feddit.org/post/28681401"
}
```

`image` is a direct link to a JPEG, PNG, GIF or WebP file, so you can drop it into an `<img>` tag or a chat bot embed. `category` is the Lemmy community and `permalink` points at the original post.

## Serve it as your own meme API endpoint

To get memes from a browser, another language or a no-code tool, wrap `random()` in a small HTTP server. This one uses only `node:http`, so it adds no dependencies:

```javascript
import { createServer } from "node:http";
import { random } from "random-memes";

createServer(async (req, res) => {
  try {
    const meme = await random();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(meme));
  } catch (error) {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
}).listen(3000);
```

Save it as `server.mjs`, run `node server.mjs`, and every request to `http://localhost:3000` returns a new random meme as JSON.

## Random memes from the command line

The same data is one command away, which is handy for shell scripts:

```bash
npx random-memes --json
```

## Where the memes come from

Each fetch reads up to 50 hot posts from memes@lemmy.world, dankmemes@lemmy.world and memes@lemmy.ml. Pinned, NSFW, removed and non-image posts are dropped, and duplicates shared across communities are merged. The list is kept for 10 minutes, so calls in that window pick from the same set of memes and send no new requests to Lemmy. See [random()](/random) for the details and [Usage](/usage#errors) for error handling.
