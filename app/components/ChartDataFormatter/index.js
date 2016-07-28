import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import { dataIsMultiSeries } from '../../utils/misc';
import { multiXY, singleXY } from '../../constants/chartXYFuncs';
import { RECEIVE_CHART_OPTIONS } from '../../constants';
import { Button } from 'rebass';
import update from 'react-addons-update';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';

class ChartDataFormatter extends Component {
  constructor() {
    super();
    this._revert = this._revert.bind(this);
    this._update = this._update.bind(this);
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

  /**
   * Send new tickFormat function to xAxis or yAxis, tooltip should inherit from yAxis.tickFormat
   *
   * @param string axis 'x' or 'y'
   * @param function formatter
   */
  _update(axis, tickFormat) {
    const axisName = `${axis}Axis`;
    this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, {
      [axisName]: update(this.props.options[axisName] || {}, {
        $merge: { tickFormat },
      }),
    }));
  }

  _revert(axis) {
    this._update(axis, this.state.initial[axis]);
  }

  render() {
    const revertX = () => this._revert('x');
    const revertY = () => this._revert('y');
    return (
      <div>
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
        <NextPrevButton
          copy="Next"
          currentStep={this.props.currentStep}
          dir="next"
        />
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
