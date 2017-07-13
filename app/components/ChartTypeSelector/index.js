import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Radio } from 'rebass';
import {
  RECEIVE_ERROR,
  RECEIVE_CHART_TYPE,
} from '../../constants';
import actionTrigger from '../../actions';
import * as styles from './ChartTypeSelector.css';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import { selectableChartTypes } from '../../constants/chartTypes';
import { getChartTypeObject } from '../../utils/chartTypeUtils';

class ChartTypeSelector extends Component {
  static propTypes = {
    transformedData: PropTypes.object.isRequired,
    typeObj: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (this.getChartType()) {
      this.selectChartType(this.getChartType());
    }
  }

  getChartType = () => {
    if (!this.props.typeObj.config || !this.props.typeObj.config.type) {
      return null;
    }
    return this.props.typeObj.config.type;
  };

  selectChartType = (selectedName) => {
    const typeObj = getChartTypeObject(selectedName);
    if (typeObj) {
      this.props.dispatch(actionTrigger(RECEIVE_CHART_TYPE, typeObj));
    } else {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e003'));
    }
  };

  /**
   * The idea is to enable chart types where data is compatible
   * and disable chart types where data is incompatible
   */
  renderTypeOption = ({ type, dataFormat, label }) => {
    // Disable the chart type when transformed data is not available for its dataFormat
    const disabled = !this.props.transformedData[dataFormat];

    return React.createElement(Radio, {
      key: type,
      circle: true,
      label: (label instanceof Function) ?
        label(this.props.transformedData) : label,
      name: 'chartTypeSelect',
      value: type,
      backgroundColor: !disabled ? 'primary' : 'secondary',
      disabled,
      checked: (type === this.getChartType()),
      onChange: (evt) => this.selectChartType(evt.target.value),
      style: disabled ? { cursor: 'default' } : {},
    });
  };

  render() {
    return (
      <div>
        <ul className={styles.list}>
          {selectableChartTypes.map((typeObj) =>
            this.renderTypeOption(typeObj.config)
          )}
        </ul>
        <NextPrevButton
          text="Next"
          currentStep={1}
          dir="next"
          shouldEnable={!!this.getChartType()}
        />
      </div>
    );
  }
}

export default connect()(ChartTypeSelector);
