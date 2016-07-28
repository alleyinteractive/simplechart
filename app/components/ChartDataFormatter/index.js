import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataIsMultiSeries } from '../../utils/misc';

class ChartDataFormatter extends Component {
  componentWillMount() {
    const initial = {
      x: this.props.options.x || null,
      y: this.props.options.y || null,
    };

    /**
     * Chart type must have specified default x() and y() funcs
     * or we have nothing to revert to so we can skip this
     */
     // @todo Skip if !initial.x && !initial.y

    const labels = {};
    if (dataIsMultiSeries(this.props.data)) {
      labels.x = 'X Axis Values';
      labels.y = 'Y Axis Values';
    } else {
      labels.x = 'Labels';
      labels.y = 'Values';
    }

    this.setState({ initial, labels });
  }

  render() {
    return (
      <div>hi</div>
    );
  }
}

ChartDataFormatter.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  currentStep: React.PropTypes.number,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartDataFormatter);
