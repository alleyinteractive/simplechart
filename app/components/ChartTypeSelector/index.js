import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_INIT,
  RECEIVE_CHART_DATA,
} from '../../constants';
import actionTrigger from '../../actions';
import { Radio } from 'rebass';
import * as styles from './ChartTypeSelector.css';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import { dataIsMultiSeries } from '../../utils/misc';
import { multiXY, singleXY } from '../../constants/chartXYFuncs';
import chartTypes from '../../constants/chartTypes';

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
    // send data to store, already transformed for selected chart type
    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_DATA,
      this.props.transformedData[type]
    ));

    // Default x() and y() funcs
    /**
     * @todo Apply global defaults for chart type and/or data type here
     */
    const opts = { type };
    if (dataIsMultiSeries(this.props.transformedData[type])) {
      opts.x = multiXY.x;
      opts.y = multiXY.y;
    } else {
      opts.x = singleXY.x;
      opts.y = singleXY.y;
    }

    // trigger chart init action if required
    if (!this.props.type.length) {
      this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS_INIT, opts));
    } else {
      this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, opts));
    }
  }

  /**
   * The idea is to enable chart types where data is compatible
   * and disable chart types where data is incompatible
   */
  _renderTypeOption(typeObj) {
    const disabled = !this.props.transformedData[typeObj.dataFormat];
    return React.createElement(Radio, {
      key: typeObj.type,
      circle: true,
      label: typeObj.label,
      name: 'chartTypeSelect',
      value: typeObj.type,
      backgroundColor: !disabled ? 'primary' : 'secondary',
      disabled,
      checked: (typeObj.type === this.props.type),
      onChange: (evt) => this._selectChartType(evt.target.value),
    });
  }

  render() {
    return (
      <div>
        <ul className={styles.list}>
          {chartTypes.map((type) =>
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
