import { UNSAVED_CHANGES } from '../constants';

export default function reducer(state = false, action) {
  switch (action.type) {
    case UNSAVED_CHANGES: {
      return action.data;
    }
    default:
      return state;
  }
}
