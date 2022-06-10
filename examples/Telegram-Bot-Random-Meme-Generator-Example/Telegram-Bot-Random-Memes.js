const memes = require("random-memes");
const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("TOKEN");

bot.command("memever", msg => {
  memes.fromReddit("en").then(meme => {
    msg.replyWithPhoto(meme.image);
  });
});

bot.launch();