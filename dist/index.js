/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2022 Mickael Jeanroy
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

var omitBy = require("lodash.omitby");
var isEmpty = require("lodash.isempty");
var hasIn = require("lodash.hasin");
var isNil = require("lodash.isnil");
var MagicString = require("magic-string");
var diff = require("diff");
var esformatter = require("esformatter");

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== "default") {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var diff__namespace = /*#__PURE__*/ _interopNamespaceDefault(diff);

/**
 * The internal plugin options.
 */
const OPTIONS = new Set(["sourcemap"]);

/**
 * The rollup plugin for ESFormatter.
 */
class RollupPluginEsFormatter {
  /**
   * Initialize plugin.
   *
   * @param {Object} options Initialization option.
   * @constructor
   */
  constructor(options = {}) {
    this.name = "rollup-plugin-esformatter";

    // Initialize main options.
    this._options = omitBy(options || {}, (value, key) => OPTIONS.has(key));

    // Reset to undefined if esformatter options are empty.
    if (isEmpty(this._options)) {
      this._options = undefined;
    }

    // Check if sourcemap is enabled by default.
    this._sourcemap = hasIn(options, "sourcemap") ? options.sourcemap : null;
  }

  /**
   * Get the `sourcemap` value.
   *
   * @return {boolean} The `sourcemap` flag value.
   */
  getSourcemap() {
    return this._sourcemap;
  }

  /**
   * Disable sourcemap.
   *
   * @return {void}
   */
  enableSourcemap() {
    this._sourcemap = true;
  }

  /**
   * Function called by `rollup` before generating final bundle.
   *
   * @param {string} source Souce code of the final bundle.
   * @param {boolean} sourcemap Force sourcemap for this output.
   * @return {Object} The result containing a `code` property and, if source map is enabled, a `map` property.
   */
  reformat(source, sourcemap) {
    const output = esformatter.format(source, this._options);

    // No need to do more.
    const defaultSourcemap = isNil(this._sourcemap) ? false : this._sourcemap;
    const outputSourcemap = isNil(sourcemap) ? defaultSourcemap : sourcemap;
    if (!outputSourcemap) {
      return {
        code: output,
      };
    }
    console.warn(
      `[${this.name}] Sourcemap is enabled, computing diff is required`
    );
    console.warn(
      `[${this.name}] This may take a moment (depends on the size of your bundle)`
    );
    const magicString = new MagicString(source);
    const changes = diff__namespace.diffChars(source, output);
    let idx = 0;
    if (changes && changes.length > 0) {
      changes.forEach((part) => {
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
        hires: true,
      }),
    };
  }
}

/**
 * Create plugin instance.
 *
 * @param {*} options Plugin options.
 * @return {Objects} The plugin instance.
 */
function rollupPlugin(options) {
  const plugin = new RollupPluginEsFormatter(options);
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
    renderChunk(source, chunk, outputOptions = {}) {
      return plugin.reformat(source, outputOptions.sourcemap);
    },
  };
}

module.exports = rollupPlugin;
