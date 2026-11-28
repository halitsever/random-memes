---
title: "Random Memes in the Terminal With npx"
titleTemplate: false
description: "Get a random meme in your terminal with npx random-memes: caption, image URL and post link, JSON output for jq, and a meme in your shell greeting."
date: 2026-11-28
faq:
  - q: "How do I get a random meme in the terminal?"
    a: "Run npx -y random-memes. It prints a random meme's caption, image URL and post link from Lemmy meme communities. It needs Node.js 20 or newer and no API key."
  - q: "Can the random-memes CLI print JSON?"
    a: "Yes. npx -y random-memes --json prints an object with image, category, caption and permalink, which you can pipe into jq."
  - q: "Can I see the meme image in the terminal?"
    a: "Download it and use your terminal's image support, for example kitten icat in kitty, or a tool such as chafa that draws images in most terminals."
  - q: "Why does the link sometimes point to a site other than Lemmy?"
    a: "Lemmy communities federate with other platforms. A post made from another fediverse server keeps its original address as the post link, and its image may be hosted there too."
---

# A random meme in your terminal, one npx command away

<p class="post-meta">Halit Sever · 28 November 2026</p>

random-memes ships a small command-line tool next to its Node.js API. One command prints a random meme from Lemmy's meme communities. This post shows the output formats and a few ways to use it in shell scripts. Every output below is from real runs on 28 November 2026.

## One command

```bash
npx -y random-memes
```

```txt
He didn’t even said Thank You!
https://media.piefed.zip/posts/yy/nQ/yynQkVU2zaTn9lO.jpeg
https://piefed.zip/c/dankmemes/p/1194870/he-didnt-even-said-thank-you
```

Three lines: the caption, the image URL and the post link. `-y` skips npx's "Ok to proceed?" question on the first run. To keep it installed:

```bash
npm install -g random-memes
random-memes
```

It needs Node.js 20 or newer and has no dependencies.

That example shows something about Lemmy: communities federate with other fediverse software, so a post can come from a PieFed server, keep its original link, and have its image hosted there.

## JSON output

```bash
npx -y random-memes --json
```

```json
{
  "image": "https://lemmy.ml/pictrs/image/94d58c90-c6ec-45a1-96d7-be1d73dcaab3.png",
  "category": "memes",
  "caption": "Why would I deceive you",
  "permalink": "https://lemmy.ml/post/55442873"
}
```

The fields are the same ones `random()` returns in code. With `jq`, pick what you need:

```bash
npx -y random-memes --json | jq -r .image
```

## Save the image

```bash
url=$(npx -y random-memes --json | jq -r .image)
curl -sL -o "meme.${url##*.}" "$url"
```

`${url##*.}` keeps the file extension from the URL: random-memes only returns links ending in `.jpg`, `.jpeg`, `.png`, `.gif` or `.webp`.

## Show it in the terminal

Terminals that can draw images:

```bash
kitten icat meme.png        # kitty
chafa meme.png              # most terminals, with the chafa package
```

## A meme in your shell greeting

For Bash, at the end of `~/.bashrc`:

```bash
# A random meme caption and link in every new interactive shell.
[[ $- == *i* ]] && command -v random-memes >/dev/null && random-memes 2>/dev/null | sed -n '1p;3p'
```

`sed -n '1p;3p'` prints the caption and the post link and leaves out the image URL. The `2>/dev/null` keeps a failed request from cluttering the prompt. It runs on every new shell, so use the globally installed command rather than `npx`, which may check the npm registry first.

For fish, in `~/.config/fish/functions/fish_greeting.fish`:

```fish
function fish_greeting
    random-memes 2>/dev/null | sed -n '1p;3p'
end
```

## Exit codes and errors

The command exits with `0` on success. When no community can be reached, or none returns an image post, it prints the error message to stderr and exits with `1`:

```txt
Failed to fetch memes from Lemmy
```

So `random-memes || echo "no meme today"` works as expected in scripts.

## The same memes elsewhere

- In a browser: the [random meme page](/random-meme/) reads the same communities.
- In code: `const { random } = require("random-memes")`. See [Usage](/usage).
- Over HTTP: [Meme API as JSON](/meme-api) wraps `random()` in an endpoint.

## FAQ

<Faq />

## Related

- [Build a Discord meme bot](/blog/discord-meme-bot): the same memes as a slash command
- [Generating memes or fetching them: two kinds of meme API](/blog/meme-generator-api): which one you need
- [Lemmy API in JavaScript](/blog/lemmy-api): what the CLI requests
- [random()](/random): how a meme is picked
