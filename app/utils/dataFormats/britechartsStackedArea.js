import { parse as parseDate } from '../parseDate';

export default function transform(data, fields, dateFormat) {
  if (3 > fields.length) {
    return false;
  }

  const [dateLabel, ...seriesLabels] = fields;

  const getDate = (value) => {
    if (dateFormat.enabled && dateFormat.validated) {
      return parseDate(value, dateFormat.formatString);
    }

    return value;
  };

  const createPoint = (name, row) => ({
    date: getDate(row[dateLabel]),
    name,
    value: parseFloat(row[name]),
  });

  const reduceData = (acc, row) => {
    const points = seriesLabels.map((name) => createPoint(name, row));
    return acc.concat(points);
  };

  const validatePoint = (point) =>
    !(isNaN(point.value) || 'Date format error' === point.date);

  const series = data.reduce(reduceData, []);
  return series.every(validatePoint) ? series : false;
}
