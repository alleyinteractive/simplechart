import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from '../Chart/';
import ChartMetadata from '../ChartMetadata/';
import PalettePicker from '../PalettePicker/';
import SaveChart from '../SaveChart/';
import { appComponent } from '../../css/components.css';

class ChartBuilder extends Component {

  render() {
    return (
      <div className={appComponent}>
        <ChartMetadata metadata={this.props.state.chartMetadata} />
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
