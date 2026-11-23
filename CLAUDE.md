# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A Rollup plugin (`rollup-plugin-esformatter`) that runs [esformatter](https://npmjs.com/package/esformatter) on the final bundle. It supports rollup 1.x through 4.x (peer dependency) and Node >= 14. The package manager is pnpm 12 (CI pins 12.22.0 through `pnpm/setup`; CI installs its standalone binary, so it does not depend on the runner's Node version). pnpm settings live in `pnpm-workspace.yaml`: since pnpm 11, pnpm only reads auth/registry settings from `.npmrc`, which is kept for npm (`npm version` in the release task). `.nvmrc` pins Node 20.

CI (`.github/workflows/build.yml`) runs `pnpm install && pnpm test` on Node 18 through 26, on Linux, macOS and Windows. Code in `scripts/` and `test/` must handle Windows paths: use `path.join` and never hardcode `/`.

## Commands

All npm scripts go through gulp tasks (`gulpfile.js` → `scripts/*/index.js`):

- `pnpm test`: runs **clean → lint → build → jasmine**. Lint failures, including warnings, stop the test run.
- `pnpm run test:unit`: jasmine only. It takes `--file`/`--filter` (see below).
- `pnpm run lint`: ESLint (airbnb-base, `eslint.config.cjs`) over root `*.js`, `src/`, `test/`, `scripts/`. Any warning counts as a failure. Add `--file <path>` (repeatable; a file, directory or glob) to lint only those paths, e.g. `pnpm run lint --file src/rollup-plugin.js`. A `--file` that matches nothing is an error. `build`, `test` and `release` always lint the whole project and ignore `--file`.
- `pnpm run build`: clean + lint, then bundle `src/index.js` into `dist/index.js` (CJS) with Rollup (`scripts/build/rollup.config.js`).
- `pnpm run tdd`: watches `src/` and `test/` and reruns jasmine on each change. It does not run once at startup.
- `pnpm run changelog`: conventional-changelog.
- `pnpm run release[:patch|:minor|:major]`: runs the full test pipeline, force-adds `dist/`, runs `npm version`, then `git rm`s `dist/` in a follow-up "prepare next release" commit. `dist/` is only committed on release tags.

### Running a single file or test

`pnpm run test:unit` runs only jasmine, with no clean, lint or build step. It accepts optional flags:

```sh
pnpm run test:unit --file test/rollup-plugin.spec.js                             # one file (--file can be repeated)
pnpm run test:unit --file test/rollup-plugin.spec.js --filter "should have a name" # one spec (regex on the full spec name)
pnpm run test:unit --filter sourcemap                                            # filter across all specs
```

Both `--file` and `--filter` are parsed by `scripts/cli/index.js`, which the lint and test tasks share. Use this instead of calling `npx jasmine` directly. The specs need `@babel/register` and Jasmine's `require` loader, and the gulp task sets both up. The test runner sets `failSpecWithNoExpectations: true`, so every spec needs at least one `expect`.

## Architecture

The source is small (`src/`). Its layers are:

- `src/index.js`: default export only. `babel-plugin-add-module-exports` makes `require('rollup-plugin-esformatter')` return the factory directly.
- `src/rollup-plugin.js`: the Rollup-facing adapter. It builds a `RollupPluginEsFormatter` and exposes `{ name, renderChunk }`. `renderChunk` passes `outputOptions.sourcemap` through.
- `src/rollup-plugin-esformatter.js`: the core class.
  - It removes the plugin-only keys (the `OPTIONS` set, currently just `sourcemap`) from the user options. Everything else goes to `esformatter.format` unchanged, and an empty options object becomes `undefined`.
  - **Sourcemap resolution:** the Rollup output `sourcemap` wins. The plugin's own `sourcemap` option is used only when that value is unset, and the default is off. Real Rollup (checked with 4.x) always passes `true` or `false` to `renderChunk`, so in practice the plugin option has no effect. Only the unit tests, which call `renderChunk` directly, exercise that fallback.
  - **Sourcemap generation:** esformatter cannot emit sourcemaps. When one is requested, the class computes `diff.diffChars(original, formatted)` and replays it onto a `MagicString` of the original (`prependLeft` for additions, `remove` for deletions) to get a hires map. It also prints two `console.warn` messages, which the tests assert via the helpers in `test/utils/`.

