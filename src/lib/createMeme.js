const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
var dataURL, buffer;

var createMeme = async function(...args) {
  const canvas = createCanvas(500, 500);
  const ctx = canvas.getContext("2d");

  function drawText(text, x, y) {
    let maxWidth = 50,
      minWidth = 1,
      imageWidth = canvas.width,
      font;
    ctx.fillStyle = "white";
    args[1]["font"] === undefined
      ? (font = "Impact")
      : (font = args[1]["font"]);
    ctx.font = maxWidth + "px" + font;

    while (true) {
      minWidth = maxWidth--;
      ctx.font = minWidth + "px " + font;
      ctx.strokeStyle = "black";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      let newtextwidth = ctx.measureText(text).width + x;
      if (newtextwidth < imageWidth) break;
    }

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  if (args[0] === undefined || args[1] === undefined)
    throw new Error("Error!: Invalid argument type");
  await loadImage(args[0]).then(img => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let toptextposx = 10,
      toptextposy = 60,
      bottomtextposx = 10,
      bottomtextposy = 450; // Fixed values if arguments is missing

    if (
      (!args[1]["bottomtext-x"] === undefined,
      undefined && !args[1]["bottomtext-y"] === undefined)
    )
      (bottomtextposx = args[1]["bottomtext-x"]),
        (bottomtextposy = args[1]["bottomtext-y"]);
    if (
      !args[1]["toptext-x"] === undefined &&
      !args[1]["toptext-y"] === undefined
    )
      (toptextposx = args[1]["toptext-x"]),
        (toptextposy = args[1]["toptext-y"]);

    args[1]["toptext"] === undefined
      ? false
      : drawText(args[1]["toptext"], toptextposx, toptextposy);

    args[1]["bottomtext"] === undefined
      ? false
      : drawText(args[1]["bottomtext"], bottomtextposx, bottomtextposy);

    if (args[1]["savefile"] === true) {
      if (
        args[1]["fileformat"] === undefined ||
        args[1]["filename"] === undefined
      )
        throw new error("Error!: File format or file name not found");
      const buffer = canvas.toBuffer("image/" + args[1]["fileformat"]);
      fs.writeFileSync(
        "./" + args[1]["filename"] + "." + args[1]["fileformat"],
        buffer
      );
    }

    dataURL = canvas.toDataURL();
  });
  if (args[1]["getdataurl"] === true) return dataURL;
  if (args[1]["getbuffer"] === true) return buffer;
};

module.exports = {
  createMeme: createMeme
};