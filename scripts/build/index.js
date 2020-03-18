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

const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const stripBanner = require('gulp-strip-banner');
const headerComment = require('gulp-header-comment');
const prettier = require('gulp-prettier');
const rename = require('gulp-rename');
const config = require('../config');

module.exports = gulp.series(
    buildCjs,
    buildEsm
);

/**
 * Build CommonJS bundles.
 *
 * @return {NodeJS.WritableStream} The gulp stream.
 */
function buildCjs() {
  return build('cjs');
}

/**
 * Build ESM bundles.
 *
 * @return {NodeJS.WritableStream} The gulp stream.
 */
function buildEsm() {
  return build('mjs');
}

/**
 * Build bundle for given environment.
 *
 * @param {string} envName Environment id.
 * @return {NodeJS.WritableStream} The gulp stream.
 */
function build(envName) {
  return gulp.src(path.join(config.src, '**', '*.js'))
      .pipe(stripBanner())
      .pipe(babel({envName}))
      .pipe(headerComment({file: path.join(config.root, 'LICENSE')}))
      .pipe(prettier())
      .pipe(rename({extname: `.${envName}`}))
      .pipe(gulp.dest(path.join(config.dist, envName)));
}
