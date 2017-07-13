/**
 * General purpose debouncer that, as long as it continues to be invoked, will not be triggered.
 *
 * @param function func Function to call
 * @param int wait Delay in ms
 * @param bool immediate Defaults to false. If true trigger the function on the leading edge, instead of the trailing.
 * @return none
 */
export function debounce(func, ...theArgs) {
  let timeout;
  return function setupDebounce() {
    const context = this;
    const args = theArgs;
    const later = function setupLater() {
      timeout = null;
      if (!theArgs[1]) {
        func.apply(context, args);
      }
    };
    const callNow = theArgs[1] && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, theArgs[0]);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Determine if data is multi-series or single series
 *
 * @param {Array} data Data array
 * @return {Boolean} True if multi-series, false if single-series
 */
export function dataIsMultiSeries(data) {
  return ('undefined' !== typeof data[0].key &&
    'undefined' !== typeof data[0].values);
}

/**
 * get value from key or default if not set, also works for arrays
 *
 * @param {Object} obj Basic object or array
 * @param {String} key Key to look for
 * @param {*} defaultValue Default to return if key is not set
 */
export function getObjArrayKey(obj, key, defaultValue = '') {
  return obj && Object.prototype.hasOwnProperty.call(obj, key) ?
    obj[key] :
    defaultValue;
}

/**
 * get value from key or default if not set or not a string,
 * also works for arrays
 *
 * @param {Object} obj Basic object or array
 * @param {String} key Key to look for
 * @param {*} defaultValue Default to return if key is not set
 */
export function getObjArrayKeyStringOnly(obj, key, defaultValue = '') {
  return obj &&
    Object.prototype.hasOwnProperty.call(obj, key) &&
    'string' === typeof obj[key] ?
    obj[key] :
    defaultValue;
}

/**
 * Capitalize the first char of a string, assumes first char is a letter
 */
export function capitalize(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

/**
 * Get array item at specified index, looping back
 * if needed i.e. if (idx >= list.length)
 *
 * @param int idx
 * @param array list
 * @return any
 */
export function loopArrayItemAtIndex(idx, list) {
  return list[idx % list.length];
}

/**
 * @param {object} obj
 * @param {string|string[]} properties
 * @returns {boolean}
 */
export function ownsProperties(obj, properties) {
  return properties.every((property) =>
    Object.prototype.hasOwnProperty.call(obj, property));
}

/**
 * Determine if action src is defined and contains a string, e.g. 'bootstrap'
 *
 * @param {String} src Action source
 * @param {String} key Keyword to look for
 * @return {Boolean}
 */
export function actionSourceContains(src, key) {
  return 'undefined' !== typeof src &&
    -1 < src.toLowerCase().indexOf(key.toLowerCase());
}
