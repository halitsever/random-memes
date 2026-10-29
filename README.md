<p align="center" class="logo-section">
<img src="https://i.ibb.co/yRSmZ6G/leo-laughing-1.png" height="80" width="80"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Random%20Memes">

<p align="center">
🌁 Random meme generator module for Node.js<br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever"/> 
<img src="https://img.shields.io/github/license/halitsever/random-memes"/> 
</p>
<p align="center">
<a align="center" href="https://halitsever.github.io/random-memes/">Documentation</a>
  </p>
</p>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</a>

- 🎲 [**Fresh memes**](#) - Random image posts from [Lemmy](https://join-lemmy.org) meme communities

- 🗒️ [**Text and Image**](#) - Get random memes as text & image

- 💻 [**CLI**](#) - Run `npx random-memes` to get a meme in your terminal

- 📦 [**Zero dependencies**](#) - Uses the `fetch` built into Node.js, ships TypeScript types

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

<a align="center">
<img src="https://halitsever-api.vercel.app/api/sponsor"/>
</a>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/license"/>
</a>

<p align="center">
  MIT LICENSE 2019-present | <a href="https://github.com/halitsever">Halit Sever</a>
</p>
