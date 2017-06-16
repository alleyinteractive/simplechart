import actionTrigger from '../../app/actions';
import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE } from '../../app/constants';
import reduce from '../../app/reducers/chartOptionsReducer';

test('merges chart options ', () => {
  const state = {
    chartOptions: {
      type: 'scatterChart',
      showLegend: true,
      color: [],
    },
  };

  const action = actionTrigger(RECEIVE_CHART_OPTIONS, {
    type: 'bubbleChart',
    showLegend: true,
    showControls: false,
    color: ['#1f77b4'],
  });

  const expected = {
    chartOptions: {
      type: 'bubbleChart',
      showLegend: true,
      showControls: false,
      color: ['#1f77b4'],
    },
  };

  expect(reduce(state, action)).toEqual(expected);
});

describe('receiveChartType', () => {
  test('merges related properties', () => {

  });

  test('applies axis labels if selecting scatter', () => {
    const state = {
      chartData: [],
      chartOptions: {},
      chartType: {
        type: 'bubbleChart',
      },
      dataFields: ['Foo', 'Bar', 'Baz'],
    };

    const action = actionTrigger(RECEIVE_CHART_TYPE, {
      config: {
        type: 'scatterChart',
        dataFormat: 'nvd3ScatterMultiSeries',
      },
    }, 'bootstrap.edit');

    const expected = {
      chartOptions: {
        xAxis: {
          axisLabel: 'Bar',
        },
        yAxis: {
          axisLabel: 'Baz',
        },
      },
    };

    expect(reduce(state, action)).toMatchObject(expected);
  });

  test('applies chartTypeDefaults if not "bootstrapping"', () => {

  });

  test('applies yDomain if one has not already been applies', () => {

  });

  test('applies tick formatters', () => {

  });
});
