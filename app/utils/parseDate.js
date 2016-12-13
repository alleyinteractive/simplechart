import fecha from 'fecha';

/**
 * Date parsing utilities
 */

/**
 * @param string dateString The date string input, e.g. '03/20/1982'
 * @param string formatString The format to test, e.g. 'MM/DD/YYYY'
 * @return bool
 */
export function validate(dateString, formatString) {
  try {
    return dateString === fecha.format(
      fecha.parse(dateString, formatString), formatString
    );
  } catch (e) {
    return false;
  }
}

/**
 * Convert date string to UTC milliseconds
 *
 * @param string dateString The date string input, e.g. '03/20/1982'
 * @param string formatString The format to test, e.g. 'MM/DD/YYYY'
 * @return int|null
 */
export function parse(dateString, formatString) {
  try {
    return fecha.parse(dateString, formatString).getTime();
  } catch (e) {
    return null;
  }
}

/**
 * Convert UTC milliseconds to date format
 *
 * @param int timestamp UTC milliseconds
 * @param string formatString The format to test, e.g. 'MM/DD/YYYY'
 * @return string Formatted date or 'Date error' if error
 */
export function format(timestamp, formatString) {
  try {
    return fecha.format(timestamp, formatString);
  } catch (e) {
    return 'Date format error';
  }
}

/**
 * Test format string against list parsed dates
 *
 * @param string formatString String to test
 * @param array dates List of dates parsed from first column of CSV input
 * @return null|string Null if all dates pass or string of first date that failed validation
 */
export function disproveList(formatString, dates) {
  return dates.reduce((acc, dateString) => {
    if (acc) {
      return acc;
    }
    return validate(dateString, formatString) ? null : dateString;
  }, null);
}
