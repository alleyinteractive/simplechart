import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataInput from './DataInput';
import update from 'react-addons-update';
import ChartEditor from './ChartEditor';
import Header from './Header';
import * as rebassHover from '../styles/RebassHover.css'; // eslint-disable-line no-unused-vars

class App extends Component {

  constructor() {
    super();
    this._renderAppComponent = this._renderAppComponent.bind(this);
    this._getSaveData = this._getSaveData.bind(this);
  }

  /**
   * Pluck from state only the keys we want to eventually save to the CMS
   */
  _getSaveData() {
    return update(this.props.state, { $apply: (state) =>
      ({
        rawData: state.rawData,
        chartData: state.chartData,
        chartMetadata: state.chartMetadata,
        chartOptions: state.chartOptions,
        chartType: state.chartType.config ? state.chartType.config.type : '',
      }),
    });
  }

  _renderAppComponent() {
    if (0 === this.props.state.currentStep) {
      return React.createElement(DataInput, {
        rawData: this.props.state.rawData,
        dataStatus: this.props.state.dataStatus,
      });
    }
    return React.createElement(ChartEditor, {
      state: this.props.state,
    });
  }

  render() {
    return (
      // set height 100% so child divs inherit it
      <div style={{ height: '100%' }}>
        <Header
          saveData={this._getSaveData()}
          currentStep={this.props.state.currentStep}
          unsavedChanges={this.props.state.unsavedChanges}
          errorCode={this.props.state.errorCode}
        />
        {this._renderAppComponent()}
      </div>
    );
  }
}

App.propTypes = {
  state: React.PropTypes.object,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({ state })
)(App);
