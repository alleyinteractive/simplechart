/* global describe test expect jest */
/* eslint no-undef: "error" */

const postMessage = require('../../app/utils/postMessage.js');

describe('postMessage.setupPostMessage', () => {
  test('make sure that listener is called', () => {
    const window = {};
    window.location = {};
    window.location.origin = 'http://www.alley.dev';
    window.addEventListener = jest.fn();
    postMessage.setupPostMessage(window);
    expect(window.addEventListener).toHaveBeenCalledTimes(1);
  });
});
