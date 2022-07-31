const fetch = require("node-fetch");
const fs = require("fs");

var random = async function () {
  let response = await fetch("https://random-memes-api.vercel.app/getmeme");
  let memeObject = await response.json();
  let meme = {
    image: memeObject.image,
    category: memeObject.category,
    caption: memeObject.caption,
    id: memeObject.id
  }
  return meme;
};

module.exports = {
  random: random
};