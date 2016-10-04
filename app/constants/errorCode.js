/**
 * Map error codes to error messages
 */

const map = {
  e001: 'Data formatting error; see below for details.',
};

export default function(code) {
  return map[code] || 'Unknown error.';
}
