import actionTrigger from '../../app/actions';
import requestGoogleSheet from '../../app/actions/requestGoogleSheet';
import {
  RECEIVE_ERROR,
  RECEIVE_RAW_DATA,
  REQUEST_GOOGLE_SHEET,
} from '../../app/constants';

jest.mock('isomorphic-fetch');

let fetch;
let dispatch;
let getState;

beforeEach(() => {
  jest.resetAllMocks();
  fetch = require('isomorphic-fetch');
  dispatch = jest.fn();
  getState = jest.fn();
});

const mockSheetId = 'abc123';
const mockApiKey = 'fooBarBaz456';

test('dispatches error if no api key in state', () => {
  getState.mockReturnValue({});

  const thunk = requestGoogleSheet(mockSheetId);
  thunk(dispatch, getState).then(() => {
    expect(dispatch)
      .toHaveBeenCalledWith(actionTrigger(RECEIVE_ERROR, 'e009'));
  });
});

test('handles request to fetch sheet data', () => {
  const mockCSV = `Group,Count\nGroup A,3\n`;
  const mockResponse = {
    status: '200',
    json() {
      return {
        values: [
          ['Group', 'Count'],
          ['Group A', '3'],
        ],
      };
    },
  };

  getState.mockReturnValue({ googleApiKey: mockApiKey });

  fetch.mockImplementation(() => Promise.resolve(mockResponse));

  const thunk = requestGoogleSheet(mockSheetId);
  thunk(dispatch, getState).then(() => {
    const fetchUrlArg = fetch.mock.calls[0][0];
    expect(fetchUrlArg)
      .toBe(`https://sheets.googleapis.com/v4/spreadsheets/${mockSheetId}/values/A1:Z1000?key=${mockApiKey}`);

    expect(dispatch)
      .toHaveBeenCalledWith(actionTrigger(RECEIVE_RAW_DATA, mockCSV));

    expect(dispatch)
      .toHaveBeenCalledWith(actionTrigger(REQUEST_GOOGLE_SHEET));
  });
});

test('dispatches error if sheet request fails', () => {
  getState.mockReturnValue({ googleApiKey: mockApiKey });

  fetch.mockImplementation(() => Promise.resolve({ status: '500' }));

  const thunk = requestGoogleSheet(mockSheetId);
  thunk(dispatch, getState).then(() => {
    expect(dispatch)
      .toHaveBeenCalledWith(actionTrigger(RECEIVE_ERROR, 'e010'));
  });
});
