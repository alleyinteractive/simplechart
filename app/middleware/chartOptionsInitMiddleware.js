import {
  RECEIVE_CHART_OPTIONS_INIT,
} from '../constants';
import { defaultPalette } from '../constants/defaultPalette';
import actionTrigger from '../actions';

export default function middleware({ getState }) {
  return (dispatch) => (action) => {
    if (action.type !== RECEIVE_CHART_OPTIONS_INIT) {
      console.log(action.type, action.data);
      return dispatch(action);
    }

    // apply default D3 palette if none provided or already set in store
    debugger;
    const nextActionData = action.data;
    if (!action.data.color && !getState().chartOptions.color) {
      nextActionData.color = defaultPalette;
    }

    return dispatch(actionTrigger(action.type, nextActionData));
  };
}
