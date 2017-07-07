import update from 'immutability-helper';
import {
  RECEIVE_CHART_TYPE,
} from '../constants';
import actionTrigger from '../actions';
/**
 * Apply conditional chart type options depending on application state
 * @todo Only apply when chart type is changing
 */
export default function conditionalChartOptions({ getState }) {
  return (dispatch) => ({ type, data, src }) => {
    if (RECEIVE_CHART_TYPE !== type ||
      'undefined' === typeof data.getConditionalOpts
    ) {
      return dispatch(actionTrigger(type, data, src));
    }

    if (!(data.getConditionalOpts instanceof Function)) {
      // eslint-disable-next-line no-console
      console.warn(`getConditionalOpts for chart type ${data.config.type} must be a function`);
      return dispatch(actionTrigger(type, data, src));
    }

    // Apply conditional opts and remove getter function
    const newOpts = update(data, {
      conditionalOpts: {
        $set: data.getConditionalOpts(getState()),
      },
      $unset: ['getConditionalOpts'],
    });

    return dispatch(actionTrigger(type, newOpts, src));
  };
}
