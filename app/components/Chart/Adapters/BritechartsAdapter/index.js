import * as britecharts from 'britecharts';
import * as d3Selection from 'd3-selection';

import React, { Component } from 'react';
import '!!style-loader!raw-loader!britecharts/dist/css/britecharts.css';

export default class BriteChartsAdapter extends Component {
  constructor(props) {
    super(props);

    this._setContainer = this._setContainer.bind(this);
    this._mapProps = this._mapProps.bind(this);

    this.chartMap = {
      stackedArea: britecharts.stackedArea,
    };
  }

  componentDidUpdate() {
    const container = d3Selection.select(this.container);
    const chart = this.chartMap[this.props.options.type];
    const { colorSchema, datum, height, width } = this._mapProps(container);

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

    // TODO: forceXAxis, forceYAxis
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

BriteChartsAdapter.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};
