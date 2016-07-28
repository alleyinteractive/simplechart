import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import { dataIsMultiSeries } from '../../utils/misc';
import { defaultTickFormat } from '../../constants/chartXYFuncs';
import { RECEIVE_CHART_OPTIONS } from '../../constants';
import { Button, Input } from 'rebass';
import update from 'react-addons-update';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import createFormatter from '../../utils/createFormatter';
import * as styles from './ChartDataFormatter.css';

class ChartDataFormatter extends Component {
  constructor() {
    super();
    this._revert = this._revert.bind(this);
    this._update = this._update.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._applyFormatting = this._applyFormatting.bind(this);
    this._getInitialFormatter = this._getInitialFormatter.bind(this);
    this.typeOptions = [
      {
        children: '',
        value: null,
      },
      {
        children: 'Number',
        value: 'number',
      },
      {
        children: 'Currency',
        value: 'currency',
      },
      {
        children: 'Percentage',
        value: 'percentage',
      },
    ];
  }

  componentWillMount() {
    const multiSeries = dataIsMultiSeries(this.props.data);
    const labels = {};

    if (multiSeries) {
      labels.x = 'X Axis Values';
      labels.y = 'Y Axis Values';
    } else {
      labels.x = 'Labels';
      labels.y = 'Values';
    }

    // Fall back to default x() and y() funcs if none provided in options
    const initial = {
      x: defaultTickFormat,
      y: defaultTickFormat,
    };

    const formatterDefaults = {
      prepend: '',
      format: '',
      multiplier: 1,
      append: '',
    };

    this.setState({
      multiSeries,
      initial,
      labels,
      formatterSettings: {
        x: formatterDefaults,
        y: formatterDefaults,
      },
    });
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

  _handleChange(evt) {
    const field = evt.target.name.split('.');
    const value = evt.target.type === 'number' ?
      parseFloat(evt.target.value) : evt.target.value;
    this.setState({ formatterSettings: update(this.state.formatterSettings,
      { $apply: (settings) => {
        settings[field[0]][field[1]] = value; // eslint-disable-line no-param-reassign
        return settings;
      } }
    ) });
  }

  _applyFormatting() {
    this._update('y', createFormatter(
      this.state.formatterSettings.y.prepend,
      this.state.formatterSettings.y.format,
      this.state.formatterSettings.y.multiplier,
      this.state.formatterSettings.y.append
    ));
  }

  render() {
    const revertY = () => this._revert('y');

    return (
      <div>
        <div className={styles.fieldgroup}>
          <h4>{this.state.labels.y}</h4>

          <Input
            label="Prepend"
            name="y.prepend"
            rounded
            value={this.state.formatterSettings.prepend}
            onChange={this._handleChange}
          />
          <Input
            label="D3 Format"
            name="y.format"
            rounded
            value={this.state.formatterSettings.format}
            onChange={this._handleChange}
          />
          <Input
            label="Multiplier"
            name="y.multiplier"
            type="number"
            value={this.state.formatterSettings.multiplier}
            rounded
            onChange={this._handleChange}
          />
          <Input
            label="Append"
            name="y.append"
            value={this.state.formatterSettings.append}
            rounded
            onChange={this._handleChange}
          />

          <Button
            theme="success"
            rounded
            onClick={this._applyFormatting}
          >Apply formatting</Button>

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
