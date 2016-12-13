/* global describe test expect jest */
/* eslint no-undef: "error" */

import * as rawDataHelpers from '../../app/utils/rawDataHelpers.js';
import Papa from '../../app/vendor/papaparse.4.1.2';
import Baby from 'babyparse';

describe('rawDataHelpers.parseRawData', () => {
  const rawData = 'Year,Make,Model\r\n1997,Ford,E350\r\n2000,Mercury,Cougar';
  const parsedData = [{ Make: 'Ford', Model: 'E350', Year: '1997' }, { Make: 'Mercury', Model: 'Cougar', Year: '2000' }];
  const fields = ['Year', 'Make', 'Model'];
  const RawDataBad = '"This, Is going, "to work\r\n1,2,3';
  const rawDataSingle = 'Year,Data\r\n2014,20\r\n2015,21\r\n2016,23\r\n2017,29';
  const parsedDataSingle = [{ Year: '2014', Data: '20' }, { Year: '2015', Data: '21' }, { Year: '2016', Data: '23' }, { Year: '2017', Data: '29' }];
  const fieldsSingle = ['Year', 'Data'];

  test('papa', () => {
    const parsed = rawDataHelpers.parseRawData(Papa, rawData);
    expect(parsed[0]).toEqual(parsedData);
    expect(parsed[1]).toEqual(fields);
    expect(parsed[2]).toEqual([]);
  });
  test('papa single', () => {
    const parsedSingle = rawDataHelpers.parseRawData(Papa, rawDataSingle);
    expect(parsedSingle[0]).toEqual(parsedDataSingle);
    expect(parsedSingle[1]).toEqual(fieldsSingle);
    expect(parsedSingle[2]).toEqual([]);
  });
  test('papa bad', () => {
    const parsed = rawDataHelpers.parseRawData(Papa, RawDataBad);
    expect(parsed[2][0]).toEqual('Quoted field unterminated at row 0');
  });
  test('baby', () => {
    const parsed = rawDataHelpers.parseRawData(Baby, rawData);
    expect(parsed[0]).toEqual(parsedData);
    expect(parsed[1]).toEqual(fields);
    expect(parsed[2]).toEqual([]);
  });
  test('baby single', () => {
    const parsedSingle = rawDataHelpers.parseRawData(Baby, rawDataSingle);
    expect(parsedSingle[0]).toEqual(parsedDataSingle);
    expect(parsedSingle[1]).toEqual(fieldsSingle);
    expect(parsedSingle[2]).toEqual([]);
  });
  test('baby bad', () => {
    const parsed = rawDataHelpers.parseRawData(Baby, RawDataBad);
    expect(parsed[2][0]).toEqual('Quoted field unterminated at row 0');
  });
});

describe('rawDataHelpers.transformParsedData', () => {
  const parsedData = [{ Make: 'Ford', Model: 'E350', Year: '1997' }, { Make: 'Mercury', Model: 'Cougar', Year: '2000' }];
  const fields = ['Year', 'Make', 'Model'];
  const parsedDataSingle = [{ Year: '2014', Data: '20' }, { Year: '2015', Data: '21' }, { Year: '2016', Data: '23' }, { Year: '2017', Data: '29' }];
  const fieldsSingle = ['Year', 'Data'];
  test('basic transformParsedData multi series', () => {
    const transformedData = rawDataHelpers.transformParsedData(parsedData, fields); // eslint-disable-line max-len
    expect(transformedData).toBeDefined();
    expect(transformedData.nvd3SingleSeries).toBe(false);
    expect(transformedData.nvd3MultiSeries).toBeTruthy();
    expect(transformedData.nvd3MultiSeries[0].key).toEqual('Make');
    expect(transformedData.nvd3MultiSeries[1].key).toEqual('Model');
  });
  test('basic transformParsedData single series', () => {
    const transformedData = rawDataHelpers.transformParsedData(parsedDataSingle, fieldsSingle); // eslint-disable-line max-len
    expect(transformedData).toBeDefined();
    expect(transformedData.nvd3SingleSeries).toBeTruthy();
  });
});
