import Legend from 'britecharts/src/charts/legend';
import StackedAreaChart from 'britecharts/src/charts/stacked-area';
import Tooltip from 'britecharts/src/charts/Tooltip';
import * as d3Selection from 'd3-selection';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getD3TimeFormat } from '../../../../utils/parseDate';
import '!!style-loader!raw-loader!britecharts/dist/css/britecharts.css';

class BritechartsAdapter extends Component {
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
    const { data, options, timeFormat } = this.props;
    const { width, height, color, type, xAxis, yAxis, showLegend } = options;

    const chartContainer = d3Selection.select(this.chartRef);
    const chartWidth = width ||
      chartContainer.node().getBoundingClientRect().width;

    const xAxisLabel = xAxis ? xAxis.axisLabel : undefined;
    const chart = new this.chartMap[type]();

    // TODO: Figure out correct color pallete mapping
    // TODO: Figure out data format
    chart
      .grid('horizontal')
      .width(chartWidth)
      .height(height)
      .colorSchema(color);

    if (timeFormat) {
      chart
        .forceAxisFormat('custom')
        .forcedXFormat(timeFormat);
    }

    // Labels only available for Stepchart
    // https://github.com/eventbrite/britecharts/issues/120
    if (xAxisLabel) {
      chart.xAxisLabel(xAxisLabel);
    }

    if (yAxis) {
      chart.yAxisLabel(yAxis.axisLabel);
    }

    chartContainer.datum(data).call(chart);

    this._renderTooltip(chartContainer, chart, xAxisLabel);

    if (showLegend) {
      this._renderLegend(chartWidth);
    }
  }

  _renderTooltip(chartContainer, chart, title = 'Values') {
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
    const { data, options } = this.props;
    const { height, color, mapLegendData } = options;
    const legendContainer = d3Selection.select(this.legendRef);
    const chartLegend = new Legend();

    chartLegend
      .width(chartWidth * 0.8)
      .height(height * 0.5)
      .colorSchema(color);

    legendContainer.datum(mapLegendData(data)).call(chartLegend);
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
          key={Math.random()}
          ref={this._setLegendRef}
          className="britechart-legend-container"
        />
      </div>
    );
  }
}

BritechartsAdapter.propTypes = {
  data: React.PropTypes.array,
  timeFormat: React.PropTypes.string,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};

function mapStateToProps(state) {
  return {
    timeFormat: getD3TimeFormat(state.dateFormat.formatString),
  };
}

export default connect(mapStateToProps)(BritechartsAdapter);
