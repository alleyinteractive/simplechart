test('Test date format parsing', () => {
  const utils = require('../../app/utils/parseDate.js');

  // Test format validation
  expect(utils.validate('2015-08-25', 'YYYY-MM-DD')).toBe(true);
  expect(utils.validate('2015-08-25', 'YYYY-DD-MM')).toBe(false);
  expect(utils.validate('Aug 25, 2015', 'MMM DD, YYYY')).toBe(true);

  // Test format parsing
  expect(utils.parse('2015-08-25', 'YYYY-MM-DD')).toBe(1440475200000);
  expect(utils.parse('Aug 25, 2015', 'YYYY-DD-MM')).toBe(null);
  expect(utils.parse('Aug 25, 2015', 'MMM DD, YYYY')).toBe(1440475200000);

  // Test timestamp formatting
  expect(utils.format(1440475200000, 'MM/DD/YYYY')).toBe('08/25/2015');
  expect(utils.format(1440475200000, 'MMM DD, YYYY')).toBe('Aug 25, 2015');
  expect(utils.format(undefined, 'MMM DD, YYYY')).toBe('Date format error');

  // Look for invalid date in a list
  const list1 = ['20160801', '20160802']
  const list2 = list1.concat(['08/03/2016']);
  expect(utils.disproveList('YYYYMMDD', list1)).toBe(null);
  expect(utils.disproveList('YYYYMMDD', list2)).toBe('08/03/2016');
});
