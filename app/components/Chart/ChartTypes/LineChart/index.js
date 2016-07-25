import React from 'react';
import { connect } from 'react-redux';
import BaseChart from '../NVD3BaseChart';

class LineChart extends BaseChart {

  constructor() {
    super();
    this.defaultOptions = {
      type: 'lineChart',
      height: 400,
      useInteractiveGuidline: true,
      showLegend: true,
    };
  }
}

LineChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

export default connect()(LineChart);
