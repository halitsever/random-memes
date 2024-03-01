<p align="center" class="logo-section">
<img src="https://i.ibb.co/427dNQk/troll-face-1.png" height="80" width="80"/>
</br>
<img src="https://halitsever-api.vercel.app/api/repo-title?title=Random%20Memes">

<p align="center">
🌁 Random reddit & custom api meme genarator and custom meme maker module for node.js<br>
<br/>
<br/>
<img src="https://img.shields.io/github/sponsors/halitsever"/> 
<img src="https://img.shields.io/github/license/halitsever/repo_name"/> 
</p>
<p align="center">
<a align="center" href="https://halitsever.github.io/random-memes/">Documentation</a>
  </p>
</p>

<a align="center">
<img src="https://halitsever-api.vercel.app/api/details"/>
</a>

- 🧑‍💻 [**Reddit Support**](#) - You can fetch random memes on reddit

- 🗒️ [**Text and Image**](#) - Get random memes as text & image

- 🌏 [**API**](#) - You can self host our random memes API

  <a align="center" >
  <img src="https://halitsever-api.vercel.app/api/installation"/>
  </a>

Installation:

```bash
npm install random-memes --save
```

JS Example:

```javascript
const memes = require("memes");

const fetchMeme = async () => {
  const meme = await memes.image.reddit({ locale: "en" });
  console.log(meme);
};
```

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
