# Changelog

## 4.0.0

### Breaking changes

- `random()` picks from the hot posts of Lemmy meme communities (memes and dankmemes on lemmy.world, memes on lemmy.ml) instead of the random-memes API, which returned the same meme on every call. `category` is now the community name, and each meme has a `permalink` to its post.
- Requires Node.js 20 or newer.
- `axios` is gone. Requests use the `fetch` built into Node.js, so the package has no runtime dependencies.
- The package has an `exports` map. Deep imports such as `random-memes/src/lib/reddit` no longer resolve.
- Errors wrap the original error in `error.cause` instead of mixing it into the message.
- `reddit()` rejects an unknown `locale` instead of requesting `/r/undefined`.

### Deprecated

- `reddit()` prints a `DeprecationWarning` and will be removed in v5. Reddit blocks most unauthenticated requests.

### Fixed

- TypeScript declarations now describe `random()` and `reddit()` with their real return types.
- Named ES module imports work: `import { random } from "random-memes"`.
- `reddit()` works without arguments, reads up to 100 posts instead of 25, and skips pinned and non-image posts.
- The `random-memes` command prints a meme instead of doing nothing.
- The published package contains only `src/`, the README and the license.
