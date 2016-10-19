import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SELECT_CHART_TYPE } from '../../constants';
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
  }

  componentWillMount() {
    if (this.props.typeObj.type) {
      this._selectChartType(this.typeObj.type);
    }
  }

  _selectChartType(selectedName) {
    const typeObj = getChartTypeObject(selectedName);
    if (typeObj) {
      // clear error
      this.props.dispatch(actionTrigger(SELECT_CHART_TYPE, typeObj));
    } else {
      // error
    }
  }

  /**
   * The idea is to enable chart types where data is compatible
   * and disable chart types where data is incompatible
   */
  _renderTypeOption(typeConfig) {
    const disabled = !this.props.transformedData[typeConfig.dataFormat];
    return React.createElement(Radio, {
      key: typeConfig.type,
      circle: true,
      label: typeConfig.label,
      name: 'chartTypeSelect',
      value: typeConfig.type,
      backgroundColor: !disabled ? 'primary' : 'secondary',
      disabled,
      checked: (typeConfig.type === this.props.typeObj.type),
      onChange: (evt) => this._selectChartType(evt.target.value),
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
