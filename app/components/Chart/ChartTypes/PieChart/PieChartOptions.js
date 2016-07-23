import React from 'react';
import GlobalOptions from '../../../ChartOptions/GlobalOptions';
import { connect } from 'react-redux';

class PieChartOptions extends GlobalOptions {

}

PieChartOptions.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(PieChartOptions);
