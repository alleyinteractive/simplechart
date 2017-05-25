import merge from 'lodash/fp/merge';

import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE } from '../constants';

export default function chartOptionsReducer(state = {}, action) {
  const newState = Object.assign({ chartOptions: {} }, state);

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      return merge(newState, { chartOptions: action.data });
    }

    case RECEIVE_CHART_TYPE: {
      const [, xLabel, yLabel] = state.dataFields;
      const chartTypeConfig = action.data.config;
      const hasChanged = state.chartType.type !== chartTypeConfig.type;
      const isScatter = 'nvd3ScatterMultiSeries' === chartTypeConfig.dataFormat;

      if (hasChanged && isScatter) {
        return merge(newState, {
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
      break;
    }

    default:
  }

  return newState;
}
