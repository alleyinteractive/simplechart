import React, { Component } from 'react';
import { Input, Checkbox } from 'rebass';
import actionTrigger from '../../../..//actions';
import { RECEIVE_CHART_OPTIONS } from '../../../../constants';
import update from 'react-addons-update';

class GlobalOptions extends Component {

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._boolHandler = this._boolHandler.bind(this);
    this.defaultChangeHandlers = {
      height: parseInt,
      showLegend: this._boolHandler,
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

  _handleChange(evt) {
    // event target must have a value set
    if (typeof evt.target.value === 'undefined') {
      return;
    }

    const optKey = /^props-(\w+)$/.exec(evt.target.name);
    // get option key from name of field
    if (!optKey || optKey.length < 2) {
      return;
    }
    const key = optKey[1];
    const updateData = {};

    if (this.changeHandlers[key]) {
      updateData[key] = this.changeHandlers[key](evt.target.value, key);
    } else {
      updateData[key] = evt.target.value;
    }

    this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, updateData));
  }

  render() {
    return (
      <fieldset>
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

        {this.renderChildFields()}
      </fieldset>
    );
  }
}

GlobalOptions.propTypes = {
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default GlobalOptions;
