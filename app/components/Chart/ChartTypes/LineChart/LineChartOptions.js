import React from 'react';
import BaseChartOptions from '../NVD3BaseChart/BaseChartOptions';
import { connect } from 'react-redux';

class Options extends BaseChartOptions {
  constructor() {
    super();
    this.hasAxes = true;
  }
}

Options.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(Options);
