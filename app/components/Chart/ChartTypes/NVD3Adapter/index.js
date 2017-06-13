import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NVD3Chart from 'react-nvd3';
import update from 'immutability-helper';
import cloneDeep from 'lodash/cloneDeep';
import { getChartTypeObject, getChartTypeDefaultOpts } from '../../../../utils/chartTypeUtils';
import applyYDomain from '../../../../middleware/utils/applyYDomain.js';
import applyTickFormatters from '../../../../middleware/utils/applyTickFormatters';

export default class NVD3Adapter extends Component {
  constructor(props) {
    super(props);
    this._mapToChartProps = this._mapToChartProps.bind(this);
  }

  /**
   * In editor, merge data into options and add a ref
   * In widget, also recreate function-based options that can't be sent as JSON
   */
  _mapToChartProps() {
    const { options, data, widget } = this.props;
    let chartProps = update(options, {
      datum: { $set: this._dataTransform(options.type, data) },
      ref: { $set: 'chartNode' },
    });

    if (!widget) {
      return chartProps;
    }

    // TODO: This isn't an ideal place for this logic, and it's also duplicated within middleware/reducers.
    // Widgets need to recreate function-based options
    const typeConfig = getChartTypeObject(options.type).config;
    const defaultOpts = getChartTypeDefaultOpts(options.type);
    chartProps = Object.assign({}, chartProps, typeConfig, defaultOpts);
    chartProps = applyYDomain(chartProps, typeConfig, data);

    return applyTickFormatters(chartProps, typeConfig);
  }

  /**
   * Apply any special formatting specfic to a chart type
   */
  _dataTransform(chartType, data) {
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

  render() {
    // We clone the props, because nvd3 will mutate the datum that you pass to it.
    const chartProps = cloneDeep(this._mapToChartProps());

    // Key prop is for forcing re-render of the chart to avoid chart refresh issue when the chart type changes.
    // https://github.com/NuCivic/react-nvd3/issues/59
    return <NVD3Chart key={Math.random()} {...chartProps} />;
  }
}

NVD3Adapter.propTypes = {
  data: PropTypes.array,
  options: PropTypes.object,
  widget: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};
