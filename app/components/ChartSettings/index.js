import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import NextPrevButton from '../Layout/RebassComponents/NextPrevButton';
import modules from './modules';
import customModules from './modules/custom';

class ChartSettings extends Component {
  constructor() {
    super();
    this.hasModule = this.hasModule.bind(this);
    this.renderModule = this.renderModule.bind(this);
    this.shouldDefaultExpand = this.shouldDefaultExpand.bind(this);
  }

  componentWillMount() {
    this.setState({
      modules: this.props.typeConfig.modules.settings,
    });
  }

  hasModule(name) {
    return -1 !== this.state.modules.indexOf(name);
  }

  shouldDefaultExpand() {
    let nModules = this.state.modules.length;
    if (this.props.typeConfig.settingsComponent) {
      nModules += 1;
    }
    return 1 === nModules;
  }

  renderCustomSettings(config) {
    if (!config.settingsComponent) {
      return null;
    }
    const Module = customModules[config.settingsComponent];
    return (
      <Module
        options={this.props.options}
        defaultExpand={this.shouldDefaultExpand()}
      />
    );
  }

  renderModule(name) {
    if (!this.hasModule(name)) {
      return null;
    }

    // Setup props, handling special cases for Metadata and ColorPalette
    const moduleProps = update({}, {
      defaultExpand: { $set: this.shouldDefaultExpand() },
      options: { $set: 'Metadata' !== name ? this.props.options : {} },
      metadata: { $set: 'Metadata' === name ? this.props.metadata : {} },
      data: { $set: 'ColorPalette' === name ? this.props.data : [] },
    });

    const Module = modules[name];
    return <Module {...moduleProps} />;
  }

  render() {
    return (
      <div>
        <div>
          {this.renderModule('XAxis')}
          {this.renderModule('YAxis')}
          {this.renderModule('Legend')}
          {this.renderModule('Metadata')}
          {this.renderModule('ColorPalette')}
          {this.renderCustomSettings(this.props.typeConfig)}
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
  metadata: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  typeConfig: PropTypes.object.isRequired,
};

export default ChartSettings;
