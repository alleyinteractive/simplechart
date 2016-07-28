import React from 'react';
import { connect } from 'react-redux';
import BaseChart from '../NVD3BaseChart';

class StackedAreaChart extends BaseChart {
  constructor() {
    super();
    this.defaultOptions = {
      type: 'stackedAreaChart',
      height: 400,
      useInteractiveGuidline: true,
      showLegend: true,
    };
  }
}

StackedAreaChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

export default connect()(StackedAreaChart);
