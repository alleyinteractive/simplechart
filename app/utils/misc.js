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
  return function() {
    const context = this;
    const args = theArgs;
    const later = function() {
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
 * @param array data Data array
 * @return bool True if multi-series, false if single-series
 */
export function dataIsMultiSeries(data) {
  return (typeof data[0].key !== 'undefined'
    && typeof data[0].values !== 'undefined');
}
