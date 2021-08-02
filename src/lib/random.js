const fetch = require("node-fetch");
const fs = require("fs");

var random = async function(subredditlocale) {
  await fetch("https://some-random-api.ml/meme")
    .then(res => res.json())
    .then(
      json =>
        (meme = {
          image: json.image,
          category: json.category,
          caption: json.caption,
          id: json.id
        })
    );
  return meme;
};

module.exports = {
  random: random
};