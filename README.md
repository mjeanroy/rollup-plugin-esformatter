# rollup-plugin-esformatter

[![Greenkeeper badge](https://badges.greenkeeper.io/mjeanroy/rollup-plugin-esformatter.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/mjeanroy/rollup-plugin-esformatter.svg?branch=master)](https://travis-ci.org/mjeanroy/rollup-plugin-esformatter)
[![Npm version](https://badge.fury.io/js/rollup-plugin-esformatter.svg)](https://badge.fury.io/js/rollup-plugin-esformatter)

Rollup plugin that can be used to run [esformatter](http://npmjs.com/package/esformatter) on the final bundle.

## How to use

Install the plugin with NPM:

`npm install --save-dev rollup-plugin-esformatter`

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
      sourceMap: true, // Can also be disabled/enabled here.
    }),
  ],
};
```

## ChangeLogs

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
