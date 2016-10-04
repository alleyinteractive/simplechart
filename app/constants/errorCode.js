/**
 * Map error codes to messages. HTML is allowed in messages.
 */
const map = {
  e001: 'Data formatting error; see below for details.',
};

/**
 * Return error message for use with dangerouslySetInnerHTML attribute
 */
export default function(code, defaultMsg = 'Unknown error.') {
  return {
    __html: `<p class="errorMessageContent">${map[code] || defaultMsg}</p>`,
  };
}
