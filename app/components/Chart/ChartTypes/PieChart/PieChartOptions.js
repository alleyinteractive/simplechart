import React from 'react';
import GlobalOptions from '../../../ChartOptions/GlobalOptions';
import { connect } from 'react-redux';
import { Checkbox } from 'rebass';
import actionTrigger from '../../../../actions';
import {
  RECEIVE_CHART_OPTIONS,
  DELETE_CHART_OPTIONS,
} from '../../../../constants';

class PieChartOptions extends GlobalOptions {
  constructor() {
    super();
    this.changeHandlers = {
      donut: this._boolHandler,
    };
    this._handleDonutChange = this._handleDonutChange.bind(this);
  }

  _handleDonutChange(evt) {
    this._handleChange(evt);
    if (this._boolHandler(evt.target.value, 'donut')) {
      this.props.dispatch(actionTrigger(
        RECEIVE_CHART_OPTIONS, { donutRatio: 0.5 }));
    } else {
      this.props.dispatch(actionTrigger(
        DELETE_CHART_OPTIONS, ['donutRatio', 'donut']));
    }
  }

  childFields() {
    return (
        <Checkbox
          label="Donut chart"
          name="props-donut"
          checked={this.props.options.donut}
          onChange={this._handleDonutChange}
        />
    );
  }
}

PieChartOptions.propTypes = {
  options: React.PropTypes.object,
};

export default connect()(PieChartOptions);
