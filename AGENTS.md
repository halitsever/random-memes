# AGENTS.md

random-memes is a zero-dependency npm package and CLI that returns a random meme image from Lemmy meme communities for Node.js apps and bots.

## Verify a change

- Run what CI runs on Node 20, 22 and 24: `npm ci`, `npm test`, `npm run test:types`.
- Tests stub `globalThis.fetch` with `t.mock.method` (see `tests/helpers.js`), so they need no network. Stub new requests the same way.
- `npm run test:types` type-checks `tests/types/usage.mts` against the hand-written `src/index.d.ts`. Update the declarations whenever the public API changes.
- Docs: `npm run docs:build` builds the VitePress site with base `/random-memes/`.

## Gotchas

- `src/index.js` must stay a plain object literal (`module.exports = { random, reddit }`). Node detects named ESM exports from that shape, and a spread or computed export breaks `import { random } from "random-memes"`.
- The `exports` map only exposes `.` and `./package.json`. Deep imports do not resolve, so anything public goes through `src/index.js`.
- The User-Agent sent to Lemmy embeds the `version` from package.json, and a test asserts it.
- `reddit()` is deprecated and slated for removal in v5. New work goes into `random()`.
- npm publishing runs only when a GitHub release is created (`.github/workflows/publish.yaml`, trusted publishing). Merging to `main` publishes nothing.
- Record user-facing changes in `CHANGELOG.md`.

## Docs and site

- VitePress source in `docs/`, deployed to https://halitsever.github.io/random-memes/ by `.github/workflows/docs.yaml` on every push to `main`.
- `cleanUrls` is off, so page URLs end in `.html`. Static files, including `llms.txt`, `og.png` and `robots.txt`, live in `docs/public/`. Add new pages to `docs/public/llms.txt` too.
- `docs/.vitepress/cache` and `dist` are gitignored build output.

## Conventions

- Commit subjects use Conventional Commits, in English, with no body and no trailer. Older history has emoji in subjects; new commits do not.
- Work on a branch and open a pull request. The owner merges.
- New text has no emoji. Code comments are short, one line where possible, and explain why.
- README follows the owner's template. Images served from `halitsever-api.vercel.app` stay byte-for-byte; only the `title=` value of `api/repo-title` and the link around `api/issue` may be corrected.
- Version bumps, releases and npm publishing are done by the owner.
