<!--
  Title: Random Meme Generator, random-memes
  Description: Random reddit & custom api meme genarator and custom meme maker module for node.js
  Author: halitsever
  -->
<h1>random-memes Random Meme Generator</h1>
<img align="right" width="250" height="250" src="https://i.ibb.co/VC9QTCk/68747470733a2f2f692e6962622e636f2f705774425876462f59656e692d50726f6a652e706e67-2.png">
<p align="left"> 
Random reddit & custom api meme genarator and custom meme maker module for node.js
<br>
<a><b><a href="https://github.com/halitsever/random-memes/wiki/Documentation">Documentation Page</a></b></a><br>
What can be done with random-memes?:<br>
<a><b><a href="#random-memes-custom">Create your own memes with random-memes!</a></b></a><br>
<a><b><a href="#random-memes">Create random meme with custom api</a></b></a><br>
<a><b><a href="#random-memes-reddit">Create random meme with reddit api</a></b></a><br>





<a name="random-memes"></a>  
</p>
<h1>Get random memes from custom api</h1>
<code>const memes = require("random-memes");</code>
<p></p>
<code>memes.random().then(meme => {</code>
<p></p>
<code>console.log("Meme generated: " + meme.image)</code><p></p>
<code>//returns image link</code>

<p></p><code>console.log("Category: " + meme.category)</code><p></p>
<p></p><code>//returns category</code><p></p>

<code>console.log("Caption: " + meme.caption)</code><p></p>
<code>//returns image caption</code>

<code>console.log("ID: " + meme.id)</code><p></p>
<code>//returns id</code>

<code>})</code><br>

<a name="random-memes-reddit"></a>  
<img width="250" height="250" src="https://i.ibb.co/NZbLZPQ/68747470733a2f2f692e6962622e636f2f5643395154436b2f36383734373437303733336132663266363932653639363236.png" align="left">
<h1>Get random memes from reddit api</h1>
<code>
const memes = require("random-memes");</code><br>
<code>memes.fromReddit("en").then((meme)=>{</code><br>
<code>console.log(meme);</code><br>
<code>console.log(meme.image);</code><br>
<code>})</code>



<a name="random-memes-custom"></a>  
<br><br>
  <h1>Make your own memes! with random-memes</h1>
  <img src="https://i.ibb.co/M87921Q/Ba-l-ks-z.png">
  <code>let memecontent = {<p></p>
    toptext: req.body.toptext,<p></p>
    bottomtext: req.body.bottomtext,<p></p>
    getdataurl: true<p></p>
    // getbuffer: true,<p></p>
    // savefile: true,<p></p>
    // filename: "filename",<p></p>
    // fileformat: "png"<p></p>
  };<p></p>
  memes.createMeme("IMAGE_URL", memecontent).then(meme => {<p></p>
    <p></p>console.log(meme)<p></p>
    // returns dataurl, if you want save file or get buffer data just edit memecontent object<p></p>
  });
</code>
<p align="center">Also you can check <a href="https://github.com/halitsever/random-memes/tree/main/examples">online meme creator example</a></p>
<p align="center"><a align="center" href="https://github.com/halitsever/random-memes/wiki/Documentation">and documentation page</a></p>


  <h1>Write code to have fun with your friends
</h1>

  <img align="left" src="https://i.ibb.co/X5fcJBx/hey.png">
  
  <code>let memecontent = {</code><br>
  <code>  "photo1: "./me.png",</code><br>
  <code>  "photo1-x": 130,</code><br>
  <code>  "photo1-y": 130,</code><br>
  <code>  photo2: "./myfriend.png",</code><br>
  <code> "photo2-x": 300,</code><br>
  <code>  "photo2-y": 150,</code><br>
  <code>  savefile: true,</code><br>
  <code> filename: "wmyfriend",</code><br>
  <code>  fileformat: "png"</code><br>
  <code>};</code><br>
  <code>memes</code><br>
  <code> .createDuoMeme(</code><br>
    <code>  "./bear.png",  memecontent);</code>
  </a><br>
  <b>All Examples:</b><br>
  <b><a href="https://github.com/halitsever/random-memes/blob/main/examples/Telegram-Bot-Random-Meme-Generator-Example/Telegram-Bot-Random-Memes.js">Telegram (Telegraf.js) Random-Meme Generator</a></b>
  <br>  <b><a href="https://github.com/halitsever/random-memes/blob/main/examples/Discord-Duo-Meme-Creator-Example/createDuo-Meme-Discord-Example.js">Discord (Discord.js) Create Duo Meme</a></b>
    <br> <b><a href="https://github.com/halitsever/random-memes/tree/main/examples/Online-Express-Meme-Creator-Example">Online Meme Creator with Express.js</a></b>
        <br> <b><a href="https://github.com/halitsever/random-memes/blob/main/examples/Get-Reddit-Posts-Example/Get-Reddit-Memes.js">Get Reddit Memes</a></b>

</a>
<br>
<br>
