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
 * Check for being a child iframe.
 * Three cases: top window (true), same-origin iframe (false), cross-origin iframe (false)
 */
function _isTopLevelWindow() {
  try {
    // presence of window.frameElement indicates a same-origin iframe
    if (window.frameElement) {
      return false;
    }
    // if we make it this far, this will throw an error
    return !window.parent.location.hostname;
  } catch (err) {
    // will catch SecurityError if cross-origin iframe
    // or TypeError if top level window
    return err.name !== 'SecurityError';
  }
}

/**
 * store for message handle callbacks
 */
const _callbacks = {};

/**
 * Setup postMessage receive callbacks
 */
export function setupPostMessage() {
  function _messageHandler(evt) {
    // validate same-origin except if local dev server
    if (evt.origin !== window.location.origin
      && !_isLocalDev()) {
      throw new Error(`Illegal postMessage from ${evt.origin}`);
    }

    if (!evt.data.messageType || !_callbacks[evt.data.messageType]) {
      return;
    }

    // loop through callbacks for message type
    _callbacks[evt.data.messageType].forEach((callback) =>
      callback(evt)
    );
  }

  // set up listener
  window.addEventListener('message', (evt) =>
    _messageHandler(evt)
  );
}

/**
 * Listen for a postMessage then do something with the event
 *
 * @param string messageType Message type checked against evt.data.messageType
 * @param function callback Callback function receiving the message event
 * @return none
 */
export function receiveMessage(messageType, callback) {
  if (!_callbacks[messageType]) {
    _callbacks[messageType] = [];
  }
  _callbacks[messageType].push(callback);
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
