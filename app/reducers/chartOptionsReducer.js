import update from 'immutability-helper';
import cloneDeep from 'lodash/fp/cloneDeep';
import merge from 'lodash/fp/merge';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_DATE_FORMAT,
} from '../constants';
import applyChartTypeDefaults from '../middleware/utils/applyChartTypeDefaults';
import applyTickFormatters from '../middleware/utils/applyTickFormatters';
import applyYDomain from '../middleware/utils/applyYDomain';
import { transformParsedData } from '../utils/rawDataHelpers';
import { defaultBreakpointsOpt } from '../constants/chartTypes';
import defaultPalette from '../constants/defaultPalette';

export default function chartOptionsReducer(state, action) {
  switch (action.type) {
    case RECEIVE_CHART_OPTIONS:
      return reduceChartOptions(state, action.data, action.src);

    case RECEIVE_CHART_TYPE:
      return reduceReceiveChartType(state, action);

    case RECEIVE_DATE_FORMAT:
      return reduceReceiveDateFormat(state, action);

    default:
  }

  return state;
}

function reduceChartOptions(state, newChartOptions, src) {
  let chartOptions = cloneDeep(newChartOptions);

  const isBootstrap = 0 === src.indexOf('bootstrap');
  const { chartData, chartType, defaultsAppliedTo } = state;

  if (shouldApplyDefaultPalette()) {
    chartOptions = merge(chartOptions, { color: defaultPalette });
  }

  if (shouldApplyChartTypeDefaults()) {
    chartOptions = applyChartTypeDefaults(
      chartType.config,
      chartOptions,
      defaultsAppliedTo
    );
  }

  if (shouldApplyTickFormatters()) {
    chartOptions = applyTickFormatters(chartOptions, chartType.config);
  }

  if (shouldApplyYDomain()) {
    chartOptions = applyYDomain(chartOptions, chartType.config, chartData);
  }

  // Set default breakpoints object
  if (shouldSetBreakpoints()) {
    chartOptions = merge(chartOptions, { breakpoints: applyBreakpoints() });
  }

  return merge(state, {
    chartOptions,
    defaultsAppliedTo: chartType.config.type,
    errorCode: '',
  });

  function shouldApplyDefaultPalette() {
    return !isBootstrap &&
      (!chartOptions.color || !chartOptions.color.length) &&
      (!state.chartOptions.color || !state.chartOptions.color.length);
  }

  function shouldApplyChartTypeDefaults() {
    const configType = chartType.config ? chartType.config.type : null;
    return !isBootstrap && configType && configType !== state.defaultsAppliedTo;
  }

  function shouldApplyTickFormatters() {
    return chartType.config && // must have chart type config in store
      chartOptions.tickFormatSettings && // must have settings to use
      !isBootstrap; // bootstrapStore handles this for initial load
  }

  function shouldApplyYDomain() {
    return !chartOptions.yDomain && // current action is not setting yDomain
      0 < chartData.length && // we have data to analyze
      chartType.config; // we have a chart type to apply domain to
  }

  function shouldSetBreakpoints() {
    return !chartOptions.breakpoints && !state.chartOptions.breakpoints;
  }

  function applyBreakpoints() {
    const defaultHeight = chartOptions.height || state.chartOptions.height;
    if (!defaultHeight) {
      return defaultBreakpointsOpt;
    }
    return merge(defaultBreakpointsOpt, {
      values: [{ height: defaultHeight }],
    });
  }
}

function reduceReceiveChartType(state, action) {
  let chartOptions = update(state.chartOptions, { yDomain: { $set: null } });
  const { config } = action.data;

  const hasChanged = state.chartType.type !== config.type;
  const isScatter = 'nvd3ScatterMultiSeries' === config.dataFormat;
  if (hasChanged && isScatter) {
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

  const newState = update(state, {
    chartType: { $set: cloneDeep(action.data) },
    chartOptions: { $set: chartOptions },
  });

  return reduceChartOptions(newState, chartOptions, action.src);
}

function reduceReceiveDateFormat(state, action) {
  const dateFormat = merge(state.chartOptions.dateFormat, action.data);

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
