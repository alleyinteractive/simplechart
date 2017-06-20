import merge from 'lodash/fp/merge';
import { BOOTSTRAP_APP } from '../constants';

export default function bootstrapReducer(state, action) {
  if (action.type !== BOOTSTRAP_APP) {
    return state;
  }

  return merge(state, {
    chartOptions: action.data.chartOptions,
    googleApiKey: action.data.googleApiKey,
    googleSheetId: action.data.googleSheetId,
  });
}
