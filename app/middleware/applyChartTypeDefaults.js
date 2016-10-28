/**
 * Middleware that applies chart type default options and handles some special cases
 */
import {
  RECEIVE_DEFAULTS_APPLIED_TO,
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';
import { getChartTypeDefaultOpts } from '../utils/chartTypeUtils';
import update from 'react-addons-update';

export default function applyChartOptions({ getState }) {
  return (dispatch) => (action) => {
    const currentOpts = getState().chartOptions;

    // If we're receiving options now, we'll want to include them in what
    // we end up dispatching from this middleware
    let newOpts = update({}, { $set:
      (RECEIVE_CHART_OPTIONS === action.type) ? action.data : {},
    } });

    /**
     * Set chart type defaults
    */
    function _setChartTypeDefaultOpts(mergeInto, chartType) {
      return update(mergeInto, { $merge: {
        getChartTypeDefaultOpts(chartType),
      } })
    }

    // When we are receiving options and already have a chart type config
    const typeConfig = getState().chartType;
    if (RECEIVE_CHART_OPTIONS === action.type && typeConfig.config) {
      // if defaults not already applied for this chart type
      if (typeConfig.config.type !== getState().defaultsAppliedTo) {

      }
    }

    return dispatch(newOpts);
  };
}
