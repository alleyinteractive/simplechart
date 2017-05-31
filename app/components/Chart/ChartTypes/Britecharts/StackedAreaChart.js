import StackedArea from 'britecharts/dist/umd/stacked-area.min';
import d3Selection from 'd3-selection';

import React, { Component } from 'react';
import '!!style-loader!css-loader!britecharts/dist/css/common/common.css';
import '!!style-loader!css-loader!britecharts/dist/css/charts/line.css';

export default class StackedAreaChart extends Component {
  constructor(props) {
    super(props);

    this._setContainer = this._setContainer.bind(this);
    this._mapProps = this._mapProps.bind(this);
  }

  componentDidUpdate() {
    const container = d3Selection.select(this.container);
    const { colorSchema, datum, height, width } = this._mapProps(container);

    const chart = new StackedArea();

    if (container.node()) {
      chart
        .isAnimated(true)
        .grid('horizontal')
        .width(width)
        .height(height)
        .colorSchema(colorSchema);
    }

    container.datum(datum).call(chart);
  }

  _setContainer(container) {
    this.container = container;
  }

  _mapProps(container) {
    const { options, data } = this.props;

    let width = options.width;
    if (!width && container.node()) {
      width = container.node().getBoundingClientRect().width;
    }

    const datum = data.map((point) => ({
      date: point.x,
      name: point.key,
      value: point.y,
    }));

    return {
      colorSchema: options.color,
      datum,
      height: options.height,
      width,
    };
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

StackedAreaChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};
