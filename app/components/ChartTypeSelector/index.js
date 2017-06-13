import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  CLEAR_ERROR,
  RECEIVE_ERROR,
  RECEIVE_CHART_TYPE,
} from '../../constants';
import actionTrigger from '../../actions';
import { Radio } from 'rebass';
import * as styles from './ChartTypeSelector.css';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import { selectableChartTypes } from '../../constants/chartTypes';
import { getChartTypeObject } from '../../utils/chartTypeUtils';

class ChartTypeSelector extends Component {

  constructor() {
    super();
    this._selectChartType = this._selectChartType.bind(this);
    this._renderTypeOption = this._renderTypeOption.bind(this);
    this._getChartType = this._getChartType.bind(this);
  }

  componentWillMount() {
    if (this._getChartType()) {
      this._selectChartType(this._getChartType());
    }
  }

  _getChartType() {
    if (!this.props.typeObj.config || !this.props.typeObj.config.type) {
      return null;
    }
    return this.props.typeObj.config.type;
  }

  _selectChartType(selectedName) {
    const typeObj = getChartTypeObject(selectedName);
    if (typeObj) {
      this.props.dispatch(actionTrigger(RECEIVE_CHART_TYPE, typeObj));
      this.props.dispatch(actionTrigger(CLEAR_ERROR));
    } else {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e003'));
    }
  }

  /**
   * The idea is to enable chart types where data is compatible
   * and disable chart types where data is incompatible
   */
  _renderTypeOption(typeConfig) {
    // Disable the chart type when transformed data is not available for its dataFormat
    const disabled = !this.props.transformedData[typeConfig.dataFormat];

    return React.createElement(Radio, {
      key: typeConfig.type,
      circle: true,
      label: typeConfig.label,
      name: 'chartTypeSelect',
      value: typeConfig.type,
      backgroundColor: !disabled ? 'primary' : 'secondary',
      disabled,
      checked: (typeConfig.type === this._getChartType()),
      onChange: (evt) => this._selectChartType(evt.target.value),
      style: disabled ? { cursor: 'default' } : {},
    });
  }

  render() {
    return (
      <div>
        <ul className={styles.list}>
          {selectableChartTypes.map((typeObj) =>
            this._renderTypeOption(typeObj.config)
          )}
        </ul>
        <NextPrevButton
          text="Next"
          currentStep={1}
          dir="next"
          shouldEnable={!!this._getChartType()}
        />
      </div>
    );
  }
}

ChartTypeSelector.propTypes = {
  transformedData: PropTypes.object,
  typeObj: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect()(ChartTypeSelector);
