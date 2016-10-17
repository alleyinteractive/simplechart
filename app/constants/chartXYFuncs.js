/**
 * Default functions for chart.options.x and chart.options.y in NVD3
 */
export const multiXY = {
  x: (point) => point.x,
  y: (point) => point.y,
};

export const singleXY = {
  x: (point) => point.label,
  y: (point) => point.value,
};

export const defaultTickFormat = (point) => point;
