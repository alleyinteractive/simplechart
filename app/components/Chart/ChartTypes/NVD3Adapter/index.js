import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NVD3Chart from 'react-nvd3';
import update from 'immutability-helper';
import cloneDeep from 'lodash/cloneDeep';
import {
  getChartTypeObject,
  getChartTypeDefaultOpts,
  getNvd3Type,
} from '../../../../utils/chartTypeUtils';
import applyYDomain from '../../../../reducers/utils/applyYDomain.js';
import applyTickFormatters from '../../../../reducers/utils/applyTickFormatters';
import './nvd3Styles.css';

export default class NVD3Adapter extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    widget: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  };

  static defaultProps = {
    widget: false,
  };

  /**
   * Apply any special formatting specfic to a chart type
   */
  static dataTransform(chartType, data) {
    switch (chartType) {
      case 'discreteBarChart':
        return [{
          key: '',
          values: data,
        }];

      default:
        return data;
    }
  }

  /**
   * Set up click listener for stacked area
   */
  static onReady(chart) {
    if (this.type && 'stackedAreaChart' === this.type && chart.stacked) {
      chart.stacked.dispatch.on('areaClick.toggle', null);
    }
  }

  /**
   * In editor, merge data into options and add a ref
   * In widget, also recreate function-based options that can't be sent as JSON
   */
  mapToChartProps = () => {
    const { options, data, widget } = this.props;
    const type = getNvd3Type(options.type);
    let chartProps = update(options, {
      type: { $set: type },
      datum: { $set: NVD3Adapter.dataTransform(options.type, data) },
      ref: { $set: 'chartNode' },
    });

    if (!widget) {
      return chartProps;
    }

    // TODO: This isn't an ideal place for this logic, and it's also duplicated within middleware/reducers.
    // Widgets need to recreate function-based options
    const typeConfig = getChartTypeObject(options.type).config;
    const defaultOpts = getChartTypeDefaultOpts(options.type);
    chartProps = Object.assign(
      {}, defaultOpts, chartProps, typeConfig, { type }
    );
    chartProps = applyYDomain(chartProps, typeConfig, data);

    return applyTickFormatters(chartProps, typeConfig);
  };

  render() {
    // We clone the props, because nvd3 will mutate the datum that you pass to it.
    const chartProps = cloneDeep(this.mapToChartProps());

    // Key prop is for forcing re-render of the chart to avoid chart refresh issue when the chart type changes.
    // https://github.com/NuCivic/react-nvd3/issues/59
    return (<NVD3Chart
      key={Math.random()}
      ready={NVD3Adapter.onReady}
      {...chartProps}
    />);
  }
}
