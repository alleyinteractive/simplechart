import React from 'react';
import { connect } from 'react-redux';
import Chart from '../Chart/';
import ChartTypeSelector from '../ChartTypeSelector/';
import ChartMetadata from '../ChartMetadata/';
import PalettePicker from '../PalettePicker/';
import SaveChart from '../SaveChart/';
import AppComponent from '../Layout/AppComponent';
import ErrorMessage from '../../utils/ErrorMessage';

class ChartBuilder extends AppComponent {

  _renderSubcomponent(step) {
    let subcomponent;
    switch (step) {
      case 1:
        subcomponent = React.createElement(ChartTypeSelector, {
          data: this.props.state.parsedData,
          fields: this.props.state.dataFields,
        });
        break;

      case 2:
        subcomponent = React.createElement(ChartMetadata, {
          metadata: this.props.state.chartMetadata,
        });
        break;

      case 3:
        subcomponent = React.createElement(PalettePicker, {
          data: this.props.state.chartData,
          options: this.props.state.chartOptions,
        });
        break;

      default:
        subcomponent = new ErrorMessage();
    }
    return subcomponent;
  }

  render() {
    return (
      <div className={this.styles.appComponent}>
        {this._renderSubcomponent(this.props.state.currentStep)}
        <Chart
          data={this.props.state.chartData}
          options={this.props.state.chartOptions}
          metadata={this.props.state.chartMetadata}
        />
        <SaveChart state={this.props.state} />
      </div>
    );
  }
}

ChartBuilder.propTypes = {
  state: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection
export default connect()(ChartBuilder);
