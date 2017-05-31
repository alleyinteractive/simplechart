import { max } from 'd3';

export default function getSumDomain(format, data) {
  const mapSeriesToY = (datum) => datum.values.map((series) => series.y);
  const addMaxY = (acc, datum) => acc + max(mapSeriesToY(datum));
  const yValuesSummed = data.reduce(addMaxY, 0);
  return [0, yValuesSummed];
}
