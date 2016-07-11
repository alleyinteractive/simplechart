/**
 * Utils for sending and receiving postMessage with parent window
 */

/**
 * Check for local dev server
 */
function _isLocalDev() {
  return window.location.host === 'localhost:8080';
}

/**
 * Check for being a child iframe
 */
function _isTopLevelWindow() {
  try {
    // window.frameElement is null in top level window
    return window.frameElement === null;
  } catch (err) {
    // if we just tried to access a cross-origin parent window,
    // catch the resulting error and assume we are an iframe
    return false;
  }
}

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
      && !_isLocalDev()) {
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

/**
 * Send message to parent window
 *
 * @param string messageType Parent will check against evt.data.messageType
 * @param any data Optional data to accompany message as evt.data.data
 * @return none
 */
export function sendMessage(messageType, data) {
  if (_isTopLevelWindow()) {
    if (!_isLocalDev()) {
      throw new Error(
        `No parent window available for postMessage type ${messageType}`);
    } else {
      console.log(`mock sendMessage: ${messageType}`, data); // eslint-disable-line no-console
    }
    return;
  }

  // Send data to '*' if local dev, otherwise only allow same origin
  window.parent.postMessage({
    messageType,
    data,
  }, _isLocalDev() ? '*' : window.location.origin);
}
