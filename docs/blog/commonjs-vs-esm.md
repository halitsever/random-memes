---
title: "CommonJS vs ESM in Node.js: Named Exports and require"
titleTemplate: false
description: "CommonJS vs ESM in Node.js: how import finds named exports in a CommonJS package, why a spread in module.exports breaks them, and what require(esm) changes."
date: 2026-11-28
faq:
  - q: "What is the difference between CommonJS and ESM?"
    a: "CommonJS uses require() and module.exports and loads synchronously. ES modules use import and export, are parsed before they run, and are the standard module system of JavaScript. Node.js supports both."
  - q: "Can I import a CommonJS package with named imports?"
    a: "Often, yes. Node.js detects named exports in CommonJS code by static analysis. It works for common patterns such as module.exports = { a, b }, but not for exports built at runtime, such as a spread."
  - q: "Can CommonJS require an ES module?"
    a: "In current Node.js, yes, for ES modules without top-level await. The feature left its flag in Node.js 22.12 and 23.0. Older versions need a dynamic import() instead."
---

# One package, two module systems: CommonJS and ESM in Node.js

<p class="post-meta">Halit Sever · 28 November 2026</p>

random-memes is written in CommonJS, yet `import { random } from "random-memes"` works. That depends on one line of its source being written a particular way, and the repository's own notes warn not to change it. This post explains why, with a small experiment you can run, and covers the rest of the CommonJS vs ESM question for package authors.

## The two systems in brief

| | CommonJS | ES modules |
| --- | --- | --- |
| Syntax | `require()`, `module.exports` | `import`, `export` |
| Loading | synchronous, at call time | parsed and linked before running |
| Top-level `await` | no | yes |
| Files | `.cjs`, or `.js` without `"type": "module"` | `.mjs`, or `.js` with `"type": "module"` |

The [Node.js ES modules docs](https://nodejs.org/docs/latest-v22.x/api/esm.html) say an `import` can load either kind. For a CommonJS module, `module.exports` becomes the default export, and "named exports may be available, provided by static analysis".

## Static analysis decides your named exports

Node reads a CommonJS file without running it and guesses its export names with [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer). The docs are honest about the limits: detection "is based on common syntax patterns but does not always correctly detect named exports".

To see it, two tiny CommonJS packages that export the same object, written two ways:

```js
// cjs-literal/index.js
const random = () => "meme";
const reddit = () => "old";
module.exports = { random, reddit };
```

```js
// cjs-spread/index.js
const random = () => "meme";
const reddit = () => "old";
const api = { random, reddit };
module.exports = { ...api };
```

Imported from an ES module:

```js
for (const dir of ["./cjs-literal/index.js", "./cjs-spread/index.js"]) {
  const ns = await import(dir);
  console.log(dir, "named exports:", Object.keys(ns).filter((k) => k !== "default").join(", ") || "(none)");
}
```

Node.js 22 printed, on 28 November 2026:

```txt
./cjs-literal/index.js named exports: random, reddit
./cjs-spread/index.js named exports: (none)
```

And `import { random } from "./cjs-spread/index.js"` failed outright:

```txt
SyntaxError: Named export 'random' not found. The requested module './cjs-spread/index.js' is a CommonJS module, which may not support all module.exports as named exports.
```

Both objects are identical at runtime. Only the source text differs, and the lexer cannot evaluate a spread. That is why random-memes' `src/index.js` reads:

```js
// A plain object literal lets Node detect named exports for ESM imports. A spread hides them.
module.exports = { random, reddit };
```

and why the project's AGENTS.md lists it as a gotcha: a refactor to a spread or a computed key would break every ESM user's named import without any CommonJS test noticing. Default imports (`import memes from "random-memes"` then `memes.random()`) keep working either way.

## require(esm): the other direction

Until recently, CommonJS code could only load an ES module with `await import()`. The [Node.js modules docs](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require) now describe loading ES modules with `require()`, without a flag since Node.js 22.12 and 23.0, as long as the module has no top-level `await`. On the same machine:

```js
// req.cjs, next to esm-only.mjs containing: export const x = 1;
require("./esm-only.mjs");
```

ran without error, and `process.features.require_module` was `true`. Node 20 enabled it by default in 20.19; earlier 20.x releases need the `--experimental-require-module` flag, so a package that supports every Node 20 release should not rely on it yet.

## What a package author can do

- **Ship CommonJS with detectable exports.** One `module.exports = { a, b }` literal, as random-memes does, serves both `require` and `import { a }`. Test the named import in CI: random-memes type-checks an `.mts` usage file against its declarations.
- **Ship ESM only.** Simplest for new packages if every consumer runs a Node version with `require(esm)`.
- **Ship both** with conditional `exports` (`"import"` and `"require"` entries). This doubles the build and can load two copies of a module in one app, which matters for packages that keep state, such as random-memes' 10-minute cache.
- **Lock the entry points.** random-memes' `exports` map exposes only `.` and `./package.json`, so nobody depends on internal file paths.

## FAQ

<Faq />

## Related

- [Promise.all vs Promise.allSettled](/blog/promise-allsettled): how `random()` reads its sources
- [Testing fetch with the Node test runner](/blog/node-test-runner-mock-fetch): the package's tests, without network
- [Usage](/usage): import and require examples for random-memes
- [Random memes in the terminal](/blog/random-memes-cli): the CLI that ships in the same package
