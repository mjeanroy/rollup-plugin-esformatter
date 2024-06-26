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

import esformatter from 'esformatter';
import { verifyWarnLogsBecauseOfSourcemap } from './utils/verify-warn-logs-because-of-source-map';
import { verifyWarnLogsNotTriggered } from './utils/verify-warn-logs-not-triggered';
import { joinLines } from './utils/join-lines';
import { rollupPlugin } from '../src/rollup-plugin';

describe('rollup-plugin', () => {
  beforeEach(() => {
    spyOn(console, 'warn');
  });

  it('should have a name', () => {
    const instance = rollupPlugin();
    expect(instance.name).toBe('rollup-plugin-esformatter');
  });

  it('should run esformatter without sourcemap by default', () => {
    const instance = rollupPlugin();

    const code = 'var foo=0;var test="hello world";';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    const result = instance.renderChunk(code, chunk, outputOptions);

    verifyWarnLogsNotTriggered();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
      joinLines([
        'var foo = 0;',
        'var test = "hello world";',
      ]),
    );
  });

  it('should run esformatter with sourcemap in output options', () => {
    const instance = rollupPlugin();
    const code = 'var foo=0;var test="hello world";';
    const chunk = {
      isEntry: false,
      imports: [],
    };

    const outputOptions = {
      sourcemap: true,
    };

    const result = instance.renderChunk(code, chunk, outputOptions);

    verifyWarnLogsBecauseOfSourcemap();
    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      joinLines([
        'var foo = 0;',
        'var test = "hello world";',
      ]),
    );
  });

  it('should run prettier with sourcemap (lowercase) disabled in output options', () => {
    const instance = rollupPlugin();
    const code = 'var foo=0;var test="hello world";';

    const chunk = {
      isEntry: false,
      imports: [],
    };

    const outputOptions = {
      sourcemap: false,
    };

    const result = instance.renderChunk(code, chunk, outputOptions);

    verifyWarnLogsNotTriggered();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
      joinLines([
        'var foo = 0;',
        'var test = "hello world";',
      ]),
    );
  });

  it('should run esformatter with sourcemap (lowercase) in plugin option', () => {
    const options = {
      sourcemap: true,
      indent: {
        value: '  ',
      },
    };

    const instance = rollupPlugin(options);
    const code = 'var foo=0;var test="hello world";';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    const result = instance.renderChunk(code, chunk, outputOptions);

    verifyWarnLogsBecauseOfSourcemap();
    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      joinLines([
        'var foo = 0;',
        'var test = "hello world";',
      ]),
    );
  });

  it('should remove unnecessary spaces', () => {
    const options = {
      sourcemap: true,
      indent: {
        value: '  ',
      },
    };

    const instance = rollupPlugin(options);

    const code = 'var foo    =    0;\nvar test = "hello world";';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      joinLines([
        'var foo = 0;',
        'var test = "hello world";',
      ]),
    );
  });

  it('should add and remove characters', () => {
    const options = {
      sourcemap: true,
      indent: {
        value: '  ',
      },
    };

    const instance = rollupPlugin(options);
    const code = 'var foo    =    0;var test = "hello world";';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    const result = instance.renderChunk(code, chunk, outputOptions);

    expect(result.map).toBeDefined();
    expect(result.code).toBe(
      joinLines([
        'var foo = 0;',
        'var test = "hello world";',
      ]),
    );
  });

  it('should avoid side effect and do not modify plugin options', () => {
    const options = {
      sourcemap: false,
    };

    const instance = rollupPlugin(options);

    const code = 'var foo = 0;';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    instance.renderChunk(code, chunk, outputOptions);

    // It should not have been touched.
    expect(options).toEqual({
      sourcemap: false,
    });
  });

  it('should run esformatter without any options if option object becomes empty', () => {
    const options = {
      sourcemap: false,
    };

    spyOn(esformatter, 'format').and.callThrough();

    const instance = rollupPlugin(options);
    const code = 'var foo = 0;';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    instance.renderChunk(code, chunk, outputOptions);

    expect(esformatter.format).toHaveBeenCalledWith(code, undefined);
    expect(options).toEqual({
      sourcemap: false,
    });
  });

  it('should run esformatter without sourcemap options and custom other options', () => {
    const options = {
      sourcemap: false,
      singleQuote: true,
    };

    spyOn(esformatter, 'format').and.callThrough();

    const instance = rollupPlugin(options);
    const code = 'var foo = 0;';
    const outputOptions = {};
    const chunk = {
      isEntry: false,
      imports: [],
    };

    instance.renderChunk(code, chunk, outputOptions);

    expect(esformatter.format).toHaveBeenCalledWith(code, {
      singleQuote: true,
    });

    expect(options).toEqual({
      sourcemap: false,
      singleQuote: true,
    });
  });
});
