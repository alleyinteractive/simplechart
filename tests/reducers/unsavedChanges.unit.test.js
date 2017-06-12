import { RECEIVE_RAW_DATA, UNSAVED_CHANGES } from '../../app/constants';
import reduce from '../../app/reducers/unsavedChangesReducer';

const initialState = { unsavedChanges: false };

test('sets state', () => {
  const action = { type: UNSAVED_CHANGES, data: true };
  expect(reduce(initialState, action).unsavedChanges).toBe(true);
});

test('sets state to true for chart modifying actions', () => {
  const action = { type: RECEIVE_RAW_DATA, src: '' };
  expect(reduce(initialState, action).unsavedChanges).toBe(true);
});

test('filters bootstrap actions', () => {
  const action = { type: RECEIVE_RAW_DATA, src: 'bootstrap.new' };
  expect(reduce(initialState, action).unsavedChanges).toBe(false);
});
