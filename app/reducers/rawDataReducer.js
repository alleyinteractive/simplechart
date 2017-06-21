import update from 'immutability-helper';
import { RECEIVE_RAW_DATA } from '../constants';
import { initialState } from './rootReducer';

export default function rawDataReducer(state, action) {
  if (action.type === RECEIVE_RAW_DATA && !action.data.length) {
    return update(state, {
      chartData: { $set: [] },
      chartOptions: { $set: initialState.chartOptions },
      chartType: { $set: {} },
    });
  }

  return state;
}
