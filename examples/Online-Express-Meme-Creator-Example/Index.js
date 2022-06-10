const memes = require("random-memes");

const express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/makememe", (req, res) => {
  let memecontent = {
    toptext: req.body.toptext,
    bottomtext: req.body.bottomtext,
    getdataurl: true
  };
  memes.createMeme(req.body.imageurl, memecontent).then(meme => {
    res.send("<img src='" + meme + "'>");
  });
});

app.listen(8080);