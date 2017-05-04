# rollup-plugin-esformatter

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
  entry: path.join(__dirname, 'src', 'index.js'),
  dest: path.join(__dirname, 'dist', 'bundle.js'),
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

If source map is enabled in the global rollup options, then a source map will be generated on the formatted bundle.
Note that this may take some time since `esformatter` package is not able to generate a sourcemap : this plugin must compute the diff between the original bundle and the formatted result and generate the corresponding source map.

Here is an example:

```javascript
const path = require('path');
const esformatter = require('rollup-plugin-esformatter');

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  dest: path.join(__dirname, 'dist', 'bundle.js'),
  sourceMap: true,
  plugins: [
    // Run plugin with esformatter options.
    esformatter(),
  ],
};
```

## ChangeLogs

- 0.2.0
  - Dependency updates.
  - Ignore unnecessary files in npm package
- 0.1.0 Initial release

## License

MIT License (MIT)

## Contributing

If you find a bug or think about enhancement, feel free to contribute and submit an issue or a pull request.
