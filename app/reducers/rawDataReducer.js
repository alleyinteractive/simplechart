import update from 'react-addons-update';
import { RECEIVE_RAW_DATA } from '../constants';

export default function rawDataReducer(state = {}, action) {
  if (action.type === RECEIVE_RAW_DATA) {
    if (!action.data.length) {
      return update(state, {
        chartData: { $set: [] },
        chartOptions: { $set: {} },
        chartType: { $set: {} },
      });
    }
  }

  return state;
}
