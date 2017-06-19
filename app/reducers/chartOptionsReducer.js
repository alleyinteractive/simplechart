import cloneDeep from 'lodash/fp/cloneDeep';
import merge from 'lodash/fp/merge';
import set from 'lodash/fp/set';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_DATE_FORMAT,
} from '../constants';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';
import applyTickFormatters from './utils/applyTickFormatters';
import applyYDomain from './utils/applyYDomain';
import { defaultBreakpointsOpt } from '../constants/chartTypes';
import defaultPalette from '../constants/defaultPalette';
import { transformParsedData } from '../utils/rawDataHelpers';

export default function chartOptionsReducer(state, action) {
  switch (action.type) {
    case RECEIVE_CHART_OPTIONS:
      return reduceChartOptions(state, cloneDeep(action.data), action.src);

    case RECEIVE_CHART_TYPE:
      return reduceReceiveChartType(state, action);

    case RECEIVE_DATE_FORMAT:
      return reduceReceiveDateFormat(state, action);

    default:
  }

  return state;
}

function reduceChartOptions(state, chartOptions, src) {
  const { chartData, chartType: { config } } = state;
  let newOptions = chartOptions;
  const currentOptions = state.chartOptions;
  const isBootstrap = 0 === src.indexOf('bootstrap');

  const shouldApplyDefaultPalette = !currentOptions.color.length &&
    !isBootstrap && (!newOptions.color || !newOptions.color.length);
  if (shouldApplyDefaultPalette) {
    newOptions = merge(newOptions, { color: defaultPalette });
  }

  const shouldApplyTickFormatters = newOptions.tickFormatSettings &&
    config && !isBootstrap;
  if (shouldApplyTickFormatters) {
    newOptions = applyTickFormatters(newOptions, config);
  }

  const shouldApplyYDomain = !newOptions.yDomain &&
    0 < chartData.length && config;
  if (shouldApplyYDomain) {
    newOptions = applyYDomain(newOptions, config, chartData);
  }

  const shouldApplyBreakpoints = !newOptions.breakpoints &&
    !currentOptions.breakpoints;
  if (shouldApplyBreakpoints) {
    const breakpoints = merge(defaultBreakpointsOpt, {
      values: [{ height: newOptions.height || currentOptions.height }],
    });
    newOptions = merge(newOptions, { breakpoints });
  }

  return merge(state, {
    chartOptions: newOptions,
    errorCode: '',
  });
}

function reduceReceiveChartType(state, { data, src }) {
  const { chartType: { config } } = state;
  const chartTypeChanged = (config ? config.type : null) !== data.config.type;

  // Clear yDomain on chart type change to have a default one generated.
  let chartOptions = set('yDomain', null, state.chartOptions);
  const isBootstrap = 0 === src.indexOf('bootstrap');

  const shouldPrepopulateLabels = chartTypeChanged &&
    'nvd3ScatterMultiSeries' === data.config.dataFormat;
  if (shouldPrepopulateLabels) {
    const [, xLabel, yLabel] = state.dataFields;
    chartOptions = merge(chartOptions, {
      xAxis: {
        axisLabel: xLabel,
      },
      yAxis: {
        axisLabel: yLabel,
      },
    });
  }

  const shouldApplyChartTypeDefaults = !isBootstrap && chartTypeChanged;
  if (shouldApplyChartTypeDefaults) {
    chartOptions = applyChartTypeDefaults(data.config, chartOptions);
  }

  const newState = set('chartType', cloneDeep(data), state);
  return reduceChartOptions(newState, chartOptions, src);
}

function reduceReceiveDateFormat(state, { data }) {
  const dateFormat = merge(state.chartOptions.dateFormat, data);

  const isValid = dateFormat.enabled && dateFormat.validated;
  if (!isValid) {
    return merge(state, { chartOptions: { dateFormat } });
  }

  return merge(state, {
    chartOptions: {
      dateFormat,
      xAxis: {
        dateFormatString: dateFormat.formatString,
      },
    },
    transformedData: transformParsedData(
      state.parsedData,
      state.dataFields,
      dateFormat
    ),
  });
}
