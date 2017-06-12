import update from 'immutability-helper';
import { BOOTSTRAP_APP } from '../constants';

export default function bootstrapReducer(state = {}, action) {
  if (action.type !== BOOTSTRAP_APP) {
    return state;
  }

  return update(state, {
    googleApiKey: {
      $set: action.data.googleApiKey,
    },
    googleSheetId: {
      $set: action.data.googleSheetId,
    },
  });
}
