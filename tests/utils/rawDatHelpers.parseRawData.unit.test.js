const rawDataHelpers = require('../../app/utils/rawDataHelpers.js');
import Papa from '../../app/vendor/papaparse.4.1.2';
import Baby from 'babyparse';

describe('postMessage.parseRawdata', () => {

  let rawData = 'Year,Make,Model\r\n1997,Ford,E350\r\n2000,Mercury,Cougar';
  let parsedData = [{"Make": "Ford", "Model": "E350", "Year": "1997"}, {"Make": "Mercury", "Model": "Cougar", "Year": "2000"}];
  let fields = ['Year','Make','Model'];
  let RawDataBad = '"This, Is going, "to work\r\n1,2,3'

  test('papa', () => {
    let parsed = rawDataHelpers.parseRawData(Papa,rawData);
    expect(parsed[0]).toEqual(parsedData);
    expect(parsed[1]).toEqual(fields);
    expect(parsed[2]).toEqual([]);
  });

  test('papa bad', () => {
    let parsed = rawDataHelpers.parseRawData(Papa,RawDataBad);
    expect(parsed[2][0]).toEqual('Quoted field unterminated at row 0');
  });

  test('baby', () => {
    let parsed = rawDataHelpers.parseRawData(Baby,rawData);
    expect(parsed[0]).toEqual(parsedData);
    expect(parsed[1]).toEqual(fields);
    expect(parsed[2]).toEqual([]);
  });

  test('baby bad', () => {
    let parsed = rawDataHelpers.parseRawData(Baby,RawDataBad);
    expect(parsed[2][0]).toEqual('Quoted field unterminated at row 0');
  });

});
