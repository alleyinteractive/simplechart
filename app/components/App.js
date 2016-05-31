import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataInput from './DataInput';
// import ChartTypeSelector from './ChartTypeSelector';
// import ChartBuilder from './ChartBuilder';

class App extends Component {

  render() {
    return (
      <div>
        <DataInput
          rawData={this.props.state.rawData}
          dataStatus={this.props.state.dataSatus}
        />
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
