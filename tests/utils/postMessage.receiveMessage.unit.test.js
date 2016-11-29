const postMessage = require('../../app/utils/postMessage.js');

describe('postMessage.receiveMessage', () => {

  let messageType = 'type';
  let callback = 'callback';

  test('make sure callback empty at first', () => {
    expect(postMessage._callbacks[messageType]).toBeUndefined();
  });

  test('add a callback for message type', () => {
    postMessage.receiveMessage(messageType,callback);
    expect(postMessage._callbacks[messageType]).toContain(callback);
  });

});
