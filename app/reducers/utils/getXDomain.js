/**
 * Find the min and max x values from a series within scatter/bubble chart data
 *
 * @param {Array} values Series values
 * @return {Array} [min, max]
 */
export function getSeriesMinMax(values) {
  return values.reduce((acc, { x }, idx) => {
    if (0 === idx) {
      return [x, x];
    }
    const newAcc = [...acc];
    if (x < newAcc[0]) {
      newAcc[0] = x;
    } else if (x > newAcc[1]) {
      newAcc[1] = x;
    }
    return newAcc;
  }, [0, 0]);
}

/**
 * Find the min and max x values from scatter/bubble chart data
 *
 * @param {Array} data Chart data
 * @return {Array} [min, max]
 */
export default function getXDomain(data) {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.reduce((acc, { values }, idx) => {
    const seriesMinMax = getSeriesMinMax(values);
    if (0 === idx) {
      return seriesMinMax;
    }
    const newAcc = [];
    newAcc.push((seriesMinMax[0] < acc[0]) ? seriesMinMax[0] : acc[0]);
    newAcc.push((seriesMinMax[1] > acc[1]) ? seriesMinMax[1] : acc[1]);
    return newAcc;
  }, [0, 0]);
}
