import compose from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import { parse as parseDate } from '../parseDate';

export default function transform(data, fields, dateFormat) {
  // groups,x,y or groups,x,y,z
  const isInvalidNumFields = -1 === [3, 4].indexOf(fields.length);
  if (isInvalidNumFields) {
    return false;
  }

  const [groupingLabel, xAxisLabel, yAxisLabel, sizeLabel] = fields;

  const createPoint = (row) => {
    const getSize = (size) => (size ? Math.round(size) / 100 : 1);
    const isDateAxis = dateFormat.enabled && dateFormat.validated;

    const xValue = isDateAxis ?
      parseDate(row[xAxisLabel]) :
      parseFloat(row[xAxisLabel]);

    return {
      x: xValue,
      y: parseFloat(row[yAxisLabel]),
      size: getSize(row[sizeLabel]) || 1,
    };
  };

  const createSeries = (dataGroup) => ({
    key: dataGroup[0][groupingLabel],
    values: dataGroup.map(createPoint),
  });

  const validateSeries = (series) => {
    const isInvalidPoint = ({ x, y }) => !x || isNaN(x) || !y || isNaN(y);
    const isInvalidSeries = (aSeries) => aSeries.values.find(isInvalidPoint);

    return series.find(isInvalidSeries) ? false : series;
  };

  const getSeries = compose(
    groupBy(groupingLabel),
    map(createSeries),
    validateSeries
  );

  return getSeries(data);
}
