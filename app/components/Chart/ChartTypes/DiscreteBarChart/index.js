import React from 'react';
import { connect } from 'react-redux';
import BaseChart from '../NVD3BaseChart';

class DiscreteBarChart extends BaseChart {

  constructor() {
    super();
    this.defaultOptions = {
      type: 'discreteBarChart',
      height: 400,
    };
  }

  _dataTransformer(data) {
    return [{
      key: '',
      values: data,
    }];
  }
}

DiscreteBarChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
};

// Redux connection

export default connect()(DiscreteBarChart);
