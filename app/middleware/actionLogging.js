/* eslint-disable no-console */
import diff from 'deep-diff';
import enableActionLogging from '../constants/enableActionLogging';
import * as actions from '../constants';
import actionsMap from '../constants/actionsStateKeysMap';
import { ownsProperties } from '../utils/misc';

function getStringChange(oldVal, newVal) {
  if (oldVal === newVal) {
    return 'No change';
  } else if (!oldVal.length && newVal.length) {
    return 'Added';
  } else if (oldVal.length && !newVal.length) {
    return 'Removed';
  }
  return 'Updated';
}

function getBoolChange(oldVal, newVal) {
  if (oldVal && newVal) {
    return 'true -> true';
  } else if (!oldVal && !newVal) {
    return 'false -> false';
  } else if (oldVal) {
    return 'true -> false';
  }
  return 'false -> true';
}

function getNumberChange(oldVal, newVal) {
  let dir;
  if (oldVal === newVal) {
    return 'No change';
  } else if (oldVal < newVal) {
    dir = 'Increased';
  } else {
    dir = 'Decreased';
  }
  return `${dir} ${oldVal} -> ${newVal}`;
}

function getChangeKind(changeCode) {
  switch (changeCode) {
    case 'N':
      return 'Addition';

    case 'D':
      return 'Deletion or key not updated';

    case 'E':
      return 'Update';

    case 'A':
      return 'Array change';

    default:
      return 'Unknown change';
  }
}

/**
 * Create change log for array and objects
 * @param {(Object|Array)} oldVal
 * @param {(Object|Array)} newVal
 * @param {String} actionType received
 * @return {String} Change log
 */
function getDiff(oldVal, newVal, actionType) {
  const calcDiff = diff(oldVal, newVal);
  if (!calcDiff || !calcDiff.length) {
    return 'No changes';
  }

  return calcDiff.reduce((log, change) => {
    let kind = getChangeKind(change.kind);
    let location;

    // Special case to skip RECEIVE_CHART_OPTIONS* since it merges in new fields
    if ('D' === change.kind && actions.RECEIVE_CHART_OPTIONS === actionType) {
      return log;
    }

    // If not an array change
    if ('A' !== change.kind) {
      location = change.path.join('.');
    } else {
      // If an array change
      kind = getChangeKind(change.item.kind);
      location = `index ${change.index}`;
    }

    return `${log}${kind} at ${location}\n`;
  }, '').trim();
}

/**
 * Compare keys that changed in received data vs store
 *
 * @param {Object} action Received type and data
 * @param {Function} getState
 * @return {Object} Return type of data received and change log
 */
function getChanges(action, getState) {
  if (!actionsMap[action.type]) {
    return {};
  }

  // e.g. if action.type is RECEIVE_CHART_DATA, we want getState().chartData
  if (!ownsProperties(getState(), [actionsMap[action.type]])) {
    return { dataType: 'Unknown', changeLog: 'Unknown' };
  }

  const stateVal = getState()[actionsMap[action.type]];
  const changes = {};

  switch (true) {
    case 'boolean' === typeof stateVal:
      changes.dataType = 'boolean';
      changes.changeLog = getBoolChange(stateVal, action.data);
      break;

    case 'string' === typeof stateVal:
      changes.dataType = 'string';
      changes.changeLog = getStringChange(stateVal, action.data);
      break;

    case 'number' === typeof stateVal:
      changes.dataType = 'number';
      changes.changeLog = getNumberChange(stateVal, action.data);
      break;

    case 'function' === typeof stateVal.concat:
      changes.dataType = 'array';
      changes.changeLog = getDiff(stateVal, action.data, action.type);
      break;

    default:
      changes.dataType = 'object';
      changes.changeLog = getDiff(stateVal, action.data, action.type);
      break;
  }
  return changes;
}

function isEnabled() {
  if (!enableActionLogging.enabled) {
    return false;
  }
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? // eslint-disable-line no-underscore-dangle
    enableActionLogging.enableIfReduxDevTools : true;
}

/**
 * Log actions received. This should be the last middleware in the chain
 * in order to catch dispatches triggered by other middleware.
 * Our user-facing error messages are pretty easy to track down so we don't
 * need to log them.
 */
export default function middleware({ getState }) {
  return (dispatch) => (action) => {
    const skipLogging = [
      actions.CLEAR_ERROR,
      actions.RECEIVE_ERROR,
      actions.UPDATE_CURRENT_STEP,
      actions.UNSAVED_CHANGES,
    ];
    if (isEnabled() && -1 === skipLogging.indexOf(action.type)) {
      const changes = getChanges(action, getState);
      console.log(`Received ${action.type} with data type ${changes.dataType}:`);
      console.log(changes.changeLog);
      console.log('--------------');
    }
    return dispatch(action);
  };
}
