import { PARSE_RAW_DATA } from '../constants';

export default function dataReducer(state = '', action) {
  switch (action.type) {
    case PARSE_RAW_DATA: {
      return action.data;
    }
    default:
      return state;
  }
}
