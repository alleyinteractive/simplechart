import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from './Chart';
import ReactDOM from 'react-dom';

class Widget extends Component {
  constructor() {
    super();
    this._renderChart = this._renderChart.bind(this);
    this.state = {
      data: null,
    };
    this.defaultPlaceholder = 'Loading';
  }

  componentWillMount() {
    if (this.props.data.data[this.props.widget]) {
      this.setState({ data: this.props.data.data[this.props.widget] });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.data[nextProps.widget]) {
      this.setState({ data: nextProps.data.data[nextProps.widget] });
    }
  }

  componentDidUpdate() {
    let widget;
    try {
      widget = ReactDOM.findDOMNode(this).parentElement.parentElement;
    } catch (err) {
      return;
    }
    if (this.state.data) {
      this._renderMetadata(widget, this.state.data.metadata || {});
    }
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
    if (this.state.data) {
      return (
        <Chart
          data={this.state.data.data}
          options={this.state.data.options}
          metadata={this.state.data.metadata}
          widget={this.props.widget}
        />
      );
    }
    return (
      <span className="simplechart-loading">
        {this.props.placeholder || this.defaultPlaceholder}
      </span>
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
  data: PropTypes.object,
  widget: PropTypes.string,
  placeholder: PropTypes.string,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(Widget);
