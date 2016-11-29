const createFormatter = require('../../app/utils/createFormatter.js');

describe('createFormatter.createFormatter', () => {

  test('creates default formatting function', () => {
    expect(createFormatter.default()).toBeInstanceOf(Function);
  });

});
