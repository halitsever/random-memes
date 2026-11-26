---
description: "Install random-memes, get a random meme in Node.js with CommonJS, ES modules or TypeScript, use the CLI and handle errors."
---

# Usage

## Installation

```bash
npm install random-memes
```

Requires Node.js 20 or newer. The package has no runtime dependencies: requests go through the `fetch` built into Node.js. CI runs the tests on Node.js 20, 22 and 24.

## Get a random meme

CommonJS:

```javascript
const { random } = require("random-memes");

const fetchMeme = async () => {
  const meme = await random();
  console.log(meme); // { image, category, caption, permalink }
};
```

ES modules:

```javascript
import { random } from "random-memes";

const meme = await random();
```

TypeScript types ship with the package:

```typescript
import { random, type Meme } from "random-memes";

const meme: Meme = await random();
```

Every call resolves to a new object, so you can change its fields without affecting later calls. The first call fetches the meme list from Lemmy, and calls in the next 10 minutes reuse it. See [random()](/random) for how that cache works.

## Use it in a bot

The returned `image` is a direct file link, which most chat platforms accept as a photo or an embed. A command handler usually needs only a few lines:

```javascript
const { random } = require("random-memes");

const memeReply = async () => {
  const { image, caption, permalink } = await random();
  return { photo: image, text: `${caption}\n${permalink}` };
};
```

Pass `photo` and `text` to whatever send method your bot library uses.

## Command line

```bash
npx random-memes          # caption, image URL and post link
npx random-memes --json   # the whole meme as JSON
npx random-memes --help   # list the options
```

Without `--json`, the command prints the caption, the image URL and the post link on three lines, which is easy to read in a shell script. If no meme can be fetched, it prints the error message to stderr and exits with code 1.

## Errors

Both methods reject with an `Error` when they cannot return a meme, and the original error is on `error.cause`. For `random()` that is an `AggregateError` with one error per failed community. HTTP failures carry the status code on `status`.

```javascript
try {
  await random();
} catch (error) {
  console.error(
    error.message,
    error.cause?.errors?.map((e) => e.status),
  );
}
```

Each request to Lemmy times out after 30 seconds, and a timeout counts as a failed community. The messages you can see from `random()` are:

- `Failed to fetch memes from Lemmy`: every community failed. Check `error.cause.errors` for the reasons.
- `No image posts found on Lemmy`: the communities answered, but none had a usable image post.

## Upgrading from v3

See the [changelog](https://github.com/halitsever/random-memes/blob/main/CHANGELOG.md) for the breaking changes in v4.
