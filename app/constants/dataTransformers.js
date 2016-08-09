import labelValue from '../utils/labelValueTransformer';
import series from '../utils/seriesTransformer';

export const dataTransformers = {
  pieChart: labelValue,
  discreteBarChart: labelValue,
  lineChart: series,
  // Removing until bugs are fixed
  // stackedAreaChart: series,
};
