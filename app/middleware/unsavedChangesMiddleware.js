import { UNSAVED_CHANGES, CHART_UPDATE_ACTIONS } from '../constants';
import actionTrigger from '../actions';

export default function middleware() {
  return (next) => (action) => {
    const result = next(action);
    /**
     * If received action is one that updates the chart data/options
     * we have unsaved changes!
     */
    if (CHART_UPDATE_ACTIONS.indexOf(action.type) > -1) {
      next(actionTrigger(UNSAVED_CHANGES, true));
    }
    return result;
  };
}
