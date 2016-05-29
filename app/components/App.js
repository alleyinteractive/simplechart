import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from './Chart';
import '../css/base.css';

class App extends Component {

  render() {
    return (
      <div>
        <Chart data={this.props.data} />
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
