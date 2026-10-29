# Usage

## Installation

```bash
npm install random-memes
```

Requires Node.js 20 or newer. The package has no runtime dependencies.

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

## Command line

```bash
npx random-memes          # caption, image URL and post link
npx random-memes --json   # the whole meme as JSON
```

## Errors

Both methods reject with an `Error` when they cannot return a meme, and the original error is on `error.cause`. For `random()` that is an `AggregateError` with one error per failed community. HTTP failures carry the status code on `status`.

```javascript
try {
  await random();
} catch (error) {
  console.error(error.message, error.cause?.errors?.map((e) => e.status));
}
```

## Upgrading from v3

See the [changelog](https://github.com/halitsever/random-memes/blob/master/CHANGELOG.md) for the breaking changes in v4.
