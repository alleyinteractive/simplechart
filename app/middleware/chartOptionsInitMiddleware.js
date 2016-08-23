import { RECEIVE_CHART_OPTIONS_INIT } from '../constants';
import { defaultPalette } from '../constants/defaultPalette';
import actionTrigger from '../actions';

export default function middleware() {
  return (next) => (action) => {
    const result = next(action);
    if (action.type !== RECEIVE_CHART_OPTIONS_INIT) {
      return result;
    }

    // apply default D3 palette if none provided
    if (!result.data.color) {
      result.data.color = defaultPalette;
      next(actionTrigger(
        RECEIVE_CHART_OPTIONS_INIT,
        result.data
      ));
    }

    return result;
  };
}
