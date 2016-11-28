/**
 * Utils for sending and receiving postMessage with parent window
 */

/**
 * Check for local dev server
 */
function _isLocalDev() {
  return 'localhost:8080' === window.location.host;
}

/**
 * Check for being a child iframe.
 * Three cases: top window (true), same-origin iframe (false), cross-origin iframe (false)
 */
function _isTopLevelWindow(useWindow = window) {
  try {
    // presence of window.frameElement indicates a same-origin iframe
    if (useWindow.frameElement) {
      return false;
    }
    // this will be true or throw an error
    return useWindow.location.href === window.parent.location.href;
  } catch (err) {
    // will catch SecurityError if we attempted to access a cross-origin iframe
    return 'SecurityError' !== err.name;
  }
}

/**
 * store for message handle callbacks
 */
export const _callbacks = {};

/**
 * Setup postMessage receive callbacks
 */
export function setupPostMessage(useWindow = window) {
  function _messageHandler(evt) {
    // validate same-origin except if local dev server
    if (evt.origin !== useWindow.location.origin &&
      !_isLocalDev()) {
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
  useWindow.addEventListener('message', (evt) =>
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
export function sendMessage(messageType,
  data = null, useWindow = window) {
  if (_isTopLevelWindow(useWindow)) {
    if (!_isLocalDev()) {
      throw new Error(
        `No parent window available for postMessage type ${messageType}`);
    } else {
      console.log(`mock sendMessage: ${messageType}`, data); // eslint-disable-line no-console
    }
    return;
  }

  // Send data to '*' if local dev, otherwise only allow same origin
  useWindow.parent.postMessage({
    messageType,
    data: JSON.parse(JSON.stringify(data)), // handles functions in the data
  }, _isLocalDev() ? '*' : window.location.origin);
}
