import d3 from 'd3';

/**
 * Create formatting function from components
 *
 * @param string prepend Any string to prepend
 * @param string format D3 format https://github.com/d3/d3-format#locale_format
 * @param number multiplier E.g. .001 to transform 1000 into 1
 * @param string append  Any string to append
 * @return function Formatting function
 */
export default function(prepend, format, multiplier, append) {
  return (d) => `${prepend}${d3.format(format)(d * multiplier)}${append}`;
}
