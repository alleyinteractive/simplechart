import React from 'react';
import { connect } from 'react-redux';
import Chart from '../Chart/';
import PalettePicker from '../PalettePicker/';
import SaveChart from '../SaveChart/';
import AppComponent from '../Layout/AppComponent';

class ChartBuilder extends AppComponent {

  render() {
    return (
      <div className={this.styles.appComponent}>
        <PalettePicker
          data={this.props.state.chartData}
          options={this.props.state.chartOptions}
        />
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
