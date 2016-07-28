import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import { dataIsMultiSeries } from '../../utils/misc';
import { multiXY, singleXY } from '../../constants/chartXYFuncs';
import { RECEIVE_CHART_OPTIONS } from '../../constants';
import { Button } from 'rebass';

class ChartDataFormatter extends Component {
  constructor() {
    super();
    this._revert = this._revert.bind(this);
  }

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

  _revert(axis) {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, {
      [axis]: this.state.initial[axis],
    }));
  }

  render() {
    const revertX = () => this._revert('x');
    const revertY = () => this._revert('y');
    return (
      <fieldset>
        {this.state.multiSeries ? ( // No formatting for single-series labels (e.g. pie chart)
          <div>
            <h4>{this.state.labels.x}</h4>
            <Button
              theme="warning"
              rounded
              onClick={revertX}
            >Revert to default</Button>
          </div>
        ) : '' }
        <div>
          <h4>{this.state.labels.y}</h4>
          <Button
            theme="warning"
            rounded
            onClick={revertY}
          >Revert to default</Button>
        </div>
      </fieldset>
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
