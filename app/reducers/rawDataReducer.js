import { RECEIVE_RAW_DATA, RECEIVE_RAW_DATA_INIT } from '../constants';

export default function rawDataReducer(state = '', action) {
  switch (action.type) {
    case RECEIVE_RAW_DATA_INIT:
    case RECEIVE_RAW_DATA: {
      return action.data;
    }
    default:
      return state;
  }
}
