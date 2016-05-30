import React, { Component } from 'react';
import { connect } from 'react-redux';
// import DataInput from './DataInput';
// import ChartTypeSelector from './ChartTypeSelector';
// import ChartBuilder from './ChartBuilder';

class App extends Component {

  render() {
    return (
      <div>

      </div>
    );
  }
}

App.propTypes = {
  data: React.PropTypes.object,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(App);
