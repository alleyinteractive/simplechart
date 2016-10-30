import d3 from 'd3';

/**
 * Create formatting function from components
 * @param object formatData
 *    @param string prepend Any string to prepend
 *    @param string format D3 format https://github.com/d3/d3-format#locale_format
 *    @param number multiplier E.g. .001 to transform 1000 into 1
 *    @param string append  Any string to append
 * @return function Formatting function
 */
export default function createFormatter(formatData) {
  let formatter;
  try {
    formatter = (value) => [
      formatData.prepend,
      d3.format(formatData.format)(value * formatData.multiplier),
      formatData.append,
    ].join('');
  } catch (err) {
    // Default D3 formatting if formatData is misconfigured
    formatter = (value) => d3.format(',.2f')(value);
  }
  return formatter;
}
