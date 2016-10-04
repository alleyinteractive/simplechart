/**
 * Map error codes to messages. HTML is allowed in messages.
 */
const map = {
  e001: 'Data formatting error; see below for details.',
};

/**
 * Return error message for use with dangerouslySetInnerHTML attribute
 */
export default function(code) {
  return {
    __html: map[code] || 'Unknown error.',
  };
}
