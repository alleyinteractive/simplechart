import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';

class ChartSettings extends Component {
  constructor() {
    super();
    this._hasModule = this._hasModule.bind(this);
    this._renderModule = this._renderModule.bind(this);
    this._toggleModuleCallback = this._toggleModuleCallback.bind(this);
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

  _toggleModuleCallback(expanded, name) {
    if (expanded) {
      this.setState({
        activeSettings: name,
      });
    }
  }

  _renderModule(name) {
    if (!this._hasModule(name)) {
      return null;
    }

    // Setup props, handling special cases for Metadata and ColorPalette
    const moduleProps = update({}, {
      defaultExpand: { $set: this._shouldDefaultExpand(name) },
      toggleCallback: {
        $set: (expanded) => this._toggleModuleCallback(expanded, name),
      },
      options: { $set: 'Metadata' !== name ? this.props.options : {} },
      metadata: { $set: 'Metadata' === name ? this.props.metadata : {} },
      data: { $set: 'ColorPalette' === name ? this.props.data : [] },
    });
    const module = require(`./modules/${name}`).default;
    return React.createElement(module, moduleProps);
  }

  _shouldDefaultExpand(name) {
    let nModules = this.state.modules.length;
    if (this.props.typeConfig.settingsComponent) {
      nModules++;
    }
    return 1 === nModules || name === this.state.activeSettings;
  }

  _renderCustomSettings(config) {
    if (!config.settingsComponent) {
      return null;
    }
    const module = require(`./modules/custom/${config.settingsComponent}`).default;
    return React.createElement(module, {
      options: this.props.options,
      defaultExpand: this._shouldDefaultExpand(name),
      toggleCallback: (expanded) => this._toggleModuleCallback(expanded, name),
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.state.modules.map((name) => this._renderModule(name))}
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
  metadata: PropTypes.object,
  options: PropTypes.object,
  data: PropTypes.array,
  typeConfig: PropTypes.object,
};

export default ChartSettings;
