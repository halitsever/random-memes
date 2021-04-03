<!--
  Title: Random Meme Generator, random-memes
  Description: Random text & image meme generator module for node.js
  Author: halitsever
  -->
<h1>random-memes Random Meme Generator</h1>
<img align="right" width="250" height="250" src="https://i.ibb.co/VC9QTCk/68747470733a2f2f692e6962622e636f2f705774425876462f59656e692d50726f6a652e706e67-2.png">
<p align="left"> 
Random text & image meme generator module for node.js



</p>
<h1>Usage</h1>
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

<code>})</code>

<h1>Example</h1>
<img align="left" width="250" height="300" src="https://i.ibb.co/nR4jWYK/hexagon-2307350-640.png">
Random memes with express example in <a href="https://github.com/halitsever/random-memes/blob/main/examples/express-random-memes.js">here</a>
