import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from '../Chart/';
import ChartMetadata from '../ChartMetadata/';
import { appComponent } from '../../css/components.css';

class ChartBuilder extends Component {

  render() {
    return (
      <div className={appComponent}>
        <ChartMetadata metadata={this.props.metadata} />
        <Chart
          data={this.props.data}
          options={this.props.options}
        />
      </div>
    );
  }
}

ChartBuilder.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  metadata: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection
export default connect()(ChartBuilder);
