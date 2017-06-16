import update from 'immutability-helper';
import { CHART_UPDATE_ACTIONS, UNSAVED_CHANGES } from '../constants';

export default function unsavedChangesReducer(state, { type, src, data }) {
  const chartChanged = -1 < CHART_UPDATE_ACTIONS.indexOf(type) &&
    -1 === src.indexOf('bootstrap');
  let value = state.unsavedChanges;

  if (chartChanged) {
    value = true;
  } else if (type === UNSAVED_CHANGES) {
    value = data;
  }

  return update(state, {
    unsavedChanges: {
      $set: value,
    },
  });
}
