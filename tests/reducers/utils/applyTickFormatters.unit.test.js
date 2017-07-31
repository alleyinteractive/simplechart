import applyTickFormatters, {
  getXAxis,
  getYAxis,
} from '../../../app/reducers/utils/applyTickFormatters';
import * as dateUtils from '../../../app/utils/parseDate';

test('Test Y Axis formatting functions', () => {
  // empty -> empty
  expect(getYAxis()).toEqual({});

  // No YAxis setting
  expect(getYAxis({}, 'formatter func', { modules: { settings: ['XAxis'] } }))
    .toEqual({});

  // Merge into empty input object
  expect(getYAxis({}, 'formatter func', { modules: { settings: ['YAxis'] } }))
    .toEqual({ tickFormat: 'formatter func' });

  // Merge into non-empty input object
  expect(getYAxis({ foo: 'bar' }, 'formatter func', { modules: { settings: ['YAxis'] } }))
    .toEqual({ foo: 'bar', tickFormat: 'formatter func' });
});

test('Test X Axis formatting functions', () => {
  const formatString = 'YYYYMMDD';
  const mergeTest = getXAxis(
    { foo: 'bar' },
    (ts) => dateUtils.format(ts, formatString)
  );
  // Test that object set up correctly
  expect(Object.keys(mergeTest)).toHaveLength(2);
  expect(Object.keys(mergeTest)).toContain('foo');
  expect(Object.keys(mergeTest)).toContain('tickFormat');

  // Test output for tickFormat function
  expect(mergeTest.tickFormat(Date.now))
    .toEqual(dateUtils.format(Date.now, formatString));
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
      misc: 'other miscellaneous options',
    },
  };

  const typeConfig = {
    dataFormat: 'nvd3SingleSeries',
    modules: {
      settings: ['YAxis'],
    },
  };

  const applied = applyTickFormatters(chartOptions, typeConfig);

  expect(applyTickFormatters(chartOptions, null)).toBe(chartOptions);
  // Should have kept date format string in xAxis
  expect(applied.xAxis.dateFormatString).toEqual('YYYYMMDD');
  // Should have kept other values in the options object
  expect(applied.other.misc).toEqual('other miscellaneous options');
});
