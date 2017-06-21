import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from './Chart';

class Widget extends Component {
  static renderMetadata(widget, metadata) {
    Object.keys(metadata).forEach((key) => {
      const el = widget.querySelectorAll(`.simplechart-${key}`);
      if (!el.length) {
        return;
      }
      el[0].innerText = metadata[key];
    });
  }

  constructor(props) {
    super(props);
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
    if (this.node) {
      widget = this.node.parentElement.parentElement;
    } else {
      return;
    }

    if (this.state.data) {
      Widget.renderMetadata(widget, this.state.data.metadata || {});
    }
  }

  renderChart = () => {
    if (this.state.data) {
      return (
        <Chart
          ref={(node) => {
            this.node = node;
          }}
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
  };

  render() {
    return (
      <div>
        {this.renderChart()}
      </div>
    );
  }
}

Widget.propTypes = {
  data: PropTypes.object.isRequired,
  widget: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
};

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(Widget);
