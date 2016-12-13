/* global describe test expect jest */
/* eslint no-undef: "error" */

import * as utils from '../../app/utils/misc.js';

test('Capitalize test: turns alley into Alley', () => {
  expect(utils.capitalize('alley')).toBe('Alley');
});

test('loopArrayItemAtIndex test', () => {
  const testArray = [3, 2, 1];
  expect(utils.loopArrayItemAtIndex(0, testArray)).toBe(3);
  expect(utils.loopArrayItemAtIndex(5, testArray)).toBe(1);
});

test('getObjArrayKey test', () => {
  const testArray = [3, 2, 1];
  expect(utils.getObjArrayKey(testArray, 4)).toBe('');
  expect(utils.getObjArrayKey(testArray, 2)).toBe(1);
  const testObject = { first_key: 3, second_key: 2 };
  expect(utils.getObjArrayKey(testObject, 'first_key')).toBe(3);
  expect(utils.getObjArrayKey(testObject, 'third_key')).toBe('');
});

test('dataIsMultiSeries test', () => {
  const testDataMulti = [ { key: 'Make', values: [ 2, 5 ] }, { key: 'Model', values: [ 7, 9 ] } ];
  const testDataSingle = [1, 2, 3];
  expect(utils.dataIsMultiSeries(testDataMulti)).toBe(true);
  expect(utils.dataIsMultiSeries(testDataSingle)).toBe(false);
});
