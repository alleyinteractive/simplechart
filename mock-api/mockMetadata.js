const titles = {
  pieChart: 'Sample Pie Chart',
  discreteBarChart: 'Sample Bar Chart',
  lineChart: 'Sample Line Chart',
};

function chartTypeMetadata(type) {
  return {
    title: titles[type],
    subtitle: `Subtitle for ${titles[type]}`,
    caption: `Caption for ${titles[type]}`,
    source: `Data source for ${titles[type]}`,
  };
}

export default {
  pieChart: chartTypeMetadata('pieChart'),
  discreteBarChart: chartTypeMetadata('discreteBarChart'),
  lineChart: chartTypeMetadata('lineChart'),
};
