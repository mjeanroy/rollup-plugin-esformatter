/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2023 Mickael Jeanroy
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

const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      'dist/**',
    ],
  },

  js.configs.recommended,

  ...compat.extends('airbnb-base'),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    linterOptions: {},

    rules: {
      'max-len': ['error', {
        code: 140,
        tabWidth: 2,
      }],

      'import/prefer-default-export': 'off',

      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          'eslint.config.*',
          'scripts/**/*.js',
          'test/**/*.js',
          'gulpfile.js',
        ],
      }],

      'no-underscore-dangle': 'off',
      'no-plusplus': 'off',

      'quote-props': ['error', 'consistent-as-needed'],

      'no-console': ['error', {
        allow: ['warn', 'error'],
      }],
    },
  },

  {
    files: [
      'test/**/*.js',
    ],

    languageOptions: {
      sourceType: 'module',
      globals: {
        afterAll: true,
        afterEach: true,
        beforeAll: true,
        beforeEach: true,
        describe: true,
        expect: true,
        expectAsync: true,
        fail: true,
        fdescribe: true,
        fit: true,
        it: true,
        jasmine: true,
        pending: true,
        runs: true,
        spyOn: true,
        spyOnAllFunctions: true,
        spyOnProperty: true,
        throwUnless: true,
        throwUnlessAsync: true,
        waits: true,
        waitsFor: true,
        xdescribe: true,
        xit: true,
      },
    },
  },
];
