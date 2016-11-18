import {
  getChartTypeDefaultOpts,
  getChartTypeObject,
} from '../app/utils/chartTypeUtils';
import { sampleData } from '../app/constants/sampleData';
import { parseRawData, transformParsedData } from '../app/utils/rawDataHelpers';

/**
 * Create mock API response
 */
export default function getApiResult(chartType) {
  return {
    data: _getData(chartType),
    options: _getOptions(chartType),
    // metadata: _getMockMetaData(chartType),
  };
}

/**
 * Get options for chart type
 */
function _getOptions(chartType) {
  return getChartTypeDefaultOpts(chartType);
}

function _getData(chartType) {
  const dataFormat = getChartTypeObject(chartType).dataFormat;
  const rawData = 'nvd3SingleSeries' === dataFormat ? sampleData[0].data : sampleData[1].data;
  const parserResult = parseRawData(rawData);
  return transformParsedData(parserResult[0], parserResult[1])[dataFormat];
}