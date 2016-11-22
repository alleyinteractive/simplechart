import { dataTransformers } from '../constants/dataTransformers';

/**
 * Parse data and check for errors
 *
 * @param obj parser Parser to use, i.e. Papaparse for client-side, Babyparse for server-side
 * @param string rawData Raw data to parse
 * @return array
 *   obj data Parsed data
 *   array field Array of fields from original data, in order
 *   obj errors Parsing errors
 */
export function parseRawData(parser, rawData) {
  const parsed = parser.parse(rawData, {
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
