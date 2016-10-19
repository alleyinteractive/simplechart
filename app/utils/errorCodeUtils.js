/**
 * Return error message for use with dangerouslySetInnerHTML attribute
 */

import errorCodesMap from '../constants/errorCodesMap';

export default function errorMessageHtml(code) {
  return { __html:
    `<p class="errorMessageContent">${errorCodesMap[code] || 'Unknown error.'}</p>` };
}
