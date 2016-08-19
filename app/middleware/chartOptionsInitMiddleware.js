import { RECEIVE_CHART_OPTIONS_INIT } from '../constants';
import { defaultPalette } from '../constants/defaultPalette';
import actionTrigger from '../actions';

export default function chartOptionsMiddleware() {
  return (next) => (action) => {
    const store = next(action);
    if (action.type !== RECEIVE_CHART_OPTIONS_INIT) {
      return store;
    }

    // apply default D3 palette if none provided
    if (!store.data.color) {
      store.data.color = defaultPalette;
      next(actionTrigger(
        RECEIVE_CHART_OPTIONS_INIT,
        store.data
      ));
    }

    return store;
  };
}
