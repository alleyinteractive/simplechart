import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataInput from './DataInput';
import ChartBuilder from './ChartBuilder';
import ProgressHeader from './Layout/ProgressHeader';
import ErrorMessage from '../utils/ErrorMessage';

class App extends Component {

  constructor() {
    super();
    this._renderChartBuilder = this._renderChartBuilder.bind(this);
    this._renderAppComponent = this._renderAppComponent.bind(this);
  }

  _renderChartBuilder() {
    if (this.props.state.dataStatus.status !== 'success') {
      return new ErrorMessage('Invalid data. Please resubmit.');
    }
    return React.createElement(ChartBuilder, {
      state: this.props.state,
    });
  }

  _renderAppComponent() {
    if (this.props.state.currentStep === 0) {
      return React.createElement(DataInput, {
        rawData: this.props.state.rawData,
        dataStatus: this.props.state.dataStatus,
      });
    } else if (this.props.state.currentStep <= 3) {
      return this._renderChartBuilder();
    }
    return new ErrorMessage();
  }

  render() {
    return (
      // set height 100% so child divs inherit it
      <div style={{ height: '100%' }}>
        <ProgressHeader currentStep={this.props.state.currentStep} />
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
