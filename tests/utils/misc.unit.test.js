const utils = require('../../app/utils/misc.js');

test('Capitalize test: turns alley into Alley', () => {
  expect(utils.capitalize('alley')).toBe('Alley');
});


describe('actionSourceContains', () => {
  test('should handle undefined source', () => {
    expect(utils.actionSourceContains(undefined, 'bootstrap')).toBe(false);
  });

  test('should handle defined source', () => {
    expect(utils.actionSourceContains('bootstrap', 'bootstrap')).toBe(true);
    expect(utils.actionSourceContains('noopstrap', 'bootstrap')).toBe(false);
  });
});
