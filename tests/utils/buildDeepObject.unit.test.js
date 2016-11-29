/* global describe test expect jest */
/* eslint no-undef: "error" */

import buildDeepObject from '../../app/utils/buildDeepOBject.js';

const sampleString = 'alley.test.this';
const sampleValue = 'function';
const sampleObject = { alley: { test: { this: 'function' } } };

describe('buildDeepObject', () => {
  test('turns string into deep object', () => {
    expect(buildDeepObject(sampleString, sampleValue)).toEqual(sampleObject);
  });
});
