import React, { Component } from 'react';
import chartTypeLoader from '../../utils/chartTypeLoader';
import RuledBox from '../lib/RuledBox';
import { getChartTypeObject } from '../../utils/chartTypeUtils';
import update from 'react-addons-update';
import { defaultBreakpoint } from '../../constants/chartTypes';

class Chart extends Component {

  constructor() {
    super();
    this._loadChartType = this._loadChartType.bind(this);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.options.type) {
      this._loadChartType(this.props.options.type);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this._getComponentName(nextProps) !== this._getComponentName(this.props)) { // eslint-disable-line max-len
      this._loadChartType(nextProps.options.type);
    }
  }

  _getComponentName(props) {
    return getChartTypeObject(props.options.type).config.componentName;
  }

  _loadChartType(type) {
    chartTypeLoader(getChartTypeObject(type).config.componentName)
      .then((component) => {
        this.setState({ chartTypeComponent: component });
      });
  }

  _getActiveBreakpoint(breakpoints) {
    if (undefined === breakpoints ||
      !breakpoints.values ||
      !breakpoints.values.length
    ) {
      return defaultBreakpoint;
    }

    const idx = breakpoints.hasOwnProperty('active') ? breakpoints.active : 0;
    return breakpoints.values[idx] || defaultBreakpoint;
  }

  /**
   * Setting width or height to -1 will hide that ruler and
   * prevent inline CSS from fixing the box's width/height
   */
  _ruledBoxProps(breakpoint) {
    const bpHasNoMaxWidth = breakpoint.noMaxWidth || !breakpoint.maxWidth;
    return {
      width: bpHasNoMaxWidth ? -1 : breakpoint.maxWidth,
      height: (!breakpoint.height) ? -1 : breakpoint.height,
    };
  }

  render() {
    if (!this.state.chartTypeComponent) {
      return null;
    }

    const activeBp = this._getActiveBreakpoint(this.props.options.breakpoints);

    const chartTypeComponent = React.createElement(
      this.state.chartTypeComponent,
      update(this.props, {
        options: { height: { $set: activeBp.height } },
      })
    );

    return React.createElement(
      this.props.rulers ? RuledBox : 'div', // element type
      this.props.rulers ? this._ruledBoxProps(activeBp) : {}, // props
      chartTypeComponent // children
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  rulers: React.PropTypes.bool,
  widget: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool,
  ]),
};

export default Chart;