### Tests

- `test/*.spec.js`: unit tests for the class and the adapter.
- `test/it/it.spec.js`: integration tests. They run real `rollup.rollup()` against `test/it/fixtures/bundle.js` and write to a `tmp` dir. They import from `src/`, not `dist/`.
- Every spec file calls `spyOn(console, 'warn')` in `beforeEach`. `test/utils/verify-warn-logs-*.js` assert the exact sourcemap warning strings, so update them if you change those messages.

### Build notes

- `.babelrc` has two envs. The default (CJS, Node 14 target) is used by `@babel/register` for tests and gulp. The `rollup` env (`modules: false`) is used when bundling.
- The build strips the source license banners, prepends `LICENSE` as the banner, and formats `dist/` with prettier. Runtime `dependencies` and `peerDependencies` are marked external.
- Every source and script file starts with the MIT license header. Keep it on new files.
- `dist/` is gitignored. The npm package ships only `dist/` plus `README.md`, `LICENSE` and `CHANGELOG.md`; `.npmignore` excludes `src/`, `test/` and `scripts/`.

## Lint rules worth knowing

These are set in `eslint.config.cjs`, on top of airbnb-base:

- `max-len` is 140.
- `no-console` allows only `console.warn` and `console.error`.
- `import/no-extraneous-dependencies` allows devDependencies only in `scripts/`, `test/`, `gulpfile.js` and the ESLint config. Anything `src/` imports must be a runtime `dependency`, because the build also marks those as external.
- Jasmine globals are declared only for `test/**`.

## Dependencies

- Versions are pinned exactly (`saveExact: true` in `pnpm-workspace.yaml`, `save-exact=true` in `.npmrc` for npm), except the `esformatter` range.
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 2880`, so packages published less than 2 days ago will not install. It also sets `blockExoticSubdeps` and `trustPolicy: no-downgrade`.
- pnpm 12 reports settings in `pnpm-workspace.yaml` that it does not recognize. It only warns here because `package.json` does not pin a pnpm version; with a pin it fails with `ERR_PNPM_UNRECOGNIZED_WORKSPACE_SETTINGS`. Check key spelling there.
- pnpm (since 11) fails `pnpm install` when a dependency has a build script that is neither allowed nor denied. List each such dependency under `allowBuilds` in `pnpm-workspace.yaml` (`core-js` is currently denied).
- Do not bump `magic-string` to a new major. Recent majors are ESM-only and need Node >= 22, while rollup still supports Node 18. Dependabot ignores those majors for the same reason.
- Do not bump `@babel/*` to 8.x yet. Babel 8 is ESM-only and needs Node >= 22.18, which breaks the Node 18 CI jobs, and `@rollup/plugin-babel` still declares `@babel/core ^7`. Dependabot ignores `@babel/*` majors for the same reason. Upgrading later also requires `require('@babel/register').default(...)` in `gulpfile.js`.
- Dependabot groups `@babel/*` updates together, and `jasmine` with `jasmine-core`.

## Conventions

- Commit messages use the conventional-commit form, e.g. `chore: …`, `chore(ci): …`, `chore(deps-dev): …`. `CHANGELOG.md` is generated from them by `pnpm run changelog`.
- `README.md` keeps its own hand-written "ChangeLogs" section, which is updated per release separately from `CHANGELOG.md`.
- Every code example in `README.md` must be valid and work as written: correct syntax, `require` lines inside the code block, and options the plugin actually honours. When you change an example or the behavior it shows, check it by running the snippet against the built plugin with real rollup.
- When you add a new plugin option, document it in `README.md` together with the version that introduces it, e.g. "(since 3.2.0)". Also add it to that version's entry in the README "ChangeLogs" section.
