/* global describe test expect jest */
/* eslint no-undef: "error" */

const errorCodeUtils = require('../../app/utils/errorCodeUtils.js');

describe('errorCodeUtils.errorMessageHtml', () => {
  test('unknown error', () => {
    const errorHtml = errorCodeUtils.default('random string');
    const errorTestString = '<p>Unknown error.</p>';
    expect(errorHtml.__html).toEqual(errorTestString);
  });
  test('simplechart error', () => {
    const errorHtml = errorCodeUtils.default('e005');
    const errorTestString = '<p>Simplechart plugin may be out of date. Please update to the latest version.</p>';
    expect(errorHtml.__html).toEqual(errorTestString);
  });
});
