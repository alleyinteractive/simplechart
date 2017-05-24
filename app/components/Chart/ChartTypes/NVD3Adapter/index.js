import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';
import cloneDeep from 'lodash/cloneDeep';
import { getChartTypeObject } from '../../../../utils/chartTypeUtils';
import { nvd3Defaults } from '../../../../constants/chartTypes';
import applyTickFormatters from '../../../../middleware/utils/applyTickFormatters';
import { shouldSetupYDomain } from '../../../../middleware/utils/applyYDomain';
import getNiceDomain from '../../../../utils/dataFormats/getRangeDomain';

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
    let nextState = update(options, {
      datum: { $set: this._dataTransform(options.type, data) },
      ref: { $set: 'chartNode' },
    });

    if (!widget) {
      return nextState;
    }

    // Widgets need to recreate function-based options
    const typeConfig = getChartTypeObject(options.type).config;

    nextState = update(nextState, {
      x: { $set: nvd3Defaults[typeConfig.dataFormat].x },
      y: { $set: nvd3Defaults[typeConfig.dataFormat].y },
      yDomain: { $apply: (oldYDomain) => { // eslint-disable-line arrow-body-style
        return (shouldSetupYDomain(typeConfig) && undefined === oldYDomain) ?
          getNiceDomain(typeConfig.dataFormat, data) : oldYDomain;
      } },
    });

    // tickFormatSettings -> tick formatting functions
    // applyTickFormatters() returns a cloned object
    return applyTickFormatters(nextState, typeConfig);
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
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};
