import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataInput from './DataInput';
import ChartTypeSelector from './ChartTypeSelector';
import ChartMetadata from './ChartMetadata';
import ChartBuilder from './ChartBuilder';
import ProgressHeader from './Layout/ProgressHeader';
import { Message } from 'rebass';

class App extends Component {

  constructor() {
    super();
    this._renderChartTypeSelector = this._renderChartTypeSelector.bind(this);
    this._renderChartBuilder = this._renderChartBuilder.bind(this);
    this._renderCurrentStep = this._renderCurrentStep.bind(this);
  }

  _renderChartTypeSelector() {
    if (this.props.state.dataStatus.status !== 'success') {
      return '';
    }
    return (
      <ChartTypeSelector
        data={this.props.state.parsedData}
        fields={this.props.state.dataFields}
      />
    );
  }

  _renderChartBuilder() {
    if (this.props.state.dataStatus.status !== 'success' ||
      !this.props.state.chartOptions ||
      !this.props.state.chartOptions.type
    ) {
      return '';
    }
    return (
      <ChartBuilder
        state={this.props.state}
      />
    );
  }

  _renderCurrentStep() {
    let toRender;
    switch (this.props.state.currentStep) {
      case 0:
        toRender = React.createElement(DataInput, {
          rawData: this.props.state.rawData,
          dataStatus: this.props.state.dataStatus,
        });
        break;

      case 1:
        toRender = this._renderChartTypeSelector();
        break;

      case 2:
        toRender = React.createElement(ChartMetadata, {
          metadata: this.props.state.chartMetadata,
        });
        break;

      case 3:
        toRender = this._renderChartBuilder();
        break;

      default:
        toRender = React.createElement(Message, {
          inverted: true,
          rounded: true,
          theme: 'error',
          style: { marginTop: '55px' },
        }, 'An error occurred');
    }
    return toRender;
  }

  render() {
    return (
      // set height 100% so child divs inherit it
      <div style={{ height: '100%' }}>
        <ProgressHeader currentStep={this.props.state.currentStep} />
        {this._renderCurrentStep()}
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
