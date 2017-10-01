import * as dateUtils from '../parseDate';
/**
 * Transform parsed CSV into data series for NVD3
 * Unlike nvd3MultiSeries, this does *NOT* require a numeric sequence
 * along the X axis.
 *
 * @param {Object} data Parsed data input
 * @param {Array} fields List of fields/columns in order
 * @param {String} dateFormat
 * @return {(Object|Boolean)}Object of chart-ready data or false if data can't be used for this chart type
 */
export default function transformer(data, fields, dateFormat) {
  // e.g. "year"
  // we'll use this later when we set up the axes
  const xAxisLabel = fields[0];

  function getDataPoint(row, field) {
    const xValue = (dateFormat.enabled && dateFormat.validated) ?
      dateUtils.parse(row[xAxisLabel], dateFormat.formatString) :
      row[xAxisLabel];

    return {
      x: xValue,
      y: parseFloat(row[field]),
    };
  }

  /**
   * Transform into individual data series
   *
   * @return {Object|Bool} key and value, or false if error
   */
  function createDataSeries(field) {
    let foundDuplicateLabel = false;
    const seriesXVals = [];
    const values = [];

    data.forEach((row) => {
      const point = getDataPoint(row, field, xAxisLabel);
      // Check if label has already been used
      if (-1 !== seriesXVals.indexOf(point.x)) {
        foundDuplicateLabel = true;
      }
      seriesXVals.push(point.x);
      values.push(point);
    });

    // Invalid data if duplicate label found
    if (foundDuplicateLabel) {
      return false;
    }

    return {
      key: field,
      values,
    };
  }

  // create array of keys and values for each field
  const dataSeries = fields.map((field) =>
    createDataSeries(field)
  );

  // first item in array is the x-axis column
  dataSeries.shift();

  // Requires more than one series
  if (-1 !== dataSeries.indexOf(false) || 1 === dataSeries.length) {
    return false;
  }

  return dataSeries;
}
