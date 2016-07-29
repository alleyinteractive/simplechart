/**
 * Default functions for chart.options.x and chart.options.y in NVD3
 */
export const multiXY = {
  x: (d) => d.x,
  y: (d) => d.y,
};

export const singleXY = {
  x: (d) => d.label,
  y: (d) => d.value,
};

export const defaultTickFormat = (d) => d;
