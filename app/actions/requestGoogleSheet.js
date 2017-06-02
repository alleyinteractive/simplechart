import fetch from 'isomorphic-fetch';
import actionTrigger from './index';
import { RECEIVE_ERROR, RECEIVE_RAW_DATA, REQUEST_GOOGLE_SHEET } from '../constants';

/**
 * @param {String} sheetId  A google sheets id, or URL containing an id
 */
export default function requestGoogleSheet(sheetId) {
  return (dispatch, getState) => {
    const { googleApiKey } = getState();

    if (!googleApiKey) {
      dispatch(actionTrigger(RECEIVE_ERROR, 'e009'));
      return;
    }

    dispatch(actionTrigger(REQUEST_GOOGLE_SHEET));

    const url = buildUrl(parseId(sheetId), googleApiKey);
    const options = {
      headers: {
        Accept: 'application/json',
      },
    };

    fetch(url, options)
      .then((response) => {
        if (200 === parseInt(response.status, 10)) {
          return response.json();
        }

        throw new Error('Bad Google Sheets API response');
      })
      .then(toCSV)
      .then((rawData) => dispatch(actionTrigger(RECEIVE_RAW_DATA, rawData)))
      .catch(() => dispatch(actionTrigger(RECEIVE_ERROR, 'e010')));
  };
}

/**
 * @param {String} sheetId
 * @param {String} key
 * @param {String} range
 * @return {String}
 */
export function buildUrl(sheetId, key, range = 'A1:Z1000') {
  return `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${key}`;
}

/**
 * @param {String} input
 * @returns {String}
 */
export function parseId(input) {
  const urlMatch = input.match(/\/spreadsheets\/d\/(.+)\//);
  return urlMatch ? urlMatch[1] : input;
}

/**
 * @param {Array[]} data
 * @returns {String}
 */
export function toCSV(data) {
  return data.reduce((acc, row) => `${acc + row.join(',')}\n`, '');
}
