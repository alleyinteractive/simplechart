import applyTickFormatters, { _getXAxis, _getYAxis }
  from '../../../app/reducers/utils/applyTickFormatters';
import * as dateUtils from '../../../app/utils/parseDate';

test('Test Y Axis formatting functions', () => {
  // empty -> empty
  expect(_getYAxis()).toEqual({});

  // No YAxis setting
  expect(_getYAxis({}, 'formatter func', { modules: { settings: ['XAxis'] } }))
    .toEqual({});

  // Merge into empty input object
  expect(_getYAxis({}, 'formatter func', { modules: { settings: ['YAxis'] } }))
    .toEqual({ tickFormat: 'formatter func'});

  // Merge into non-empty input object
  expect(_getYAxis({ foo: 'bar' }, 'formatter func', { modules: { settings: ['YAxis'] } }))
    .toEqual({ foo: 'bar', tickFormat: 'formatter func'});
});

test('Test X Axis formatting functions', () => {
  const formatString = 'YYYYMMDD';
  const mergeTest = _getXAxis({ foo: 'bar' }, formatString);
  // Test that object set up correctly
  expect(Object.keys(mergeTest)).toHaveLength(2);
  expect(Object.keys(mergeTest)).toContain('foo');
  expect(Object.keys(mergeTest)).toContain('tickFormat');

  // Test output for tickFormat function
  expect(mergeTest.tickFormat(Date.now)).toEqual(dateUtils.format(Date.now, formatString));
});

test('applyTickFormatters function', () => {
  const chartOptions = {
    xAxis: {
      dateFormatString: 'YYYYMMDD',
    },
    tickFormatSettings: {
      foo: 'bar', // will cause default tickFormat func to be returned
    },
    other: {
      misc: 'other miscellaneous options'
    },
  };

  const typeConfig = {
    dataFormat: 'nvd3SingleSeries',
    modules: {
      settings: [ 'YAxis' ],
    },
  };

  const applied = applyTickFormatters(chartOptions, typeConfig);

  expect(applyTickFormatters(chartOptions, null)).toBe(chartOptions);
  // Should have created a yAxis.tickFormat function
  expect(applied.yAxis.tickFormat).toBeTruthy();
  // Shoudl have kept date format string in xAxis
  expect(applied.xAxis.dateFormatString).toEqual('YYYYMMDD');
  // x Axis tickformat should work as expected
  expect(applied.xAxis.tickFormat(Date.now)).toEqual(dateUtils.format(Date.now, 'YYYYMMDD'));
  // Should have kept other values in the options object
  expect(applied.other.misc).toEqual('other miscellaneous options');
  // Should have created a value format function
  expect(applied.valueFormat).toBeTruthy();
});