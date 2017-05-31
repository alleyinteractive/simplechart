import StackedAreaChart from 'britecharts/dist/umd/stacked-area.min';
import * as d3Selection from 'd3-selection';

import React, { Component } from 'react';
import '!!style-loader!raw-loader!britecharts/dist/css/britecharts.css';

export default class BritechartsAdapter extends Component {
  constructor(props) {
    super(props);

    this._renderChart = this._renderChart.bind(this);
    this._setContainer = this._setContainer.bind(this);

    this.chartMap = {
      stackedAreaChart: StackedAreaChart,
    };
  }

  componentDidMount() {
    this._renderChart();
  }

  shouldComponentUpdate(nextProps) {
    return !!this.chartMap[nextProps.options.type];
  }

  componentDidUpdate() {
    this._renderChart();
  }

  _renderChart() {
    const { data, options: { width, height, color, type } } = this.props;

    const container = d3Selection.select(this.container);
    const chart = new this.chartMap[type]();
    const isContainerReady = !!container.node();

    let chartWidth = width;
    if (!chartWidth && isContainerReady) {
      chartWidth = container.node().getBoundingClientRect().width;
    }

    if (isContainerReady) {
      chart
        .grid('horizontal')
        .width(chartWidth)
        .height(height)
        .colorSchema(color);
    }

    container.datum(data).call(chart);
  }

  _setContainer(container) {
    this.container = container;
  }

  render() {
    return (
      <div
        ref={this._setContainer}
        className="britechart-chart-container"
      />
    );
  }
}

BritechartsAdapter.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};
