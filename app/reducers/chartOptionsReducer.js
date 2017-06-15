import merge from 'lodash/fp/merge';

import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE } from '../constants';
import applyChartTypeDefaults from '../middleware/utils/applyChartTypeDefaults';
import applyTickFormatters from '../middleware/utils/applyTickFormatters';
import applyYDomain from '../middleware/utils/applyYDomain';

export default function chartOptionsReducer(state = {}, action) {
  let newState = state;
  if (!newState.chartOptions) {
    newState = Object.assign({}, newState, { chartOptions: {} });
  }

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return merge(newState, { chartOptions: action.data });
    }

    case RECEIVE_CHART_TYPE: {
      let chartOptions = state.chartOptions;
      const chartTypeConfig = action.data.config;

      const hasChanged = state.chartType.type !== chartTypeConfig.type;
      const isScatter = 'nvd3ScatterMultiSeries' === chartTypeConfig.dataFormat;
      if (hasChanged && isScatter) {
        chartOptions = applyAxisLabels(chartOptions, state.dataFields);
      }

      // Setup chart type default options if NOT bootstrapping from postMessage
      if (0 !== action.src.indexOf('bootstrap')) {
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

      return merge(newState, {
        chartOptions,
        defaultsAppliedTo: chartTypeConfig.type,
      });
    }

    default:
  }

  return newState;
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
