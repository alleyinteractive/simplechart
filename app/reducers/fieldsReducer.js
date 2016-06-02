import { PARSE_DATA_FIELDS } from '../constants';

export default function dataFieldsReducer(state = {}, action) {
  switch (action.type) {
    case PARSE_DATA_FIELDS: {
      return action.data;
    }
    default:
      return state;
  }
}
