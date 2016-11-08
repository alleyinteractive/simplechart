import React, { Component } from 'react';
import update from 'react-addons-update';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';

class ChartSettings extends Component {
  constructor() {
    super();
    this._hasModule = this._hasModule.bind(this);
    this._renderModule = this._renderModule.bind(this);
    this._shouldDefaultExpand = this._shouldDefaultExpand.bind(this);
  }

  componentWillMount() {
    this.setState({
      modules: this.props.typeConfig.modules.settings,
    });
  }

  _hasModule(name) {
    return -1 !== this.state.modules.indexOf(name);
  }

  _renderModule(name) {
    if (!this._hasModule(name)) {
      return null;
    }

    // Setup props, handling special cases for Metadata and ColorPalette
    const moduleProps = update({}, {
      defaultExpand: { $set: this._shouldDefaultExpand() },
      options: { $set: 'Metadata' !== name ? this.props.options : {} },
      metadata: { $set: 'Metadata' === name ? this.props.metadata : {} },
      data: { $set: 'ColorPalette' === name ? this.props.data : [] },
    });
    const module = require(`./modules/${name}`).default;
    return React.createElement(module, moduleProps);
  }

  _shouldDefaultExpand() {
    let nModules = this.state.modules.length;
    if (this.props.typeConfig.settingsComponent) {
      nModules++;
    }
    return 1 === nModules;
  }

  _renderCustomSettings(config) {
    if (!config.settingsComponent) {
      return null;
    }
    const module = require(`./modules/custom/${config.settingsComponent}`).default;
    return React.createElement(module, {
      options: this.props.options,
      defaultExpand: this._shouldDefaultExpand(),
    });
  }

  render() {
    return (
      <div>
        <div>
          {this._renderModule('XAxis')}
          {this._renderModule('YAxis')}
          {this._renderModule('Legend')}
          {this._renderModule('Metadata')}
          {this._renderModule('ColorPalette')}
          {this._renderCustomSettings(this.props.typeConfig)}
        </div>
        <NextPrevButton
          text="Next"
          currentStep={2}
          dir="next"
        />
      </div>
    );
  }
}

ChartSettings.propTypes = {
  metadata: React.PropTypes.object,
  options: React.PropTypes.object,
  data: React.PropTypes.array,
  typeConfig: React.PropTypes.object,
};

export default ChartSettings;
