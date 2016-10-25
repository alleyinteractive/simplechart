import React, { Component } from 'react';

class ChartSettings extends Component {
  constructor() {
    super();
    this._hasModule = this._hasModule.bind(this);
    this._renderModule = this._renderModule.bind(this);
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
    return React.createElement(module, { options: this.props.options });
  }

  _renderCustomSettings(config) {
    if (!config.settingsComponent) {
      return false;
    }
    const module = require(`./modules/custom/${config.settingsComponent}`).default;
    return React.createElement(module, { options: this.props.options });
  }

  render() {
    return (
      <div>
        {this._renderModule('XAxis') || ''}
        {this._renderModule('YAxis') || ''}
        {this._renderModule('Legend') || ''}
        {this._renderCustomSettings(this.props.typeConfig) || ''}
      </div>
    );
  }
}

ChartSettings.propTypes = {
  options: React.PropTypes.object,
  typeConfig: React.PropTypes.object,
};

export default ChartSettings;
