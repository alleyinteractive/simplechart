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
      return reduceChartOptions(state, action.data.config, action.src);
    }

    default:
  }

  return state;
}

function reduceChartOptions(state, chartTypeConfig, src) {
  let chartOptions = state.chartOptions;

  const hasChanged = state.chartType.type !== chartTypeConfig.type;
  const isScatter = 'nvd3ScatterMultiSeries' === chartTypeConfig.dataFormat;
  if (hasChanged && isScatter) {
    chartOptions = applyAxisLabels(chartOptions, state.dataFields);
  }

  // Setup chart type default options if NOT bootstrapping from postMessage
  if (0 !== src.indexOf('bootstrap')) {
    chartOptions = applyChartTypeDefaults(
      chartTypeConfig,
      state.chartOptions,
      state.defaultsAppliedTo
    );

    // set yDomain if chartData is set up
    if (0 < state.chartData.length) {
      chartOptions = applyYDomain(
        chartOptions,
        chartTypeConfig,
        state.transformedData[chartTypeConfig.dataFormat]
      );
    }

    // Apply tick formatting and return cloned opts object
    chartOptions = applyTickFormatters(
      chartOptions,
      chartTypeConfig,
      state.dateFormat
    );
  }

  return merge(state, {
    chartOptions,
    defaultsAppliedTo: chartTypeConfig.type,
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
