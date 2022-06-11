const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
var dataURL, buffer;

var createDuoMeme = async function (...args) {

  let canvaswidth = args[1]["picturewidth"] != undefined ? args[1]["picturewidth"] : 500;
  let canvasheight = args[1]["pictureheight"] != undefined ? args[1]["pictureheight"] : 500;

  const canvas = createCanvas(canvaswidth, canvasheight);
  const ctx = canvas.getContext("2d");

  if (args[0] === undefined) throw new Error("Error!: Source Image not found");
  await loadImage(args[0]).then(async img => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let i = 1;

    await loadImage(args[1]["photo" + i]).then(img => {
      while (i < 3) {
        ctx.arc(
          args[1]["photo" + i + "-x"] + 40,
          args[1]["photo" + i + "-y"] + 40,
          40,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        ctx.save();

        ctx.clip();

        ctx.drawImage(
          img,
          args[1]["photo" + i + "-x"],
          args[1]["photo" + i + "-y"],
          80,
          80
        );
        ctx.restore();

        i++;
      }
    });




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
    buffer = canvas.toBuffer();
  });

  if (args[1]["getdataurl"] === true) return dataURL;
  if (args[1]["getbuffer"] === true) return buffer;
};

module.exports = {
  createDuoMeme: createDuoMeme
};