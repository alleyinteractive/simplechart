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
    this._renderAxesFields = this._renderAxesFields.bind(this);
    this._getSubkey = this._getSubkey.bind(this);
    this._subkeyHandler = this._subkeyHandler.bind(this);

    this.defaultChangeHandlers = {
      height: parseInt,
      showLegend: this._boolHandler,
      xAxis: this._subkeyHandler,
      yAxis: this._subkeyHandler,
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

    if (this.changeHandlers[key]) {
      updateData[key] = this.changeHandlers[key](evt.target.value, key, subkey);
    } else {
      updateData[key] = evt.target.value;
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

  _renderAxesFields() {
    return (
      <div>
        <h3>X Axis</h3>
        <Input
          label="Label"
          name="props-xAxis.axisLabel"
          value={this._getSubkey('xAxis', 'axisLabel', '')}
          onChange={this._handleChange}
        />
        <h3>Y Axis</h3>
        <Input
          label="Label"
          name="props-yAxis.axisLabel"
          value={this._getSubkey('yAxis', 'axisLabel', '')}
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

        {this.hasAxes ? this._renderAxesFields() : ''}

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
