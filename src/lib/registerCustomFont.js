const { registerFont } = require("canvas");

var registerCustomFont = function (fontpath, fontname) {
  registerFont(fontpath, { family: fontname });
};

module.exports = {
  registerCustomFont: registerCustomFont
};