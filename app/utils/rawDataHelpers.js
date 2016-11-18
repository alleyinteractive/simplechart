import Papa from '../vendor/papaparse.4.1.2';
import { dataTransformers } from '../constants/dataTransformers';

/**
 * Parse data and check for errors
 */
export function parseRawData(rawData) {
  const parsed = Papa.parse(rawData, {
    header: true,
    skipEmptyLines: true,
  });

  const errors = [];
  if (parsed.errors.length) {
    parsed.errors.forEach((error) =>
      errors.push(
        0 <= error.row ? `${error.message} at row ${error.row}` : error.message
      )
    );
  }
  const fields = parsed.meta.fields || [];
  return [parsed.data, fields, errors];
}

/**
 * setup transformed for dataFormats
 */
export function transformParsedData(parsedData, parsedFields) {
  const transformed = {};
  function setTransformed(type) {
    transformed[type] = dataTransformers[type](parsedData, parsedFields);
  }
  Object.keys(dataTransformers).forEach((type) =>
    setTransformed(type)
  );
  return transformed;
}
