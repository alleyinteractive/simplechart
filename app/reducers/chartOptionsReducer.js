import cloneDeep from 'lodash/fp/cloneDeep';
import compose from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import merge from 'lodash/fp/merge';
import pick from 'lodash/fp/pick';
import set from 'lodash/fp/set';
import update from 'immutability-helper';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
  RECEIVE_DATE_FORMAT,
  RECEIVE_TICK_FORMAT,
  RECEIVE_CHART_READY,
  RECEIVE_CHART_RENDERING,
} from '../constants';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';
import applyTickFormatters from './utils/applyTickFormatters';
import applyYDomain from './utils/applyYDomain';
import getXDomain from './utils/getXDomain';
import { defaultBreakpointsOpt, globalChartOptions } from '../constants/chartTypes';
import defaultPalette from '../constants/defaultPalette';
import { transformParsedData } from '../utils/rawDataHelpers';
import { actionSourceContains } from '../utils/misc';
import {
  defaultTickFormatSettings,
  formatScopes,
} from '../constants/defaultTickFormatSettings';

const mergeWithGlobal = (chartOptions, newOptions) =>
  merge(pick(globalChartOptions, chartOptions), newOptions);

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

    case RECEIVE_TICK_FORMAT:
      return reduceReceiveTickFormat(state, action);

    case RECEIVE_CHART_READY:
      return update(state, {
        chartReady: { $set: action.data },
        chartRendering: { $set: false },
      });

    case RECEIVE_CHART_RENDERING:
      return update(state, {
        chartRendering: { $set: action.data },
      });

    default:
  }

  return state;
}

export function reduceReceiveChartOptions(state, { data, src }) {
  const { chartData, chartType: { config } } = state;
  let newOptions = cloneDeep(data);
  const currentOptions = state.chartOptions;

  const shouldApplyDefaultPalette = !get('color.length', currentOptions) &&
    !actionSourceContains(src, 'bootstrap');
  if (shouldApplyDefaultPalette) {
    newOptions = merge(newOptions, { color: defaultPalette });
  }

  newOptions = applyTickFormatters(
    mergeWithGlobal(currentOptions, newOptions),
    config
  );

  const shouldApplyYDomain = chartData.length &&
    'undefined' !== typeof config &&
    !newOptions.yDomain;
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
  const { chartType, dataFields } = state;
  const typeChanged = get('config.type', chartType) !== data.config.type;

  if (actionSourceContains(src, 'bootstrap') || !typeChanged) {
    return merge(state, { chartType: cloneDeep(data) });
  }

  let newOptions = applyChartTypeDefaults(data.config, {});

  if ('function' === typeof data.conditionalOpts) {
    newOptions = merge(newOptions, data.conditionalOpts(state));
  }

  // Clear yDomain on chart type change to have a default one generated.
  newOptions = set('yDomain', null, newOptions);

  // Prepopulate labels and xDomain for scatter/bubble charts
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

    // Set up xDomain if unset
    if ('undefined' === typeof get('chartOptions.xDomain', state)) {
      newOptions = merge(newOptions, {
        xDomain: getXDomain(state.chartData),
      });
    }
  }

  return compose(
    set('chartType', cloneDeep(data)),
    set('chartOptions', mergeWithGlobal(state.chartOptions, newOptions))
  )(state);
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
  const receivedUpdate = data[scope];
  const oldSettings = state.chartOptions.tickFormatSettings || {};
  let newSettings;

  const getMergedSettings = (scopeName) => Object.assign(
    {},
    defaultTickFormatSettings,
    (oldSettings[scopeName] || {}),
    receivedUpdate
  );

  if ('all' === scope) {
    const globalSettings = getMergedSettings('all');
    newSettings = formatScopes.reduce((acc, { name }) => {
      acc[name] = globalSettings;
      return acc;
    }, {});
  } else {
    newSettings = Object.assign(
      {},
      oldSettings,
      set(scope, getMergedSettings(scope), {})
    );
  }

  // Update tickFormatSettings then applyTickFormatters
  const newState = set('chartOptions.tickFormatSettings', newSettings, state);
  return set(
    'chartOptions',
    applyTickFormatters(newState.chartOptions, newState.chartType.config),
    newState
  );
}
