import { RECEIVE_CHART_OPTIONS } from '../constants';
import defaultPalette from '../constants/defaultPalette';
import actionTrigger from '../actions';

export default function middleware({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== RECEIVE_CHART_OPTIONS) {
      return dispatch(action);
    }

    // apply default D3 palette if none provided or already set in store
    /**
     * @todo Handle non-NVD3 chart types
     */
    if (!action.data.color && !getState().chartOptions.color) {
      action.data.color = defaultPalette; // eslint-disable-line no-param-reassign
    }

    return dispatch(actionTrigger(action.type, action.data));
  };
}
