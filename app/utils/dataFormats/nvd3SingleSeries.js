/**
 * Transform 2-column parsed CSV data into label,value pairs
 * Used for pieChart, discreteBarChart, etc
 *
 * @param obj data Parsed data input
 * @param array fields List of fields/columns in order
 * @return obj|bool Object of chart-ready data or false if data can't be used for this chart type
 */
export default function transformer(data, fields) {
  // test number of columns/fields
  if (fields.length !== 2) {
    return false;
  }

  function rowTransformer(row) {
    const label = row[fields[0]];
    const value = parseFloat(row[fields[1]]);
    if (!label || isNaN(value)) {
      return false;
    }
    return { label, value };
  }

  const transformed = data.map((row) =>
      rowTransformer(row)
  );

  if (transformed.indexOf(false) > -1) {
    return false;
  }
  return transformed;
}
