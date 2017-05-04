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

'use strict';

const plugin = require('../dist/index.js');

describe('rollup-plugin-esformatter', () => {
  beforeEach(() => {
    spyOn(console, 'log');
  });

  it('should run esformatter with source map', () => {
    const instance = plugin();

    instance.options({
      sourceMap: true,
    });

    const code = 'var foo=0;var test="hello world";';
    const result = instance.transformBundle(code);

    expect(console.log).toHaveBeenCalledWith(
      '[rollup-plugin-esformatter] Source-map is enabled, computing diff is required'
    );

    expect(console.log).toHaveBeenCalledWith(
      '[rollup-plugin-esformatter] This may take a moment (depends on the size of your bundle)'
    );

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      'var foo = 0;\n' +
      'var test = "hello world";'
    );
  });

  it('should run esformatter without source map', () => {
    const instance = plugin();

    // Run the option.
    instance.options();

    const code = 'var foo=0;var test="hello world";';
    const result = instance.transformBundle(code);

    expect(console.log).not.toHaveBeenCalled();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
      'var foo = 0;\n' +
      'var test = "hello world";'
    );
  });

  it('should run esformatter with options', () => {
    const options = {
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    instance.options({
      sourceMap: true,
    });

    const code = 'var foo=0;var test="hello world";';
    const result = instance.transformBundle(code);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      'var foo = 0;\n' +
      'var test = "hello world";'
    );
  });

  it('should remove unnecessary spaces', () => {
    const options = {
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    instance.options({
      sourceMap: true,
    });

    const code = 'var foo    =    0;\nvar test = "hello world";';
    const result = instance.transformBundle(code);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      'var foo = 0;\n' +
      'var test = "hello world";'
    );
  });

  it('should add and remove characters', () => {
    const options = {
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    instance.options({
      sourceMap: true,
    });

    const code = 'var foo    =    0;var test = "hello world";';
    const result = instance.transformBundle(code);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      'var foo = 0;\n' +
      'var test = "hello world";'
    );
  });
});
