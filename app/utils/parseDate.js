import fecha from 'fecha';

/**
 * Date parsing utilities
 */

/**
 * @param string dateString The date string input, e.g. '03/20/1982'
 * @param string format The format to test, e.g. 'MM/DD/YYYY'
 * @return bool
 */
 export function validate(dateString, format) {
  try {
    return dateString === fecha.format(fecha.parse(dateString, format), format);
  } catch (e) {
    return false;
  }
}

/**
 * Convert date string to UTC milliseconds
 *
 * @param string dateString The date string input, e.g. '03/20/1982'
 * @param string format The format to test, e.g. 'MM/DD/YYYY'
 * @return int|null
 */
export function parse(dateString, format) {
  try {
    return fecha.parse(dateString, format).getTime();
  } catch (e) {
    return null;
  }
}

/**
 * Convert UTC milliseconds to date format
 *
 * @param int timestamp UTC milliseconds
 * @param string format The format to test, e.g. 'MM/DD/YYYY'
 * @return string Formatted date or 'Date error' if error
 */
export function format(timestamp, format) {
  try {
    return fecha.format(timestamp, format);
  } catch (e) {
    return 'Date format error';
  }
}
