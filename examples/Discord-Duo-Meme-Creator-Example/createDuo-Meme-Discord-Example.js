const Discord = require("discord.js");
const memes = require("random-memes");
const client = new Discord.Client();

client.on("message", async msg => {
  if (msg.content.startsWith("/bear")) {
    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.member(user);
      if (member) {
        const member = msg.guild.member(user);
        if (member) {
          const Discord = require("discord.js");

          let memecontent = {
            photo1: user.displayAvatarURL,
            "photo1-x": 130,
            "photo1-y": 130,
            photo2: user.displayAvatarURL,
            "photo2-x": 300,
            "photo2-y": 150,
            getbuffer: true
          };
          msg.reply("Meme generating... Please wait.");
          memes
            .createDuoMeme(
              "https://cdn.pixabay.com/photo/2016/04/15/21/33/bear-1332002_960_720.jpg",
              memecontent
            )
            .then(meme => {
              console.log(meme);
              msg.channel.send(
                new Discord.Attachment(meme, "your-filename.png")
              );
            });
        }
      }
    } else {
      msg.reply("Member not found");
    }
  }
});

client.login("TOKEN");
