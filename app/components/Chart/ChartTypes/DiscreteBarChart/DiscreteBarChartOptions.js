import React from 'react';
import BaseChartOptions from '../NVD3BaseChart/BaseChartOptions';
import { connect } from 'react-redux';
import { Input } from 'rebass';

class Options extends BaseChartOptions {
  constructor() {
    super();
    this.hasXAxis = false;
    this.hasYAxis = true;
  }
}

Options.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(Options);
