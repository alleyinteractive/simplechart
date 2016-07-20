import { UNSAVED_CHANGES, CHART_ACTIONS } from '../constants';
import actionTrigger from '../actions';

export default function middleware() {
  return (next) => (action) => {
    const store = next(action);
    /**
     * If received action is one that updates the chart data/options
     * we have unsaved changes!
     */
    if (CHART_ACTIONS.indexOf(action.type) > -1) {
      next(actionTrigger(UNSAVED_CHANGES, true));
    }
    return store;
  };
}
