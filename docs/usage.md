# Get random meme from our API:

```javascript
const memes = require("random-memes");

const fetchMeme = async () => {
  const meme = await memes.random();
  console.log(meme);
};
```

# Get random meme from Reddit API:

```javascript
const memes = require("random-memes");

const fetchMeme = async () => {
  const meme = await memes.reddit({ locale: "en" });
  console.log(meme);
};
```
