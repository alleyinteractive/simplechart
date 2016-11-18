import fs from 'fs';
import path from 'path';
import update from 'react-addons-update';
import {
  getChartTypeDefaultOpts,
  getChartTypeObject,
} from '../app/utils/chartTypeUtils';
import { parseRawData, transformParsedData } from '../app/utils/rawDataHelpers';
import Baby from 'babyparse';
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
      data: JSON.stringify(_getData(chartType)),
      options: JSON.stringify(_getOptions(chartType)),
      metadata: JSON.stringify(_getMockMetadata(chartType)),
    },
  };
}

/**
 * Get options for chart type
 */
function _getOptions(chartType) {
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
function _getData(chartType) {
  const dataFormat = getChartTypeObject(chartType).config.dataFormat;
  const rawData = _getRawData(
    'nvd3SingleSeries' === dataFormat ? 'singleSeries.csv' : 'countriesByYear.csv');
  const parserResult = parseRawData(Baby, rawData);
  return transformParsedData(parserResult[0], parserResult[1])[dataFormat];
}

/**
 * Get contents of sample CSV data
 */
function _getRawData(samplename) {
  const dataPath = path.join(__dirname, '../app/constants/sampleData', samplename);
  return fs.readFileSync(dataPath, 'utf8');
}

function _getMockMetadata(chartType) {
  return mockMetadata[chartType];
}
