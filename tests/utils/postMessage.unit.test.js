const postMessage = require('../../app/utils/postMessage.js');

test('sendmessage test error – not top window', () => {
  expect(() => {
    postMessage.sendMessage();
  }).toThrow();
});

test('sendmessage test works', () => {
  var window = {};
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

test('receive message', () => {
  let messageType = 'type';
  let callback = 'callback';
  postMessage.receiveMessage(messageType,callback);
  expect(postMessage._callbacks[messageType]).toContain(callback);
});

test('sendmessage test local – not top window', () => {
  Object.defineProperty(window.location, 'host', {
    writable: true,
    value: 'localhost:8080'
  });
  console.log = jest.fn();
  postMessage.sendMessage();
  expect(console.log).toHaveBeenCalledTimes(1);
});

test('setup post message', () => {
  var window = {};
  window.location = {};
  window.location.origin = 'http://www.alley.dev';
  window.addEventListener = jest.fn();
  postMessage.setupPostMessage(window);
  expect(window.addEventListener).toHaveBeenCalledTimes(1);
});
