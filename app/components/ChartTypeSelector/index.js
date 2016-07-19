import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataTransformers } from '../../constants/dataTransformers';
import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_DATA } from '../../constants';
import actionTrigger from '../../actions';
import { Radio } from 'rebass';
import * as styles from './ChartTypeSelector.css';
import { NextPrevButton } from '../Layout/RebassComponents/NextPrevButton';

class ChartTypeSelector extends Component {

  constructor() {
    super();
    this._testChartTypes = this._testChartTypes.bind(this);
    this._selectChartType = this._selectChartType.bind(this);
    this._renderTypeOption = this._renderTypeOption.bind(this);
  }

  componentWillMount() {
    this._testChartTypes(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._testChartTypes(nextProps);
  }

  _selectChartType(evt) {
    const type = evt.target.value;

    // send selected chart type  to store options
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_OPTIONS,
      { type }
    ));

    // send data to store, already transformed for selected chart type
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_DATA,
      this.state[type]
    ));
  }

  _testChartTypes(props) {
    const types = Object.keys(dataTransformers);
    types.forEach((type) =>
      this.setState({
        [type]: dataTransformers[type](props.data, props.fields),
      })
    );
  }

  /**
   * The idea is to enable chart types where data is compatible
   * and disable chart types where data is incompatible
   */
  _renderTypeOption(type) {
    const disabled = !this.state[type];
    return React.createElement(Radio, {
      key: type,
      circle: true,
      label: type,
      name: 'chartTypeSelect',
      value: type,
      backgroundColor: !disabled ? 'primary' : 'secondary',
      disabled,
      checked: (type === this.props.type),
      onChange: this._selectChartType,
    });
  }

  render() {
    return (
      <div>
        <ul className={styles.list}>
          {Object.keys(this.state).map((type) =>
            this._renderTypeOption(type)
          )}
        </ul>
        <NextPrevButton
          copy="Next"
          currentStep={1}
          dir="next"
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

ChartTypeSelector.propTypes = {
  data: React.PropTypes.array,
  fields: React.PropTypes.array,
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartTypeSelector);
