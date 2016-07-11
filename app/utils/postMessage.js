/**
 * Utils for sending and receiving postMessage with parent window
 */

/**
 * Listen for a postMessage then do something with the event
 *
 * @param string messageType Message type checked against evt.data.messageType
 * @param function callback Callback function receiving the event
 * @return none
 */
export function receiveMessage(messageType, callback) {
  function _handler(evt) {
      // validate same-origin except if local dev server
    if (evt.origin !== window.location.origin
      && window.location.host !== 'localhost:8080') {
      throw new Error(`Illegal postMessage from ${evt.origin}`);
    }

    // validate messageType
    if (!evt.data.messageType ||
      evt.data.messageType !== messageType) {
      return;
    }

    // call the callback
    callback(evt);
  }
  // set up listener
  window.addEventListener('message', (evt) =>
    _handler(evt)
  );
}
