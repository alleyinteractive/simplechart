const chartTypeUtils = require('../../app/utils/chartTypeUtils.js');
const pieChart = require('../../app/constants/chartTypeConfigs/pieChart');

let testType = 'pieChart';

describe('chartTypeUtils.getChartTypeObject', () => {

  test('gets chart type object for type', () => {
    expect(chartTypeUtils.getChartTypeObject(testType)).toEqual(pieChart);
  });

});

describe('chartTypeUtils.getChartTypeDefaultOpts', () => {

  test('gets chart type default options for type', () => {
    let pieChartDefaults = chartTypeUtils.getChartTypeDefaultOpts(testType);
    for ( var option in pieChart.defaultOpts ) {
      expect(pieChartDefaults[option]).toEqual(pieChart.defaultOpts[option]);
    }
    expect(pieChartDefaults.type).toEqual(testType);
    expect(pieChartDefaults.x).toBeInstanceOf(Function);
    expect(pieChartDefaults.y).toBeInstanceOf(Function);
  });

});
