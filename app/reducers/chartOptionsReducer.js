import merge from 'lodash/fp/merge';

import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE } from '../constants';
import applyChartTypeDefaults from '../middleware/utils/applyChartTypeDefaults';
import applyTickFormatters from '../middleware/utils/applyTickFormatters';
import applyYDomain from '../middleware/utils/applyYDomain';

export default function chartOptionsReducer(state, action) {
  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return merge(state, { chartOptions: action.data });
    }

    case RECEIVE_CHART_TYPE: {
      return reduceReceiveChartType(state, action);
    }

    default:
  }

  return state;
}

function reduceReceiveChartType(state, { data, src }) {
  let chartOptions = state.chartOptions;
  const { config } = data;

  const hasChanged = state.chartType.type !== config.type;
  const isScatter = 'nvd3ScatterMultiSeries' === config.dataFormat;
  if (hasChanged && isScatter) {
    chartOptions = applyAxisLabels(chartOptions, state.dataFields);
  }

  // Setup chart type default options if NOT bootstrapping from postMessage
  if (0 !== src.indexOf('bootstrap')) {
    chartOptions = applyChartTypeDefaults(
      config,
      state.chartOptions,
      state.defaultsAppliedTo
    );

    // set yDomain if chartData is set up
    if (0 < state.chartData.length) {
      chartOptions = applyYDomain(
        chartOptions,
        config,
        state.transformedData[config.dataFormat]
      );
    }

    // Apply tick formatting and return cloned opts object
    chartOptions = applyTickFormatters(
      chartOptions,
      config,
      state.dateFormat
    );
  }

  return merge(state, {
    chartType: data,
    chartOptions,
    defaultsAppliedTo: config.type,
    errorCode: '',
  });
}

function applyAxisLabels(chartOptions, dataFields) {
  const [, xLabel, yLabel] = dataFields;
  return merge(chartOptions, {
    chartOptions: {
      xAxis: {
        axisLabel: xLabel,
      },
      yAxis: {
        axisLabel: yLabel,
      },
    },
  });
}
