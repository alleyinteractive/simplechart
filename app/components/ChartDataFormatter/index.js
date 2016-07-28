import React, { Component } from 'react';
import { connect } from 'react-redux';

class ChartDataFormatter extends Component {
  componentWillMount() {
    this.setState({
      initial: {
        x: this.props.options.x || null,
        y: this.props.options.y || null,
      },
    });
  }

  render() {
    console.log(this.state.initial);
    return (
      <div>hi</div>
    );
  }
}

ChartDataFormatter.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(ChartDataFormatter);
