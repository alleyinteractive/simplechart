import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataInput from './DataInput';
import ChartTypeSelector from './ChartTypeSelector';
import ChartBuilder from './ChartBuilder';
import ProgressHeader from './Layout/ProgressHeader';

class App extends Component {

  constructor() {
    super();
    this._renderChartTypeSelector = this._renderChartTypeSelector.bind(this);
    this._renderChartBuilder = this._renderChartBuilder.bind(this);
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
  render() {
    return (
      // set height 100% so child divs inherit it
      <div style={{ height: '100%' }}>
        <ProgressHeader currentStep={this.props.state.currentStep} />
        <DataInput
          rawData={this.props.state.rawData}
          dataStatus={this.props.state.dataStatus}
        />
        {this._renderChartTypeSelector()}
        {this._renderChartBuilder()}
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
