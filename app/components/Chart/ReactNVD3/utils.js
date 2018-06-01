// Taken From:
// https://github.com/NuCivic/react-nvd3
// Brought into repo due to small size and needing to fix linechart renderEnd bug
// Source was paired down and tailored to Simplechart's needs.

/**
 * Checks if an item is present in the given array
 * @param  {Array}   array
 * @param  {Object}  item
 * @return {Boolean}
 */
export function includes(array, item) {
  return 0 <= array.indexOf(item);
}

/**
 * Returns a negated version of a function
 * @param  {Function} f Function to be negated
 * @return {Function}   Negated function
 */
export function negate(fn) {
  return function negateFn(...args) {
    return !fn.apply(this, args);
  };
}

/**
 * Filter an object entries using the predicate
 * {predicate} and the keys {keys} as arguments
 * @param  {Object} obj
 * @param  {Array} keys
 * @param  {Function} predicate
 * @return {Object}
 */
export function filterObject(obj, keys, predicate) {
  const result = {};
  const objKeys = Object.keys(obj);

  for (let i = 0, len = objKeys.length; i < len;) {
    const key = objKeys[i];
    const value = obj[key];
    if (predicate(keys, key)) {
      result[key] = value;
    }
    i += 1;
  }
  return result;
}

/**
 * Returns the object {obj} only with the
 * keys {keys}
 * @param  {Object} obj  Original object
 * @param  {Array} keys  An array of keys to be picked
 * @return {Object}      Result object
 */
export function pick(obj, keys) {
  return filterObject(obj, keys, includes);
}

/**
 * Returns the object {obj} without the
 * keys {keys}
 * @param  {Object} obj  Original object
 * @param  {Array} keys  An array of keys to be removed
 * @return {Object}      Result object
 */
export function without(obj, keys) {
  return filterObject(obj, keys, negate(includes));
}

/**
 * Check if an object is a plain object. In other words
 * if it's an instance of Object.
 * @param  {Any}  obj    Any object to be checked
 * @return {Boolean}
 */
export function isPlainObject(obj) {
  if ('object' === typeof obj && null !== obj) {
    if ('function' === typeof Object.getPrototypeOf) {
      const proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || null === proto;
    }
    return '[object Object]' === Object.prototype.toString.call(obj);
  }
  return false;
}
