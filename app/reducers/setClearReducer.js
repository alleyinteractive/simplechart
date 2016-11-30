/**
 * Reusable reducer to set/clear store elements
 *
 * @param any defaultValue Value for initialzing and resetting the store
 * @param string setAction Action name when setting a new value for the store
 * @param string clearAction Action name when clearing the store
 * @return function Reducer function accepting the state and action
 */
export default function reducer(defaultValue, setAction, clearAction) {
  return (state, action) => {
    switch (action.type) {
      case setAction:
        return action.data;

      case clearAction:
        return defaultValue;

      default:
        return state || defaultValue;
    }
  };
}
