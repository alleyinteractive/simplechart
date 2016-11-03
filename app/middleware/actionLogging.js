/* eslint-disable no-console */
import enableActionLogging from '../constants/enableActionLogging';
import * as actions from '../constants';
import { actionsMap } from '../constants/actionsStateKeysMap';
import diff from 'deep-diff';

function _getStringChange(oldVal, newVal) {
  if (oldVal === newVal) {
    return 'No change';
  } else if (!oldVal.length && newVal.length) {
    return 'Added';
  } else if (oldVal.length && !newVal.length) {
    return 'Removed';
  }
  return 'Updated';
}

function _getBoolChange(oldVal, newVal) {
  if (oldVal && newVal) {
    return 'true -> true';
  } else if (!oldVal && !newVal) {
    return 'false -> false';
  } else if (oldVal) {
    return 'true -> false';
  }
  return 'false -> true';
}

function _getNumberChange(oldVal, newVal) {
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

function _getChangeKind(changeCode) {
  switch (changeCode) {
    case 'N':
      return 'Addition';

    case 'D':
      return 'Deletion';

    case 'E':
      return 'Update';

    case 'A':
      return 'Array change';

    default:
      return 'Unknown change';
  }
}

function _getDiff(oldVal, newVal) {
  const calcDiff = diff(oldVal, newVal);
  return !calcDiff || !calcDiff.length ? 'No changes' :
    calcDiff.map((change) => {
      let kind = _getChangeKind(change.kind);
      let location;

      // If not an array change
      if ('A' !== change.kind) {
        location = change.path.join('.');
      } else {
        // If an array change
        kind = _getChangeKind(change.item.kind);
        location = `index ${change.index}`;
      }

      return `${kind} at ${location}`;
    }).join("\n"); // eslint-disable-line quotes
}

/**
 * compare keys that changed in received data vs store
 *
 * @param obj action Received type and data
 * @param func getState
 * @return obj For each key, say if created, deleted, or updated
 */
function _getChanges(action, getState) {
  if (!actionsMap[action.type]) {
    return {};
  }

  // e.g. if action.type is RECEIVE_CHART_DATA, we want getState().chartData
  if (!getState().hasOwnProperty(actionsMap[action.type])) {
    return { dataType: 'Unknown', changeLog: 'Unknown' };
  }

  const stateVal = getState()[actionsMap[action.type]];
  const changes = {};

  switch (true) {
    case 'boolean' === typeof stateVal:
      changes.dataType = 'boolean';
      changes.changeLog = _getBoolChange(stateVal, action.data);
      break;

    case 'string' === typeof stateVal:
      changes.dataType = 'string';
      changes.changeLog = _getStringChange(stateVal, action.data);
      break;

    case 'number' === typeof stateVal:
      changes.dataType = 'number';
      changes.changeLog = _getNumberChange(stateVal, action.data);
      break;

    case 'function' === typeof stateVal.concat:
      changes.dataType = 'array';
      changes.changeLog = _getDiff(stateVal, action.data);
      break;

    default:
      changes.dataType = 'object';
      changes.changeLog = _getDiff(stateVal, action.data);
      break;
  }
  return changes;
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
    if (enableActionLogging && -1 === skipLogging.indexOf(action.type)) {
      const changes = _getChanges(action, getState);
      console.log(`Received ${action.type} with data type ${changes.dataType}:`);
      console.log(changes.changeLog);
      console.log('--------------');
    }
    return dispatch(action);
  };
}
