import cloneDeep from 'lodash/fp/cloneDeep';
import get from 'lodash/fp/get';
import merge from 'lodash/fp/merge';
import set from 'lodash/fp/set';
import update from 'immutability-helper';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_DATE_FORMAT,
  RECEIVE_TICK_FORMAT,
} from '../constants';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';
import applyTickFormatters from './utils/applyTickFormatters';
import applyYDomain from './utils/applyYDomain';
import { defaultBreakpointsOpt } from '../constants/chartTypes';
import defaultPalette from '../constants/defaultPalette';
import { transformParsedData } from '../utils/rawDataHelpers';
import { actionSourceContains } from '../utils/misc';

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

    case RECEIVE_TICK_FORMAT: {
      const tickFormatScopedSettings = reduceReceiveTickFormat(state, action);
      const updateAction = !state.chartOptions.tickFormatSettings ?
        '$set' : '$merge';
      return update(state, {
        chartOptions: {
          tickFormatSettings: { [updateAction]: tickFormatScopedSettings },
        },
      });
    }

    default:
  }

  return state;
}

export function reduceReceiveChartOptions(state, { data, src }) {
  const { chartData, chartType: { config } } = state;
  let newOptions = cloneDeep(data);
  const currentOptions = state.chartOptions;

  if (!actionSourceContains(src, 'bootstrap')) {
    const shouldApplyDefaultPallette = !get('color.length', currentOptions);
    if (shouldApplyDefaultPallette) {
      newOptions = merge(newOptions, { color: defaultPalette });
    }

    // const shouldApplyTickFormatters = newOptions.tickFormatSettings && config;
    // if (shouldApplyTickFormatters) {
    //   newOptions = applyTickFormatters(newOptions, config);
    // }
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

  if (actionSourceContains(src, 'bootstrap') || !typeChanged) {
    return merge(state, { chartType: cloneDeep(data) });
  }

  let newOptions = applyChartTypeDefaults(data.config, chartOptions);

  if ('function' === typeof data.conditionalOpts) {
    newOptions = merge(newOptions, data.conditionalOpts(state));
  }

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

/**
 * Merge scoped format update into scoped format settings, e.g. { xAxis: { locale: 12 } }
 */
export function reduceReceiveTickFormat(state, { data }) {
  const scope = Object.keys(data)[0];
  if (!state.chartOptions.tickFormatSettings ||
    !state.chartOptions.tickFormatSettings[scope]
  ) {
    return data;
  }
  // if scope settings already exist, merge new item into them and return
  return {
    [scope]: merge(state.chartOptions.tickFormatSettings[scope], data[scope]),
  };
}
