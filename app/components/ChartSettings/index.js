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
    const module = require(`./modules/${name}`).default;
    return React.createElement(module, { options: this.props.options });
  }

  render() {
    return (
      <div>
        {this._hasModule('legend') ? this._renderModule('Legend') : ''}
      </div>
    );
  }
}

ChartSettings.propTypes = {
  options: React.PropTypes.object,
  typeConfig: React.PropTypes.object,
};

export default ChartSettings;
