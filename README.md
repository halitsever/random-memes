<p align="center" class="logo-section">
<img src="https://i.ibb.co/yRSmZ6G/leo-laughing-1.png" height="80" width="80" alt="Random Memes logo"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Random%20Memes">

<p align="center">
Random meme API for Node.js, with a CLI and TypeScript types. Fetches random meme images from Lemmy meme communities, with zero dependencies and no API key.<br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever" alt="GitHub sponsors"/> 
<a href="https://www.npmjs.com/package/random-memes"><img src="https://img.shields.io/npm/v/random-memes" alt="npm version"/></a>
<img src="https://img.shields.io/github/license/halitsever/random-memes" alt="License: MIT"/> 
</p>
<p align="center">
<a align="center" href="https://projects.halit.org/random-memes/">Documentation</a>
  </p>
</p>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</a>

- [**Fresh memes**](#) - Random image posts from [Lemmy](https://join-lemmy.org) meme communities

- [**Text and Image**](#) - Get random memes as text & image

- [**CLI**](#) - Run `npx random-memes` to get a meme in your terminal

- [**Zero dependencies**](#) - Uses the `fetch` built into Node.js, ships TypeScript types

- [**Meme API endpoint**](https://projects.halit.org/random-memes/meme-api.html) - Serve random memes as JSON from your own server

  <a align="center" >
  <img src="https://halitsever-api.vercel.app/api/installation"/>
  </a>

Installation:

```bash
npm install random-memes
```

Requires Node.js 20 or newer.

Get random meme:

```javascript
const memes = require("random-memes");

const fetchMeme = async () => {
  const meme = await memes.random();
  console.log(meme);
};
```

With ES modules:

```javascript
import { random } from "random-memes";

const meme = await random();
```

From the command line:

```bash
npx random-memes
```

> [!WARNING]
> `memes.reddit()` is deprecated and will be removed in v5. Reddit blocks most unauthenticated requests, so it fails with HTTP 403 in most environments. See the [changelog](CHANGELOG.md) for everything that changed in v4.

<a align="center" href="https://github.com/halitsever/random-memes/issues">
<img src="https://halitsever-api.vercel.app/api/issue"/>
</a>

<p align="center">
Found a bug or have an idea? Open an <a href="https://github.com/halitsever/random-memes/issues">issue</a>.<br/>
Read the <a href="CONTRIBUTING.md">contributing guide</a> before sending a pull request.
</p>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/sponsor"/>
</a>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/license"/>
</a>

<p align="center">
  MIT LICENSE 2019-present | <a href="https://github.com/halitsever">Halit Sever</a>
</p>
