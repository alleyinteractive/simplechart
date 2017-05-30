import { CHART_UPDATE_ACTIONS, UNSAVED_CHANGES } from '../constants';

export default function unsavedChangesReducer(state = false, action) {
  const { type, src, data } = action;
  const chartChanged = -1 < CHART_UPDATE_ACTIONS.indexOf(type) &&
    -1 === src.indexOf('bootstrap');

  if (chartChanged) {
    return true;
  }

  if (type === UNSAVED_CHANGES) {
    return data;
  }

  return state;
}
