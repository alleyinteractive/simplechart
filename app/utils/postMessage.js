/**
 * Utils for sending and receiving postMessage with parent window
 */

/**
 * Check for local dev server
 */
function isLocalDev() {
  return 'localhost:8080' === window.location.host;
}

/**
 * Check for being a child iframe.
 * Three cases: top window (true), same-origin iframe (false), cross-origin iframe (false)
 */
function isTopLevelWindow() {
  try {
    // presence of window.frameElement indicates a same-origin iframe
    if (window.frameElement) {
      return false;
    }
    // this will be true or throw an error
    return window.location.href === window.parent.location.href;
  } catch (err) {
    // will catch SecurityError if we attempted to access a cross-origin iframe
    return 'SecurityError' !== err.name;
  }
}

/**
 * store for message handle callbacks
 */
const callbacks = {};

/**
 * Setup postMessage receive callbacks
 */
export function setupPostMessage() {
  function messageHandler(evt) {
    // validate same-origin except if local dev server
    if (evt.origin !== window.location.origin &&
      !isLocalDev()) {
      throw new Error(`Illegal postMessage from ${evt.origin}`);
    }

    if (!evt.data.messageType || !callbacks[evt.data.messageType]) {
      return;
    }

    // loop through callbacks for message type
    callbacks[evt.data.messageType].forEach((callback) =>
      callback(evt)
    );
  }

  // set up listener
  window.addEventListener('message', (evt) =>
    messageHandler(evt)
  );
}

/**
 * Listen for a postMessage then do something with the event
 *
 * @param {String} messageType Message type checked against evt.data.messageType
 * @param {Function} callback Callback function receiving the message event
 * @return none
 */
export function receiveMessage(messageType, callback) {
  if (!callbacks[messageType]) {
    callbacks[messageType] = [];
  }
  callbacks[messageType].push(callback);
}

/**
 * Send message to parent window
 *
 * @param {String} messageType Parent will check against evt.data.messageType
 * @param {*} data Optional data to accompany message as evt.data.data
 * @return none
 */
export function sendMessage(messageType, data = null) {
  if (isTopLevelWindow()) {
    if (!isLocalDev()) {
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
    data: JSON.parse(JSON.stringify(data)), // handles functions in the data
  }, isLocalDev() ? '*' : window.location.origin);
}
