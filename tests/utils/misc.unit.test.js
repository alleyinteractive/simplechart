test('Capitalize test: turns alley into Alley', () => {
  const utils = require('../../app/utils/misc.js');
  expect(utils.capitalize('alley')).toBe("Alley");
});
