/* global describe test expect jest */
/* eslint no-undef: "error" */

import * as postMessage from '../../app/utils/postMessage.js';

describe('postMessage.receiveMessage', () => {
  const messageType = 'type';
  const callback = 'callback';

  test('make sure callback empty at first', () => {
    expect(postMessage._callbacks[messageType]).toBeUndefined();
  });
  test('add a callback for message type', () => {
    postMessage.receiveMessage(messageType, callback);
    expect(postMessage._callbacks[messageType]).toContain(callback);
  });
});
