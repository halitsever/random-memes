const { random } = require("./lib/random");
const { fromReddit } = require("./lib/fromReddit");
const { createMeme } = require("./lib/createMeme");
const { createDuoMeme } = require("./lib/createDuoMeme");
const { registerCustomFont } = require("./lib/registerCustomFont");

module.exports = {
  fromReddit: fromReddit,
  random: random,
  createMeme: createMeme,
  createDuoMeme: createDuoMeme,
  registerCustomFont: registerCustomFont
};