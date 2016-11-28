/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Mickael Jeanroy
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
const jasmine = require('gulp-jasmine');
const babel = require('gulp-babel');
const del = require('del');

const root = path.join(__dirname);
const config = {
  src: path.join(root, 'src'),
  test: path.join(root, 'test'),
  dist: path.join(root, 'dist'),
};

gulp.task('test', ['build'], () => {
  const src = [
    path.join(config.test, '**', '*.spec.js'),
  ];

  return gulp
    .src(src)
    .pipe(jasmine());
});

gulp.task('clean', () => {
  return del([config.dist]);
});

gulp.task('build', ['clean'], () => {
  return gulp
    .src(path.join(config.src, '*.js'))
    .pipe(babel())
    .pipe(gulp.dest(path.join(__dirname, 'dist')));
});
