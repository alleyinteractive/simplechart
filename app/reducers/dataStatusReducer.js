import { PARSE_DATA_STATUS } from '../constants';

export default function dataStatusReducer(state = {}, action) {
  switch (action.type) {
    case PARSE_DATA_STATUS: {
      return action.data;
    }
    default:
      return state;
  }
}
