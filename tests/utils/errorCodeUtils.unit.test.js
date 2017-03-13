/* global describe test expect jest */
/* eslint no-undef: "error" */

import errorCodeUtils from '../../app/utils/errorCodeUtils.js';

describe('errorCodeUtils.errorMessageHtml', () => {
  test('unknown error', () => {
    const errorHtml = errorCodeUtils('random string');
    const errorTestString = '<p>Unknown error.</p>';
    expect(errorHtml.__html).toEqual(errorTestString);
  });
  test('simplechart error', () => {
    const errorHtml = errorCodeUtils('e005');
    const errorTestString = '<p>Simplechart plugin may be out of date. Please update to the latest version.</p>';
    expect(errorHtml.__html).toEqual(errorTestString);
  });
});
