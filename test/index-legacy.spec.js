/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-2019 Mickael Jeanroy
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

const esformatter = require('esformatter');
const plugin = require('../dist/index-legacy');

fdescribe('index-legacy', () => {
  beforeEach(() => {
    spyOn(console, 'log').and.callThrough();
  });

  fit('should have a name', () => {
    const instance = plugin();
    expect(instance.name).toBe('rollup-plugin-esformatter');
  });

  fit('should run esformatter without source map by default', () => {
    const instance = plugin();

    // Run the option.
    instance.options();

    const code = 'var foo=0;var test="hello world";';
    const outputOptions = {};
    const result = instance.transformBundle(code, outputOptions);

    expect(console.log).not.toHaveBeenCalled();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  fit('should run esformatter with source map specified as camelcase in input options (rollup < 0.48.0)', () => {
    const instance = plugin();

    instance.options({
      sourceMap: true,
    });

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const outputOptions = {};
    const result = instance.transformBundle(code, outputOptions);

    expect(console.log).toHaveBeenCalledWith(
        '[rollup-plugin-esformatter] Sourcemap is enabled, computing diff is required'
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

  fit('should run esformatter with sourcemap specified as lowercase in input options (rollup >= 0.48.0)', () => {
    const options = {singleQuote: true};
    const instance = plugin(options);

    instance.options({
      sourcemap: true,
    });

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const outputOptions = {};
    const result = instance.transformBundle(code, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap in output options', () => {
    const instance = plugin();

    // The input options may not contain `sourcemap` entry with rollup >= 0.53.
    instance.options({});

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {sourcemap: true};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(console.log).toHaveBeenCalledWith(
        '[rollup-plugin-esformatter] Sourcemap is enabled, computing diff is required'
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

  it('should run prettier with sourcemap in output options (camelcase format)', () => {
    const instance = plugin();

    // The input options may not contain `sourcemap` entry with rollup >= 0.53.
    instance.options({});

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {sourceMap: true};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(console.log).toHaveBeenCalledWith(
        '[rollup-plugin-esformatter] Sourcemap is enabled, computing diff is required'
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

  it('should run prettier with sourcemap disabled in output options', () => {
    const instance = plugin();

    // The input options may not contain `sourcemap` entry with rollup >= 0.53.
    instance.options({});

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {sourcemap: false};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(console.log).not.toHaveBeenCalled();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap (lowercase) options', () => {
    const options = {
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    instance.options({
      sourcemap: true,
    });

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap in output options', () => {
    const options = {
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    instance.options({
      output: {
        sourcemap: true,
      },
    });

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap in output array', () => {
    const options = {
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    instance.options({
      output: [{
        sourcemap: true,
      }],
    });

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap (lowercase) in plugin option', () => {
    const options = {
      sourcemap: true,
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap (camelcase) in plugin option', () => {
    const options = {
      sourceMap: true,
      indent: {
        value: '  ',
      },
    };

    const instance = plugin(options);

    console.log.and.stub();

    const code = 'var foo=0;var test="hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

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
      sourcemap: true,
    });

    console.log.and.stub();

    const code = 'var foo    =    0;\nvar test = "hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

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
      sourcemap: true,
    });

    console.log.and.stub();

    const code = 'var foo    =    0;var test = "hello world";';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should avoid side effect and do not modify plugin options', () => {
    const options = {
      sourceMap: false,
    };

    const instance = plugin(options);
    instance.options({});

    const code = 'var foo = 0;';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    instance.renderChunk(code, chunk, outputOptions);

    // It should not have been touched.
    expect(options).toEqual({
      sourceMap: false,
    });
  });

  it('should run esformatter without sourcemap options', () => {
    const options = {
      sourceMap: false,
    };

    spyOn(esformatter, 'format').and.callThrough();

    const instance = plugin(options);
    instance.options({});

    const code = 'var foo = 0;';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    instance.renderChunk(code, chunk, outputOptions);

    expect(esformatter.format).toHaveBeenCalledWith(code, undefined);
    expect(options).toEqual({
      sourceMap: false,
    });
  });

  it('should run esformatter without sourcemap options and custom other options', () => {
    const options = {
      sourceMap: false,
      singleQuote: true,
    };

    spyOn(esformatter, 'format').and.callThrough();

    const instance = plugin(options);
    instance.options({});

    const code = 'var foo = 0;';
    const chunk = {isEntry: false, imports: []};
    const outputOptions = {};
    instance.renderChunk(code, chunk, outputOptions);

    expect(esformatter.format).toHaveBeenCalledWith(code, {
      singleQuote: true,
    });

    expect(options).toEqual({
      sourceMap: false,
      singleQuote: true,
    });
  });
});
