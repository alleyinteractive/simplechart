import labelValue from '../utils/labelValueTransformer';
import series from '../utils/seriesTransformer';

export const dataTransformers = {
  pieChart: labelValue,
  discreteBarChart: labelValue,
  lineChart: series,
  stackedAreaChart: series,
};
