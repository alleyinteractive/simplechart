const utils = require('../../app/utils/misc.js');
test('Capitalize test: turns alley into Alley', () => {
  const utils = require('../../app/utils/misc.js');
  expect(utils.capitalize('alley')).toBe('Alley');
});

test('loopArrayItemAtIndex test', () => {
  let testArray = [3, 2, 1];
  expect(utils.loopArrayItemAtIndex(0,testArray)).toBe(3);
  expect(utils.loopArrayItemAtIndex(5,testArray)).toBe(1);
});

test('getObjArrayKey test', () => {
  let testArray = [3, 2, 1];
  expect(utils.getObjArrayKey(testArray,4)).toBe('');
  expect(utils.getObjArrayKey(testArray,2)).toBe(1);
  let testObject = {"first_key":3, "second_key":2};
  expect(utils.getObjArrayKey(testObject,"first_key")).toBe(3);
  expect(utils.getObjArrayKey(testObject,"third_key")).toBe('');
});

test('dataIsMultiSeries test', () => {
  let testDataMulti =  [ [1, 2], [3, 4] ];
  let testDataSingle = [ 1, 2, 3];
  expect(utils.dataIsMultiSeries(testDataMulti)).toBe(true);
  expect(utils.dataIsMultiSeries(testDataSingle)).toBe(false);
});
