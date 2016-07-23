import React from 'react';
import { connect } from 'react-redux';
import BaseChart from '../NVD3BaseChart';

class PieChart extends BaseChart {
  constructor() {
    super();
    this.defaultOptions = {
      type: 'pieChart',
      height: 400,
      x: (d) => d.label,
      y: (d) => d.value,
      showLegend: false,
      showLabels: false,
    };
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

export default connect()(PieChart);
