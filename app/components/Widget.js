import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from './Chart';
import ChartAnnotations from './ChartAnnotations';

class Widget extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    widget: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
  };

  static renderMetadata(widget, metadata) {
    Object.keys(metadata).forEach((key) => {
      let nodeList = widget.querySelectorAll(`.simplechart-${key}`);

      // Metakeys 'caption' and 'credit' were changed to
      // 'notes' and 'source' respectively.  This is to ensure current charts
      // render metadata correctly.
      let innerText = metadata[key];
      if ('credit' === key) {
        nodeList = widget.querySelectorAll('.simplechart-source');
        innerText = metadata.source ||
            metadata.credit.replace(/^[sS]ource[s]?:?/, '').trim();
      } else if ('caption' === key) {
        nodeList = widget.querySelectorAll('.simplechart-notes');
        innerText = metadata.notes || metadata.caption;
      }

      if (!nodeList.length) {
        return;
      }

      const [el] = nodeList;

      // Hide if no text for this metadata key
      if (!innerText.length) {
        el.style.display = 'none';
        if (el.parentElement.className.includes(el.className)) {
          el.parentElement.style.display = 'none';
        }
      }

      el.innerText = innerText;
    });
  }

  constructor(props) {
    super(props);
    this.defaultPlaceholder = 'Loading';
  }

  state = {
    data: null,
  };

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
        <div>
          <Chart
            data={this.state.data.data}
            options={this.state.data.options}
            metadata={this.state.data.metadata}
            widget={this.props.widget}
          />
          {
            this.state.data.options.annotations &&
            <ChartAnnotations
              {...this.state.data.annotations}
              widget={this.props.widget}
              type={this.state.data.options.type}
            />
          }
        </div>
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
      <div ref={(node) => {
        this.node = node;
      }}
      >
        {this.renderChart()}
      </div>
    );
  }
}

// Which props to inject from the global atomic state
export default connect((state) =>
  ({
    data: state,
  })
)(Widget);
