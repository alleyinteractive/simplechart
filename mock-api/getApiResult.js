import fs from 'fs';
import path from 'path';
import update from 'immutability-helper';
import Baby from 'babyparse';
import {
  getChartTypeDefaultOpts,
  getChartTypeObject,
} from '../app/utils/chartTypeUtils';
import { parseRawData, transformParsedData } from '../app/utils/rawDataHelpers';
import mockMetadata from './mockMetadata';
import { defaultTickFormatSettings } from '../app/constants/defaultTickFormatSettings';
import { defaultBreakpointsOpt } from '../app/constants/chartTypes';

/**
 * Create mock API response
 */
export default function getApiResult(chartType) {
  return {
    success: true,
    data: {
      data: JSON.stringify(getData(chartType)),
      options: JSON.stringify(getOptions(chartType)),
      metadata: JSON.stringify(getMockMetadata(chartType)),
    },
  };
}

/**
 * Get options for chart type
 */
function getOptions(chartType) {
  let opts = getChartTypeDefaultOpts(chartType);
  opts = update(opts, {
    tickFormatSettings: { $set: defaultTickFormatSettings },
    breakpoints: { $set: defaultBreakpointsOpt },
  });
  return opts;
}

/**
 * Get transformed chart data object
 */
function getData(chartType) {
  const dataFormat = getChartTypeObject(chartType).config.dataFormat;
  const rawData = getRawData('nvd3SingleSeries' === dataFormat ?
    'singleSeries.csv' : 'countriesByYear.csv');
  const parserResult = parseRawData(Baby, rawData);
  return transformParsedData(parserResult[0], parserResult[1])[dataFormat];
}

/**
 * Get contents of sample CSV data
 */
function getRawData(samplename) {
  const dataPath = path.join(__dirname, '../app/constants/sampleData', samplename);
  return fs.readFileSync(dataPath, 'utf8');
}

function getMockMetadata(chartType) {
  return mockMetadata[chartType];
}
