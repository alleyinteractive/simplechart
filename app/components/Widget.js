import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from './Chart';
import ReactDOM from 'react-dom';

class Widget extends Component {
  constructor() {
    super();
    this._renderChart = this._renderChart.bind(this);
  }

  componentDidUpdate() {
    let widget;
    try {
      widget = ReactDOM.findDOMNode(this).parentElement.parentElement;
    } catch (err) {
      return;
    }
    this._renderMetadata(widget,
      this.props.data.data[this.props.widget].metadata);
  }

  _renderMetadata(widget, metadata) {
    Object.keys(metadata).forEach((key) => {
      const el = widget.querySelectorAll(`.simplechart-${key}`);
      if (!el.length) {
        return;
      }
      el[0].innerText = metadata[key];
    });
  }

  _renderChart() {
    if (this.props.data.data[this.props.widget] &&
      this.props.data.data[this.props.widget].options
    ) {
      return (
        <Chart
          data={this.props.data.data[this.props.widget].data}
          options={this.props.data.data[this.props.widget].options}
          metadata={this.props.data.data[this.props.widget].metadata}
          widget={this.props.widget}
        />
      );
    }
    return (
      <span className="simplechart-loading">Loading</span>
    );
  }

  render() {
    return (
      <div>
        {this._renderChart()}
      </div>
    );
  }
}

Widget.propTypes = {
  data: React.PropTypes.object,
  widget: React.PropTypes.string,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(Widget);
