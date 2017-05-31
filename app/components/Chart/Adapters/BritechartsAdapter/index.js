import Legend from 'britecharts/src/charts/legend';
import StackedAreaChart from 'britecharts/src/charts/stacked-area';
import Tooltip from 'britecharts/src/charts/Tooltip';
import * as d3Selection from 'd3-selection';

import React, { Component } from 'react';
import '!!style-loader!raw-loader!britecharts/dist/css/britecharts.css';

export default class BritechartsAdapter extends Component {
  constructor(props) {
    super(props);

    this._renderChart = this._renderChart.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
    this._renderLegend = this._renderLegend.bind(this);
    this._setChartRef = this._setChartRef.bind(this);
    this._setLegendRef = this._setLegendRef.bind(this);

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
    console.log(this.props);
    const { data, options } = this.props;
    const { width, height, color, type, xAxis, yAxis, showLegend } = options;

    const chartContainer = d3Selection.select(this.chartRef);
    const chartWidth = width ||
      chartContainer.node().getBoundingClientRect().width;

    const xAxisLabel = xAxis ? xAxis.axisLabel : null;
    const chart = new this.chartMap[type]();

    // TODO: Figure out correct color pallete mapping
    // TODO: Figure out data format
    // TODO: Legend
    chart
      .grid('horizontal')
      .width(chartWidth)
      .height(height)
      .colorSchema(color);

    // TODO: Map dateFormat.formatString, if available, to d3TimeString, and apply it to XFormat.
    // chart
    //   .forceAxisFormat('custom')
    //   .forcedXFormat('%Y')

    // Labels only available for Stepchart
    // https://github.com/eventbrite/britecharts/issues/120
    if (xAxisLabel) {
      chart.xAxisLabel(xAxisLabel);
    }

    if (yAxis) {
      chart.yAxisLabel(yAxis.axisLabel);
    }

    chartContainer.datum(data).call(chart);

    this._renderTooltip(chartContainer, chart, xAxisLabel || 'Values');

    if (showLegend) {
      this._renderLegend(chartWidth);
    }
  }

  _renderTooltip(chartContainer, chart, title) {
    const chartTooltip = new Tooltip();

    chart
      .on('customMouseOver', chartTooltip.show)
      .on('customMouseMove', chartTooltip.update)
      .on('customMouseOut', chartTooltip.hide);

    chartTooltip
      .topicLabel('values')
      .title(title);

    chartContainer
      .select('.metadata-group .vertical-marker-container')
      .datum([]).call(chartTooltip);
  }

  _renderLegend(chartWidth) {
    const { data, options: { height, color } } = this.props;
    const legendContainer = d3Selection.select(this.legendRef);
    const chartLegend = new Legend();

    chartLegend
      .width(chartWidth * 0.8)
      .height(height)
      .colorSchema(color);

    // TODO: The legend data needs to be structured correctly.
    legendContainer.datum(data).call(chartLegend);
  }

  _setChartRef(ref) {
    this.chartRef = ref;
  }

  _setLegendRef(ref) {
    this.legendRef = ref;
  }

  render() {
    // Key prop is for forcing re-render of the chart when props change.
    return (
      <div>
        <div
          key={Math.random()}
          ref={this._setChartRef}
          className="britechart-chart-container"
        />
        <div
          ref={this._setLegendRef}
          className="britechart-legend-container"
        />
      </div>
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
