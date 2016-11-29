import buildDeepObject from '../../app/utils/buildDeepOBject.js';

let sampleString = 'alley.test.this';
let sampleValue = 'function';
let sampleObject = {"alley": {"test": {"this": "function"}}};

describe('buildDeepObject', () => {

  test('turns string into deep object', () => {
    expect(buildDeepObject(sampleString, sampleValue)).toEqual(sampleObject);
  });

});
