# rollup-plugin-esformatter

[![Greenkeeper badge](https://badges.greenkeeper.io/mjeanroy/rollup-plugin-esformatter.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/mjeanroy/rollup-plugin-esformatter.svg?branch=master)](https://travis-ci.org/mjeanroy/rollup-plugin-esformatter)
[![Npm version](https://badge.fury.io/js/rollup-plugin-esformatter.svg)](https://badge.fury.io/js/rollup-plugin-esformatter)

Rollup plugin that can be used to run [esformatter](http://npmjs.com/package/esformatter) on the final bundle.

## How to use

Install the plugin with NPM:

`npm install --save-dev rollup-plugin-esformatter`

This plugin follow rollup versioning:

- Use `rollup-plugin-formatter@0.x.x` with `rollup@0.x.x`
- Use `rollup-plugin-formatter@1.x.x` with `rollup@1.x.x`
- Use `rollup-plugin-formatter@2.x.x` with `rollup@2.x.x`

Then add it to your rollup configuration:

const path = require('path');
const esformatter = require('rollup-plugin-esformatter');

```javascript
module.exports = {
  input: path.join(__dirname, 'src', 'index.js'),

  output: {
    file: path.join(__dirname, 'dist', 'bundle.js'),
  },

  plugins: [
    // Run plugin with esformatter options.
    esformatter({
      indent: {
        value: '  ',
      },
    }),
  ],
};
```

## Source Maps

If source map is enabled in the global rollup options, then a source map will be generated on the formatted bundle (except if sourcemap are explicitely disabled in the esformatter plugin options).

Note that this may take some time since `esformatter` package is not able to generate a sourcemap and this plugin must compute the diff between the original bundle and the formatted result and generate the corresponding sourcemap: for this reason, sourcemap are disabled by default.

Here is an example:

```javascript
const path = require('path');
const esformatter = require('rollup-plugin-esformatter');

module.exports = {
  input: path.join(__dirname, 'src', 'index.js'),

  output: {
    path.join(__dirname, 'dist', 'bundle.js'),
    sourcemap: true,
  },

  plugins: [
    // Run plugin with esformatter options.
    esformatter({
      sourcemap: true, // Can also be disabled/enabled here.
    }),
  ],
};
```

## ChangeLogs

- 2.0.1
  - Fix `package.json` to also support rollup 1.x.x.
  - Add "engines" option in `package.json` file.
- 2.0.0
  - Add support of rollup >= 2.
  - Remove support of node < 10.
- 1.0.0
  - Remove support of rollup < 1.0.0.
  - Remove support for deprecated `sourceMap` (camelcase) option.
  - Remove support for node < 6.
- 0.8.0
  - Dependency updates.
- 0.7.0
  - Add rollup as a peer dependency.
- 0.6.0
  - Add rollup >= 1 compatibility (use new hook, remove call to deprecated ones), keep compatibility with rollup < 1.
  - Deprecate `sourceMap` option (camelcase), use `sourcemap` option instead (lowercase).
  - Various dependency updates.
- 0.5.0
  - Add compatibility with rollup >= 0.53 with output `sourcemap` option (see [rollup #1583](https://github.com/rollup/rollup/issues/1583)).
  - Avoid side-effect and do not change the plugin options (see [032be5](https://github.com/mjeanroy/rollup-plugin-prettier/commit/032be56317ab83cd87c2460f1dadc05a617c0d12)).
  - Various dependency updates.
- 0.4.0
  - Various dependency updates.
  - Support new sourcemap (lowercase) option of rollup.
  - Sourcemap can now be activated/disabled in the plugin options.
  - Expose plugin name.
- 0.3.0
  - Dependency updates (`magic-string`).
- 0.2.0
  - Dependency updates.
  - Ignore unnecessary files in npm package
- 0.1.0 Initial release

## License

MIT License (MIT)

## Contributing

If you find a bug or think about enhancement, feel free to contribute and submit an issue or a pull request.
