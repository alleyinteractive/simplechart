import merge from 'lodash/fp/merge';

import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_TYPE } from '../constants';

export default function chartOptionsReducer(state = {}, action) {
  let newState = Object.assign({ chartOptions: {} }, state);

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS: {
      newState = merge(newState, { chartOptions: action.data });
      break;
    }

    case RECEIVE_CHART_TYPE: {
      const [xLabel, yLabel] = state.dataFields;
      const chartTypeConfig = action.data.config;

      const shouldSetDefaultAxisLabels =
        state.chartType.type !== chartTypeConfig.type &&
        'nvd3ScatterMultiSeries' === chartTypeConfig.dataFormat;

      if (shouldSetDefaultAxisLabels) {
        newState = merge(state, {
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
