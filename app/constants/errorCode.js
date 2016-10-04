/**
 * Map error codes to error messages
 */

const map = {
  e001: 'Error 001',
}

export default function(code) {
  return map[code] || 'Unknown error';
}