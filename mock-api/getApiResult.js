import fs from 'fs';
import path from 'path';
import {
  getChartTypeDefaultOpts,
  getChartTypeObject,
} from '../app/utils/chartTypeUtils';
import { parseRawData, transformParsedData } from '../app/utils/rawDataHelpers';
import Baby from 'babyparse';
import mockMetadata from './mockMetadata';

/**
 * Create mock API response
 */
export default function getApiResult(chartType) {
  return {
    data: _getData(chartType),
    options: _getOptions(chartType),
    metadata: _getMockMetadata(chartType),
  };
}

/**
 * Get options for chart type
 */
function _getOptions(chartType) {
  return getChartTypeDefaultOpts(chartType);
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
