import cloneDeep from 'lodash/fp/cloneDeep';
import get from 'lodash/fp/get';
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
      return reduceReceiveChartOptions(state, action);

    case RECEIVE_CHART_TYPE: {
      const newState = reduceReceiveChartType(state, action);
      // Reduce chart options, so default options are applied.
      return reduceReceiveChartOptions(newState, { data: {}, src: action.src });
    }

    case RECEIVE_DATE_FORMAT:
      return reduceReceiveDateFormat(state, action);

    default:
  }

  return state;
}

export function reduceReceiveChartOptions(state, { data, src }) {
  const { chartData, chartType: { config } } = state;
  let newOptions = cloneDeep(data);
  const currentOptions = state.chartOptions;
  const isBootstrap = 0 === src.indexOf('bootstrap');

  if (!isBootstrap) {
    const shouldApplyDefaultPallette = !get('color.length', currentOptions);
    if (shouldApplyDefaultPallette) {
      newOptions = merge(newOptions, { color: defaultPalette });
    }

    const shouldApplyTickFormatters = newOptions.tickFormatSettings && config;
    if (shouldApplyTickFormatters) {
      newOptions = applyTickFormatters(newOptions, config);
    }
  }

  const shouldApplyYDomain = chartData.length && config && !newOptions.yDomain;
  if (shouldApplyYDomain) {
    newOptions = applyYDomain(newOptions, config, chartData);
  }

  const shouldApplyBreakpoints = !newOptions.breakpoints;
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

export function reduceReceiveChartType(state, { data, src }) {
  const { chartOptions, chartType, dataFields } = state;
  const typeChanged = get('config.type', chartType) !== data.config.type;
  const isBootstrap = 0 === src.indexOf('bootstrap');

  if (isBootstrap || !typeChanged) {
    return merge(state, { chartType: cloneDeep(data) });
  }

  let newOptions = applyChartTypeDefaults(data.config, chartOptions);

  // Clear yDomain on chart type change to have a default one generated.
  newOptions = set('yDomain', null, newOptions);

  // Prepopulate labels for scatter charts
  if ('nvd3ScatterMultiSeries' === data.config.dataFormat) {
    const [, xLabel, yLabel] = dataFields;
    newOptions = merge(newOptions, {
      xAxis: {
        axisLabel: xLabel,
      },
      yAxis: {
        axisLabel: yLabel,
      },
    });
  }

  const newState = set('chartType', cloneDeep(data), state);
  return merge(newState, { chartOptions: newOptions });
}

export function reduceReceiveDateFormat(state, { data }) {
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
