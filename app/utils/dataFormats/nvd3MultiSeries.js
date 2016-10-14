/**
 * Transform multi-column CSV into data series
 * Used for lineChart, etc
 *
 * @param obj data Parsed data input
 * @param array fields List of fields/columns in order
 * @return obj|bool Object of chart-ready data or false if data can't be used for this chart type
 */
export default function transformer(data, fields) {
  // e.g. "year"
  // we'll use this later when we set up the axes
  const xAxisLabel = fields[0];

  function getDataPoint(row, field) {
    const xValue = parseFloat(row[xAxisLabel]);
    if (isNaN(xValue)) {
      return false;
    }

    return {
      x: xValue,
      y: parseFloat(row[field]),
    };
  }

  function createDataSeries(field) {
    const series = {
      key: field,
      values: [],
    };
    data.forEach((row) =>
      series.values.push(getDataPoint(row, field, xAxisLabel))
    );

    if (series.values.indexOf(false) > -1) {
      return false;
    }
    return series;
  }

  // create array of keys and values for each field
  const dataSeries = fields.map((field) =>
    createDataSeries(field)
  );

  // first item in array is the x-axis column
  dataSeries.shift();

  // return false if any data series didn't validate
  // e.g. if the first column didn't contain numbers
  // which would prevent us from doing a chart with an x-axis
  if (dataSeries.indexOf(false) > -1) {
    return false;
  }
  return dataSeries;
}
