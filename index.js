const sn = require("snekfetch");

class memegenerator {
  async generate() {
    var { body } = await sn.get("https://some-random-api.ml/meme");
    if (body.image === undefined || body.image === null)
      return console.log("API Error");
    if (body.category === "nsfw") return;
    console.log(
      "Meme generated: " +
        body.image +
        "\nCategory: " +
        body.category +
        "\nCaption: " +
        body.caption
    );
    return body.image;
  }
}

module.exports = new memegenerator();

