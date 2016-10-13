/**
 * Map error codes to messages. HTML is allowed in messages.
 */
const map = {
  e001: 'Data formatting error; see below for details.',
  e002: 'Data field is empty.',
};

/**
 * Return error message for use with dangerouslySetInnerHTML attribute
 */
export default function(code) {
  return { __html:
    `<p class="errorMessageContent">${map[code] || 'Unknown error.'}</p>` };
}
