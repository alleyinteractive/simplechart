import React, { Component } from 'react';
import { Input, Checkbox } from 'rebass';
import actionTrigger from '../../../..//actions';
import { RECEIVE_CHART_OPTIONS } from '../../../../constants';
import update from 'react-addons-update';
import Chart from '../../../Chart';

class GlobalOptions extends Component {

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._boolHandler = this._boolHandler.bind(this);
    this._renderXAxis = this._renderXAxis.bind(this);
    this._renderYAxis = this._renderYAxis.bind(this);
    this._getSubkey = this._getSubkey.bind(this);
    this._subkeyHandler = this._subkeyHandler.bind(this);
    this._yDomainHandler = this._yDomainHandler.bind(this);

    this.defaultChangeHandlers = {
      showLegend: this._boolHandler,
      xAxis: this._subkeyHandler,
      yAxis: this._subkeyHandler,
      yDomain: this._yDomainHandler,
    };
    this.changeHandlers = {};

    if (!this.renderChildFields) {
      this.renderChildFields = () => '';
    } else {
      this.renderChildFields = this.renderChildFields.bind(this);
    }
  }

  componentWillMount() {
    this.changeHandlers = update(this.defaultChangeHandlers,
      { $merge: this.changeHandlers });
  }

  /**
   * Handle boolean value by alternating
   */
  _boolHandler(targetValue, key) {
    return !this.props.options[key];
  }

  /**
   * Handle change in a subfield of one of the axes
   *
   * @param string value New subfield value
   * @param string axis 'xAxis' or 'yAxis'
   * @param string subkey E.g. 'axisLabel'
   * @return object New value of axis object
   */
  _subkeyHandler(value, key, subkey) {
    const keyVal = { [subkey]: value };
    if (typeof this.props.options[key] === 'undefined') {
      return keyVal;
    }
    return update(this.props.options[key], { $merge: keyVal });
  }

  _yDomainHandler(value, key, subkey) {
    let yDomain;
    if (subkey === 'min') {
      yDomain = [parseFloat(value), this._getYDomain(1)];
    } else if (subkey === 'max') {
      yDomain = [this._getYDomain(0), parseFloat(value)];
    }
    return yDomain;
  }

  _handleChange(evt) {
    // event target must have a value set
    if (typeof evt.target.value === 'undefined') {
      return;
    }

    // Check field name for option key(s)
    const optKeys = /^props-(\w+)(?:(?:\.)(\w+))?$/.exec(evt.target.name);
    if (!optKeys || optKeys.length < 2) {
      return;
    }

    // Get option key and maybe subkey to allow a second level in the options object
    let key;
    let subkey;
    if (optKeys.length === 2) {
      key = optKeys[1];
      subkey = null;
    } else {
      key = optKeys[1];
      subkey = optKeys[2];
    }
    const updateData = {};

    // maybe convert value to float or int
    let fieldValue = evt.target.value;
    if (evt.target.type === 'number') {
      fieldValue = parseInt(evt.target.step, 10) === 1 ?
        parseInt(fieldValue, 10) : parseFloat(fieldValue, 10);
    }

    if (this.changeHandlers[key]) {
      updateData[key] = this.changeHandlers[key](fieldValue, key, subkey);
    } else {
      updateData[key] = fieldValue;
    }

    this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, updateData));
  }

  _getSubkey(key, subkey, defaultValue) {
    if (typeof this.props.options[key] === 'undefined' ||
      typeof this.props.options[key][subkey] === 'undefined') {
      return defaultValue;
    }
    return this.props.options[key][subkey];
  }

  /**
   * Get min or max of current yDomain value
   *
   * @param int index 0 for min, 1 for max
   * @return number Current value
   */
  _getYDomain(index) {
    if (this.props.options.yDomain &&
      typeof this.props.options.yDomain[index] !== 'undefined') {
      return this.props.options.yDomain[index];
    }
    return 0;
  }

  _renderXAxis() {
    return (
      <div>
        <h3>X Axis</h3>
        <Input
          label="Label"
          name="props-xAxis.axisLabel"
          value={this._getSubkey('xAxis', 'axisLabel', '')}
          onChange={this._handleChange}
        />
        <Input
          label="Rotation"
          name="props-xAxis.rotateLabels"
          type="number"
          step="1"
          value={this._getSubkey('xAxis', 'rotateLabels', 0)}
          onChange={this._handleChange}
        />
      </div>
    );
  }

  _renderYAxis() {
    return (
      <div>
        <h3>Y Axis</h3>
        <Input
          label="Label"
          name="props-yAxis.axisLabel"
          value={this._getSubkey('yAxis', 'axisLabel', '')}
          onChange={this._handleChange}
        />
        <Input
          label="Y Min"
          name="props-yDomain.min"
          type="number"
          value={this._getYDomain(0)}
          onChange={this._handleChange}
        />
        <Input
          label="Y Max"
          name="props-yDomain.max"
          type="number"
          value={this._getYDomain(1)}
          onChange={this._handleChange}
        />
      </div>
    );
  }

  render() {
    return (
      <fieldset>
        <h3>General</h3>
        <Input
          label="Height"
          name="props-height"
          type="number"
          step="1"
          value={this.props.options.height}
          onChange={this._handleChange}
        />

        <Checkbox
          label="Show legend"
          name="props-showLegend"
          checked={this.props.options.showLegend}
          onChange={this._handleChange}
        />

        {this.hasXAxis ? this._renderXAxis() : ''}
        {this.hasYAxis ? this._renderYAxis() : ''}

        {this.renderChildFields()}
      </fieldset>
    );
  }
}

GlobalOptions.propTypes = {
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  chart: React.PropTypes.instanceOf(Chart),
};

export default GlobalOptions;
