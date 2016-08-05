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
import ListBlock from '../Layout/RebassComponents/ListBlock';

class ChartDataFormatter extends Component {
  constructor() {
    super();
    this._revert = this._revert.bind(this);
    this._update = this._update.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._applyFormatting = this._applyFormatting.bind(this);
    this.formatGuidelines = [
      'Formatting is applied to y-axis and tooltip labels.',
      'Learn more about D3 formatting syntax <a href="'
      + 'https://github.com/d3/d3-format/blob/master/README.md">here</a>.',
      'Y-axis minimum and maximum range is set under Chart Options',
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

    const tickFormatBuilder = this.props.options.tickFormatBuilder || {};
    this.setState({
      multiSeries,
      initial,
      labels,
      formatterSettings: {
        x: tickFormatBuilder.xAxis || formatterDefaults,
        y: tickFormatBuilder.yAxis || formatterDefaults,
      },
    });
  }

  /**
   * Send new tickFormat function to xAxis or yAxis, tooltip should inherit from yAxis.tickFormat
   *
   * @param string axis 'x' or 'y'
   * @param function formatter
   */
  _update(axis, tickFormat, formatData) {
    const axisName = `${axis}Axis`;
    this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, {
      // merge new tickFormat() into options, e.g. options.yAxis.tickFormat
      [axisName]: update(this.props.options[axisName] || {}, {
        $merge: { tickFormat },
      }),
      // merge format builder data, e.g. options.tickFormatBuilder.yAxis
      tickFormatBuilder: update(this.props.options.tickFormatBuilder || {}, {
        $apply: (builder) => {
          builder[axisName] = formatData; // eslint-disable-line no-param-reassign
          return builder;
        },
      }),
    }));
  }

  _revert(axis) {
    this._update(axis, this.state.initial[axis], null);
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

  _applyFormatting(axis) {
    this._update(
      axis,
      createFormatter(this.state.formatterSettings[axis]),
      this.state.formatterSettings[axis]
    );
  }

  render() {
    const revertY = () => this._revert('y');
    const applyFormattingY = () => this._applyFormatting('y');
    return (
      <div>
        <ListBlock list={this.formatGuidelines} />
        <div className={styles.fieldGroup}>
          <Input
            label="Prepend"
            name="y.prepend"
            rounded
            value={this.state.formatterSettings.y.prepend}
            onChange={this._handleChange}
          />
          <Input
            label="D3 Format"
            name="y.format"
            rounded
            value={this.state.formatterSettings.y.format}
            onChange={this._handleChange}
          />
          <Input
            label="Multiplier"
            name="y.multiplier"
            type="number"
            value={this.state.formatterSettings.y.multiplier}
            rounded
            onChange={this._handleChange}
          />
          <Input
            label="Append"
            name="y.append"
            value={this.state.formatterSettings.y.append}
            rounded
            onChange={this._handleChange}
          />

          <div className={styles.buttonContainer}>
            <Button
              theme="success"
              rounded
              onClick={applyFormattingY}
            >Apply formatting</Button>

            <Button
              theme="warning"
              rounded
              onClick={revertY}
            >Revert to default</Button>
          </div>
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
