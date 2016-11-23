const titles = {
  pieChart: 'Sample Pie Chart',
  discreteBarChart: 'Sample Bar Chart',
  lineChart: 'Sample Line Chart',
};

function _chartTypeMetadata(type) {
  return {
    title: titles[type],
    caption: `Caption for ${titles[type]}`,
    source: `Data source for ${titles[type]}`,
  };
}

export default {
  pieChart: _chartTypeMetadata('pieChart'),
  discreteBarChart: _chartTypeMetadata('discreteBarChart'),
  lineChart: _chartTypeMetadata('lineChart'),
};
