import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RECEIVE_CHART_OPTIONS, RECEIVE_CHART_DATA } from '../../constants';
import actionTrigger from '../../actions';
import { Radio } from 'rebass';
import * as styles from './ChartTypeSelector.css';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';

class ChartTypeSelector extends Component {

  constructor() {
    super();
    this._selectChartType = this._selectChartType.bind(this);
    this._renderTypeOption = this._renderTypeOption.bind(this);
  }

  componentWillMount() {
    if (this.props.type) {
      this._selectChartType(this.props.type);
    }
  }

  _selectChartType(type) {
    // send selected chart type  to store options
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_OPTIONS,
      { type }
    ));

    // send data to store, already transformed for selected chart type
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_DATA,
      this.props.transformedData[type]
    ));
  }

  /**
   * The idea is to enable chart types where data is compatible
   * and disable chart types where data is incompatible
   */
  _renderTypeOption(type) {
    const disabled = !this.props.transformedData[type];
    return React.createElement(Radio, {
      key: type,
      circle: true,
      label: type,
      name: 'chartTypeSelect',
      value: type,
      backgroundColor: !disabled ? 'primary' : 'secondary',
      disabled,
      checked: (type === this.props.type),
      onChange: (evt) => this._selectChartType(evt.target.value),
    });
  }

  render() {
    return (
      <div>
        <ul className={styles.list}>
          {Object.keys(this.props.transformedData).map((type) =>
            this._renderTypeOption(type)
          )}
        </ul>
        <NextPrevButton
          copy="Next"
          currentStep={1}
          dir="next"
        />
      </div>
    );
  }
}

ChartTypeSelector.propTypes = {
  transformedData: React.PropTypes.object,
  fields: React.PropTypes.array,
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartTypeSelector);
