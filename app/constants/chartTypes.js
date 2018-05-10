/**
 * Chart types registry
 */
import pieChart from './chartTypeConfigs/pieChart';
import discreteBarChart from './chartTypeConfigs/discreteBarChart';
import lineChart from './chartTypeConfigs/lineChart';
import stackedAreaChart from './chartTypeConfigs/stackedAreaChart';
import scatterChart from './chartTypeConfigs/scatterChart';
import groupedBarChart from './chartTypeConfigs/groupedBarChart';
import stackedBarChart from './chartTypeConfigs/stackedBarChart';

export const selectableChartTypes = [
  pieChart,
  discreteBarChart,
  lineChart,
  stackedAreaChart,
  scatterChart,
  groupedBarChart,
  stackedBarChart,
];

export const defaultBreakpoint = {
  noMaxWidth: true,
  maxWidth: 350,
  height: 400,
};

export const defaultBreakpointsOpt = {
  active: 0,
  values: [defaultBreakpoint],
};

export const nvd3Defaults = {
  nvd3SingleSeries: {
    x: (point) => point.label,
    y: (point) => point.value,
  },
  nvd3MultiSeries: {
    x: (point) => point.x,
    y: (point) => point.y,
  },
  nvd3BarMultiSeries: {
    x: (point) => point.x,
    y: (point) => point.y,
  },
  nvd3ScatterMultiSeries: {
    x: (point) => point.x,
    y: (point) => point.y,
  },
};

// On chart type change, the chart options are replaced to clear out chart type
// specific options. These options are not coupled to a specific chart type,
// and should persist through chart type changes.
export const globalChartOptions = ['dateFormat', 'xAxis', 'yDomain', 'color', 'embedHeight'];
