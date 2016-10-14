import {
  RECEIVE_CHART_OPTIONS_INIT,
  RECEIVE_CHART_OPTIONS,
  SELECT_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';

export default function({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== SELECT_CHART_TYPE) {
      return dispatch(action);
    }

    // only use init options action if we don't already have a chart type
    const optsAction = getState().chartOptions.type &&
      getState().chartOptions.type.length ?
      RECEIVE_CHART_OPTIONS : RECEIVE_CHART_OPTIONS_INIT;

    /**
     * This is where we'd want to get different options dynamically
     * and even load different libraries in the future other than NVD3
     * depending on the chart type and data format. For instance...
     * 'pieChart' -> 'nvd3SingleSeries'
     * 'lineChart' -> 'nvd3MultiSeries'
     * 'world' -> 'datamaps'
     * etc.
     */
    const opts = defaultOptsFromType(action.data);

    dispatch(actionTrigger(optsAction, opts));

    return dispatch(action);
  };
}
