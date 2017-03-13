/* global describe test expect jest */
/* eslint no-undef: "error" */

import createFormatter from '../../app/utils/createFormatter.js';

describe('createFormatter.createFormatter', () => {
  test('creates default formatting function', () => {
    expect(createFormatter()).toBeInstanceOf(Function);
  });
});
