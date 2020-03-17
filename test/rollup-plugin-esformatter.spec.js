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

'use strict';

const RollupPluginEsFormatter = require('../dist/rollup-plugin-esformatter.js');
const verifyWarnLogsBecauseOfSourcemap = require('./utils/verify-warn-logs-because-of-source-map.js');
const verifyWarnLogsNotTriggered = require('./utils/verify-warn-logs-not-triggered.js');

describe('RollupPluginEsFormatter', () => {
  beforeEach(() => {
    spyOn(console, 'warn');
  });

  it('should create the plugin with a name', () => {
    const plugin = new RollupPluginEsFormatter();
    expect(plugin.name).toBe('rollup-plugin-esformatter');
    expect(plugin.getSourcemap()).toBeNull();
  });

  it('should run esformatter without sourcemap by default', () => {
    const plugin = new RollupPluginEsFormatter();
    const code = 'var foo=0;var test="hello world";';
    const result = plugin.reformat(code);

    verifyWarnLogsNotTriggered();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap (lowercase)', () => {
    const plugin = new RollupPluginEsFormatter({sourcemap: true});
    const code = 'var foo=0;var test="hello world";';
    const result = plugin.reformat(code);

    expect(plugin.getSourcemap()).toBe(true);

    verifyWarnLogsBecauseOfSourcemap();
    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourceMap (camelcase)', () => {
    const plugin = new RollupPluginEsFormatter({sourceMap: true});
    const code = 'var foo=0;var test="hello world";';
    const result = plugin.reformat(code);

    expect(plugin.getSourcemap()).toBe(true);

    verifyWarnLogsBecauseOfSourcemap();
    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap if it has been enabled', () => {
    const plugin = new RollupPluginEsFormatter();
    expect(plugin.getSourcemap()).toBeNull();

    // Enable sourcemap explicitely.
    plugin.enableSourcemap();

    const code = 'var foo=0;var test="hello world";';
    const result = plugin.reformat(code);

    expect(plugin.getSourcemap()).toBe(true);

    verifyWarnLogsBecauseOfSourcemap();
    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter with sourcemap enable in reformat', () => {
    const plugin = new RollupPluginEsFormatter({sourceMap: false});
    const code = 'var foo=0;var test="hello world";';
    const result = plugin.reformat(code, true);

    expect(plugin.getSourcemap()).toBe(false);

    verifyWarnLogsBecauseOfSourcemap();
    expect(result.map).toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });

  it('should run esformatter without sourcemap enable in reformat', () => {
    const plugin = new RollupPluginEsFormatter({sourceMap: true});
    const code = 'var foo=0;var test="hello world";';
    const result = plugin.reformat(code, false);

    expect(plugin.getSourcemap()).toBe(true);

    verifyWarnLogsNotTriggered();
    expect(result.map).not.toBeDefined();
    expect(result.code).toBe(
        'var foo = 0;\n' +
        'var test = "hello world";'
    );
  });
});
