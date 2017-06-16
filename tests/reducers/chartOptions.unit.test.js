import actionTrigger from '../../app/actions';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_DATE_FORMAT,
} from '../../app/constants';
import reduce from '../../app/reducers/chartOptionsReducer';
import { selectableChartTypes, nvd3Defaults } from '../../app/constants/chartTypes.js';

test('merges chart options ', () => {
  const mockState = {
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

  expect(reduce(mockState, action)).toEqual(expected);
});

describe(RECEIVE_CHART_TYPE, () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      chartData: [
        { key: 'foo', values: [{ x: 1, y: 1 }] },
      ],
      chartOptions: {},
      chartType: {
        type: 'lineChart',
      },
      dataFields: ['Foo', 'Bar', 'Baz'],
      errorCode: 'e006',
      transformedData: {
        nvd3MultiSeries: [
          { key: 'foo', values: [{ x: 1, y: 1 }] },
        ],
      },
    };
  });

  test('merges related properties', () => {
    const actionPayload = {
      config: {
        type: 'bubbleChart',
      },
      defaultOpts: {},
    };

    const action = actionTrigger(RECEIVE_CHART_TYPE, actionPayload, 'bootstrap.edit');

    expect(reduce(mockState, action)).toMatchObject({
      chartType: actionPayload,
      defaultsAppliedTo: 'bubbleChart',
      errorCode: '',
    });
  });

  test('applies axis labels if selecting scatter', () => {
    const action = actionTrigger(RECEIVE_CHART_TYPE, {
      config: {
        type: 'scatterChart',
        dataFormat: 'nvd3ScatterMultiSeries',
      },
    }, 'bootstrap.edit');

    expect(reduce(mockState, action)).toMatchObject({
      chartOptions: {
        xAxis: {
          axisLabel: 'Bar',
        },
        yAxis: {
          axisLabel: 'Baz',
        },
      },
    });
  });

  test('applies chartOptions if not "bootstrapping"', () => {
    const action = actionTrigger(RECEIVE_CHART_TYPE, selectableChartTypes[2]);
    const result = reduce(mockState, action).chartOptions;

    expect(result).toMatchObject(nvd3Defaults.nvd3MultiSeries);
    expect(result).toHaveProperty('yDomain', [1, 1]);
  });
});

describe(RECEIVE_DATE_FORMAT, () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      chartOptions: {},
      parsedData: [{ Country: '2000', Foo: '3259.3' }],
      dataFields: ['Country', 'Foo'],
    };
  });

  test('merges action payload', () => {
    const payload = {
      enabled: true,
      validated: false,
      formatString: 'asdf',
    };

    const action = actionTrigger(RECEIVE_DATE_FORMAT, payload);

    expect(reduce(mockState, action).chartOptions).toMatchObject({
      dateFormat: payload,
    });
  });

  test('applies chartOptions and transformedData if valid', () => {
    const action = actionTrigger(RECEIVE_DATE_FORMAT, {
      enabled: true,
      validated: true,
      formatString: 'YYYY',
    });

    expect(reduce(mockState, action)).toMatchObject({
      chartOptions: {
        xAxis: {
          dateFormatString: 'YYYY',
        },
      },
      transformedData: {
        nvd3SingleSeries: [{ label: '2000', value: 3259.3 }],
      },
    });
  });
});
