import actionTrigger from '../../app/actions';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_DATE_FORMAT,
} from '../../app/constants';
import {
  reduceReceiveChartOptions,
  reduceReceiveChartType,
  reduceReceiveDateFormat,
} from '../../app/reducers/chartOptionsReducer';
import {
  defaultBreakpointsOpt,
  selectableChartTypes,
  nvd3Defaults,
} from '../../app/constants/chartTypes.js';
import defaultPalette from '../../app/constants/defaultPalette';

describe('reduceReceiveChartOptions', () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      chartData: [
        { key: 'foo', values: [{ x: 1, y: 1 }] },
      ],
      chartOptions: {
        height: null,
      },
      chartType: {
        config: {
          dataFormat: 'nvd3',
          modules: {
            settings: ['YAxis'],
          },
        },
      },
    };
  });

  test('applies default color palette', () => {
    const action = actionTrigger(RECEIVE_CHART_OPTIONS, { color: [] });
    const result = reduceReceiveChartOptions(mockState, action);

    expect(result.chartOptions.color).toEqual(defaultPalette);
  });

  test('applies tick formatters', () => {
    const action = actionTrigger(RECEIVE_CHART_OPTIONS, {
      tickFormatSettings: {
        locale: 23,
      },
    });

    const result = reduceReceiveChartOptions(mockState, action);
    expect(result.chartOptions).toHaveProperty('yAxis');
  });

  test('applies y domain', () => {
    const action = actionTrigger(RECEIVE_CHART_OPTIONS);
    const result = reduceReceiveChartOptions(mockState, action);
    expect(result.chartOptions).toHaveProperty('yDomain', [1, 1]);
  });

  test('applies default break points', () => {
    const action = actionTrigger(RECEIVE_CHART_OPTIONS, { height: 400 });
    const result = reduceReceiveChartOptions(mockState, action);
    expect(result.chartOptions).toHaveProperty('breakpoints', defaultBreakpointsOpt);
  });
});

describe('reduceReceiveChartType', () => {
  let mockState;
  beforeEach(() => {
    mockState = {
      chartOptions: {
        color: [],
      },
      chartType: {
        type: 'lineChart',
      },
      dataFields: ['Foo', 'Bar', 'Baz'],
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
        dataFormat: 'nvd3',
      },
    };

    const action = actionTrigger(RECEIVE_CHART_TYPE, actionPayload, 'bootstrap.edit');
    const result = reduceReceiveChartType(mockState, action);
    expect(result).toMatchObject({
      chartType: actionPayload,
    });
  });

  test('applies axis labels if selecting scatter', () => {
    const action = actionTrigger(RECEIVE_CHART_TYPE, {
      config: {
        type: 'scatterChart',
        dataFormat: 'nvd3ScatterMultiSeries',
      },
    });
    const result = reduceReceiveChartType(mockState, action);
    expect(result).toMatchObject({
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
    const result = reduceReceiveChartType(mockState, action).chartOptions;
    expect(result).toMatchObject(nvd3Defaults.nvd3MultiSeries);
    expect(result).toHaveProperty('yDomain', null);
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
    const result = reduceReceiveDateFormat(mockState, action);
    expect(result.chartOptions).toMatchObject({
      dateFormat: payload,
    });
  });

  test('applies chartOptions and transformedData if valid', () => {
    const action = actionTrigger(RECEIVE_DATE_FORMAT, {
      enabled: true,
      validated: true,
      formatString: 'YYYY',
    });

    expect(reduceReceiveDateFormat(mockState, action)).toMatchObject({
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
