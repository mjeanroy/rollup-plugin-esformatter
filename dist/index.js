/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2020 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

function _interopDefault(ex) {
  return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
}

var rollup = require("rollup");
var hasIn = _interopDefault(require("lodash.hasin"));
var isNil = _interopDefault(require("lodash.isnil"));
var omitBy = _interopDefault(require("lodash.omitby"));
var isEmpty = _interopDefault(require("lodash.isempty"));
var MagicString = _interopDefault(require("magic-string"));
var diff = require("diff");
var esformatter = _interopDefault(require("esformatter"));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * The internal plugin options.
 */

var OPTIONS = new Set(["sourcemap", "sourceMap"]);
/**
 * The rollup plugin for ESFormatter.
 */

var RollupPluginEsFormatter = /*#__PURE__*/ (function() {
  /**
   * Initialize plugin.
   *
   * @param {Object} options Initialization option.
   * @constructor
   */
  function RollupPluginEsFormatter() {
    var options =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, RollupPluginEsFormatter);

    this.name = "rollup-plugin-esformatter"; // Initialize main options.

    this._options = omitBy(options || {}, function(value, key) {
      return OPTIONS.has(key);
    }); // Reset to undefined if esformatter options are empty.

    if (isEmpty(this._options)) {
      this._options = undefined;
    } // Check if sourcemap is enabled by default.

    if (hasIn(options, "sourcemap")) {
      this._sourcemap = options.sourcemap;
    } else if (hasIn(options, "sourceMap")) {
      console.warn(
        "[".concat(
          this.name,
          "] The sourceMap option is deprecated, please use sourcemap instead."
        )
      );
      this._sourcemap = options.sourceMap;
    } else {
      this._sourcemap = null;
    }
  }
  /**
   * Get the `sourcemap` value.
   *
   * @return {boolean} The `sourcemap` flag value.
   */

  _createClass(RollupPluginEsFormatter, [
    {
      key: "getSourcemap",
      value: function getSourcemap() {
        return this._sourcemap;
      }
      /**
       * Disable sourcemap.
       *
       * @return {void}
       */
    },
    {
      key: "enableSourcemap",
      value: function enableSourcemap() {
        this._sourcemap = true;
      }
      /**
       * Function called by `rollup` before generating final bundle.
       *
       * @param {string} source Souce code of the final bundle.
       * @param {boolean} sourcemap Force sourcemap for this output.
       * @return {Object} The result containing a `code` property and, if source map is enabled, a `map` property.
       */
    },
    {
      key: "reformat",
      value: function reformat(source, sourcemap) {
        var output = esformatter.format(source, this._options); // No need to do more.

        var defaultSourcemap = isNil(this._sourcemap) ? false : this._sourcemap;
        var outputSourcemap = isNil(sourcemap) ? defaultSourcemap : sourcemap;

        if (!outputSourcemap) {
          return {
            code: output
          };
        }

        console.warn(
          "[".concat(
            this.name,
            "] Sourcemap is enabled, computing diff is required"
          )
        );
        console.warn(
          "[".concat(
            this.name,
            "] This may take a moment (depends on the size of your bundle)"
          )
        );
        var magicString = new MagicString(source);
        var changes = diff.diffChars(source, output);
        var idx = 0;

        if (changes && changes.length > 0) {
          changes.forEach(function(part) {
            if (part.added) {
              magicString.prependLeft(idx, part.value);
              idx -= part.count;
            } else if (part.removed) {
              magicString.remove(idx, idx + part.count);
            }

            idx += part.count;
          });
        }

        return {
          code: magicString.toString(),
          map: magicString.generateMap({
            hires: true
          })
        };
      }
    }
  ]);

  return RollupPluginEsFormatter;
})();

/**
 * Check if `sourcemap` option is enable or not.
 *
 * @param {Object} opts Options.
 * @return {boolean} `true` if sourcemap is enabled, `false` otherwise.
 */

function isSourceMapEnabled(opts) {
  return !!(opts.sourcemap || opts.sourceMap);
}
/**
 * Create plugin compatible with rollup < 1.0.0
 *
 * @param {*} options Plugin options.
 * @return {Objects} The plugin instance.
 */

function rollupPluginLegacy(options) {
  var plugin = new RollupPluginEsFormatter(options);
  return {
    /**
     * The plugin name.
     * @type {string}
     */
    name: plugin.name,

    /**
     * Function called by `rollup` that is used to read the `sourceMap` setting.
     *
     * @param {Object} opts Rollup options.
     * @return {void}
     */
    options: function options() {
      var opts =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (isNil(plugin.getSourcemap())) {
        // Get the global `sourcemap` option on given object.
        // Should support:
        //  - `sourcemap` (lowercase) option which is the name with rollup >= 0.48.0,
        //  - `sourceMap` (camelcase) option which is the (deprecated) name with rollup < 0.48.0.
        var globalSourcemap = isSourceMapEnabled(opts); // Since rollup 0.48, sourcemap option can be set on the `output` object.

        var output = opts.output || {};
        var outputSourceMap = Array.isArray(output)
          ? output.some(isSourceMapEnabled)
          : isSourceMapEnabled(output); // Enable or disable `sourcemap` generation.

        var sourcemap = globalSourcemap || outputSourceMap;

        if (sourcemap !== false) {
          plugin.enableSourcemap();
        }
      }
    },

    /**
     * Function called by `rollup` before generating final bundle.
     *
     * @param {string} source Souce code of the final bundle.
     * @param {Object} outputOptions Output option.
     * @return {Object} The result containing a `code` property and, if source map is enabled, a `map` property.
     */
    transformBundle: function transformBundle(source) {
      var outputOptions =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var sourcemap = hasIn(outputOptions, "sourcemap")
        ? outputOptions.sourcemap
        : outputOptions.sourceMap;
      return plugin.reformat(source, sourcemap);
    }
  };
}

/**
 * Create plugin compatible with rollup >= 1.0.0
 *
 * @param {*} options Plugin options.
 * @return {Objects} The plugin instance.
 */

function rollupPluginStable(options) {
  var plugin = new RollupPluginEsFormatter(options);
  return {
    /**
     * The plugin name.
     * @type {string}
     */
    name: plugin.name,

    /**
     * Function called by `rollup` before generating final bundle.
     *
     * @param {string} source Souce code of the final bundle.
     * @param {Object} chunk The current chunk.
     * @param {Object} outputOptions Output option.
     * @return {Object} The result containing a `code` property and, if source map is enabled, a `map` property.
     */
    renderChunk: function renderChunk(source, chunk) {
      var outputOptions =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return plugin.reformat(source, outputOptions.sourcemap);
    }
  };
}

var VERSION = rollup.rollup.VERSION || "0";
var MAJOR_VERSION = Number(VERSION.split(".")[0]) || 0;
var IS_ROLLUP_LEGACY = MAJOR_VERSION === 0;
var rollupEsformatter = IS_ROLLUP_LEGACY
  ? rollupPluginLegacy
  : rollupPluginStable;

module.exports = rollupEsformatter;
