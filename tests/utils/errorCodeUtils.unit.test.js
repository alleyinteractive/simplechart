const errorCodeUtils = require('../../app/utils/errorCodeUtils.js');

describe('errorCodeUtils.errorMessageHtml', () => {

  test('unknown error', () => {
    let errorHtml = errorCodeUtils.default('random string');
    let errorTestString = '<p>Unknown error.</p>';
    expect(errorHtml.__html).toEqual(errorTestString);
  });

  test('simplechart error', () => {
    let errorHtml = errorCodeUtils.default('e005');
    let errorTestString = '<p>Simplechart plugin may be out of date. Please update to the latest version.</p>';
    expect(errorHtml.__html).toEqual(errorTestString);
  });

});
