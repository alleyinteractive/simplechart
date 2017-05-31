import { RECEIVE_RAW_DATA, UNSAVED_CHANGES } from '../../app/constants';
import reduce from '../../app/reducers/unsavedChangesReducer';

test('sets state', () => {
  const action = { type: UNSAVED_CHANGES, data: true };
  expect(reduce(false, action)).toBe(true);
});

test('sets state to true for chart modifying actions', () => {
  const action = { type: RECEIVE_RAW_DATA, src: '' };
  expect(reduce(false, action)).toBe(true);
});

test('filters bootstrap actions', () => {
  const action = { type: RECEIVE_RAW_DATA, src: 'bootstrap.new' };
  expect(reduce(false, action)).toBe(false);
});
