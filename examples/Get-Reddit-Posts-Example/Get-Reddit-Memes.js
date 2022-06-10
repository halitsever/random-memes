const memes = require("random-memes");


// You can also use: br,de,en,es,fr,in:,it,ru,tr
memes.fromReddit("en").then((meme)=>{ 
    console.log(meme)
})