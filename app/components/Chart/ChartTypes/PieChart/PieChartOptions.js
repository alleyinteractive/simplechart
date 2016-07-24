import React from 'react';
import GlobalOptions from '../../../ChartOptions/GlobalOptions';
import { connect } from 'react-redux';
import { Checkbox } from 'rebass';

class PieChartOptions extends GlobalOptions {
  constructor() {
    super();
    this.changeHandlers = {
      donut: this._boolHandler,
    };
  }

  childFields() {
    return (
        <Checkbox
          label="Donut chart"
          name="props-donut"
          checked={this.props.options.donut}
          onChange={this._handleChange}
        />
    );
  }
}

PieChartOptions.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(PieChartOptions);
