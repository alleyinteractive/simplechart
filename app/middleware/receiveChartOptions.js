/**
 * RECEIVE_CHART_OPTIONS middleware
 */

import { RECEIVE_CHART_OPTIONS } from '../constants';
import actionTrigger from '../actions';
import defaultPalette from '../constants/defaultPalette';
import update from 'react-addons-update';
import dispatchChartData from './utils/dispatchChartData';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';

export default function receiveChartType({ getState }) {
  return (dispatch) => (action) => {
    if (RECEIVE_CHART_OPTIONS !== action.type) {
      return dispatch(action);
    }

    /**
     * Setup local vars and functions
     */
    // Clone received options
    let nextOpts = update({}, { $set: action.data });

    // If we have nvd3MultiSeries dataFormat but colors not yet applied
    function _shouldApplyColorsToData() {
      let shouldApply;
      try {
        // If dataFormat is nvd3MultiSeries, check first and last series
        // to see if colors have already been applied
        shouldApply = 'nvd3MultiSeries' === getState().chartType.config.dataFormat &&
          (!{}.hasOwnProperty(getState().chartData.shift(), 'color') ||
          !{}.hasOwnProperty(getState().chartData.pop(), 'color'));
      } catch (err) {
        shouldApply = false;
      }
      return shouldApply;
    }

    // Apply default palette if we haven't already received colors and we're not receiving them now
    // @todo Handle non-NVD3 types
    function _shouldApplyDefaultPalette() {
      return (!nextOpts.color || !nextOpts.color.length) &&
        (!getState().chartOptions.color || !getState().chartOptions.color.length); // eslint-disable-line max-len
    }

    function _shouldApplyChartTypeDefaults() {
      const hasConfig = (getState().chartType.config &&
        getState().chartType.config.type);

      return (!hasConfig ||
        getState().chartType.config.type !== getState().defaultsAppliedTo);
    }

    /**
     * Handle received chart options
     */

    // Set up colors if needed. This will apply when a new chart does not receive a custom color palette
    if (_shouldApplyDefaultPalette()) {
      nextOpts = update(nextOpts, { color: { $set: defaultPalette } });
    }

    // Apply colors to chartData if needed
    if (_shouldApplyColorsToData()) {
      dispatchChartData(
        dispatch,
        getState().chartType.config,
        getState().transformedData,
        nextOpts.color
      );
    }

    // Apply default options
    if (_shouldApplyChartTypeDefaults()) {
      nextOpts = applyChartTypeDefaults(
        getState().chartType.config,
        nextOpts,
        getState().defaultsAppliedTo
      );
    }

    // Apply tick/value formatting

    // Apply yDomain

    // Send nextOpts to Redux store
    return dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, nextOpts));
  };
}
