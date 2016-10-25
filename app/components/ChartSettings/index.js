import React, { Component } from 'react';

class ChartSettings extends Component {
  constructor() {
    super();
    this._hasModule = this._hasModule.bind(this);
    this._renderModule = this._renderModule.bind(this);
    this._renderMetadataModule = this._renderMetadataModule.bind(this);
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
      return false;
    }
    const module = require(`./modules/${name}`).default;
    return React.createElement(module, {
      options: this.props.options,
      defaultExpand: this._shouldDefaultExpand(),
    });
  }

  _renderMetadataModule() {
    if (!this._hasModule('Metadata')) {
      return false;
    }
    const module = require('./modules/Metadata').default;
    return React.createElement(module, {
      metadata: this.props.metadata,
      defaultExpand: this._shouldDefaultExpand(),
    });
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
      return false;
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
        {this._renderModule('XAxis') || ''}
        {this._renderModule('YAxis') || ''}
        {this._renderModule('Legend') || ''}
        {this._renderMetadataModule() || ''}
        {this._renderCustomSettings(this.props.typeConfig) || ''}
      </div>
    );
  }
}

ChartSettings.propTypes = {
  metadata: React.PropTypes.object,
  options: React.PropTypes.object,
  typeConfig: React.PropTypes.object,
};

export default ChartSettings;
