/* global describe test expect jest */
/* eslint no-undef: "error" */
/* eslint-disable no-console */

const postMessage = require('../../app/utils/postMessage.js');

describe('postMessage.sendMessage', () => {
  test('sendmessage test error – not top window', () => {
    Object.defineProperty(window.location, 'host', {
      writable: true,
      value: 'http://www.alley.dev',
    });
    expect(() => {
      postMessage.sendMessage('test', 'data');
    }).toThrowError('No parent window available for postMessage type test');
  });
  test('sendmessage test local – not top window', () => {
    Object.defineProperty(window.location, 'host', {
      writable: true,
      value: 'localhost:8080',
    });
    console.log = jest.fn();
    postMessage.sendMessage();
    expect(console.log).toHaveBeenCalledTimes(1);
  });
  test('sendmessage test works', () => {
    const window = {};
    window.parent = {};
    window.parent.postMessage = jest.fn();
    window.frameElement = true;
    window.location = {};
    window.location.orgin = 'http://www.alley.dev';
    postMessage.sendMessage(
      'type',
      'data',
      window
    );
    expect(window.parent.postMessage).toHaveBeenCalledTimes(1);
  });
});
