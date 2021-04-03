const memes = require("./index.js");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  memes.random().then(meme => {
    res.send(
      "<img src='" +
        meme.image +
        "'> <div style='float:left'><h1>Category:<br>" +
        meme.category +
        "</h1><br> <h1>Caption:<br>" +
        meme.caption +
        "</h1> <h1>ID:<br>" +
        meme.id +
        "</h1></div>"
    );
  });
});

app.listen(8080);
