import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SELECT_CHART_TYPE } from '../../constants';
import actionTrigger from '../../actions';
import { Radio } from 'rebass';
import * as styles from './ChartTypeSelector.css';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import chartTypes from '../../constants/chartTypes';

class ChartTypeSelector extends Component {

  constructor() {
    super();
    this._selectChartType = this._selectChartType.bind(this);
    this._renderTypeOption = this._renderTypeOption.bind(this);
  }

  componentWillMount() {
    if (this.props.typeObj.type) {
      this._selectChartType(this.typeObj.type);
    }
  }

  _selectChartType(type) {
    this.props.dispatch(actionTrigger(SELECT_CHART_TYPE,
      this._getTypeObject(type)));
  }

  _getTypeObject(type) {
    for (const typeObj of chartTypes) {
      if (type === typeObj.type) {
        return typeObj;
      }
    }
    return {};
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
      checked: (typeObj.type === this.props.typeObj.type),
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
  typeObj: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartTypeSelector);
