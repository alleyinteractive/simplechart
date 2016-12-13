/* global describe test expect jest */
/* eslint no-undef: "error" */

import buildDeepObject from '../../app/utils/buildDeepOBject.js';

const sampleString = 'alley.test.sample';
const sampleValue = 'value';
const sampleObject = { alley: { test: { sample: 'value' } } };

describe('buildDeepObject', () => {
  test('turns string into deep object', () => {
    expect(buildDeepObject(sampleString, sampleValue)).toEqual(sampleObject);
  });
});
