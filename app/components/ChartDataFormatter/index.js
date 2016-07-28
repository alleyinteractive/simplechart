import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataIsMultiSeries } from '../../utils/misc';
import { multiXY, singleXY } from '../../constants/chartXYFuncs';

class ChartDataFormatter extends Component {
  componentWillMount() {
    const multiSeries = dataIsMultiSeries(this.props.data);
    const labels = {};
    let defaultInitial = {};

    if (multiSeries) {
      labels.x = 'X Axis Values';
      labels.y = 'Y Axis Values';
      defaultInitial = multiXY;
    } else {
      labels.x = 'Labels';
      labels.y = 'Values';
      defaultInitial = singleXY;
    }

    // Fall back to default x() and y() funcs if none provided in options
    const initial = {
      x: this.props.options.x || defaultInitial.x,
      y: this.props.options.y || defaultInitial.y,
    };

    this.setState({ multiSeries, initial, labels });
  }

  render() {
    return (
      <div>
        <h4>{this.state.labels.x}</h4>

        <h4>{this.state.labels.y}</h4>
      </div>
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
