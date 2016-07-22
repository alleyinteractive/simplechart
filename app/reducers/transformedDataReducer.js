import { TRANSFORM_DATA } from '../constants';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case TRANSFORM_DATA: {
      return action.data;
    }
    default:
      return state;
  }
}
