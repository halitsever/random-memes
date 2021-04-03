const fetch = require("node-fetch");
var meme, image, category, caption, id;
class random_memes {
  async random() {
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
  }
}

module.exports = new random_memes();
