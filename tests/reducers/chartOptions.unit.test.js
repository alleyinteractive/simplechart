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

  const action = {
    type: RECEIVE_CHART_OPTIONS,
    data: {
      type: 'bubbleChart',
      showLegend: true,
      showControls: false,
      color: ['#1f77b4'],
    },
  };

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

test('merges axis labels if selecting scatter', () => {
  const state = {
    chartOptions: {},
    chartType: {
      type: 'bubbleChart',
    },
    dataFields: ['Foo', 'Bar', 'Baz'],
  };

  const action = {
    type: RECEIVE_CHART_TYPE,
    data: {
      config: {
        type: 'scatterChart',
        dataFormat: 'nvd3ScatterMultiSeries',
      },
    },
  };
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
