import React from 'react';
import BaseChartOptions from '../NVD3BaseChart/BaseChartOptions';
import { connect } from 'react-redux';
import { Checkbox } from 'rebass';

class Options extends BaseChartOptions {
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

Options.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(Options);
