import React, { Component } from 'react';
import chartTypeLoader from '../../utils/chartTypeLoader';
import RuledBox from '../lib/RuledBox';
import { getChartTypeObject } from '../../utils/chartTypeUtils';
import update from 'react-addons-update';
import { defaultBreakpoint } from '../../constants/chartTypes';
import { debounce } from '../../utils/misc';

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
    this.setState({
      activeBp: this._getActiveBreakpoint(
        this.props.options.breakpoints,
        this.props.widget
      ),
    });
  }

  /**
   * Attach listener for breakpoints
   */
  componentDidMount() {
    if (this.props.widget && this.props.options.breakpoints) {
      window.addEventListener('resize', debounce(() => {
        this.setState({
          activeBp: this._getActiveBreakpoint(
            this.props.options.breakpoints,
            this.props.widget
          ),
        });
      }, 150));
    }
  }

  componentWillReceiveProps(nextProps) {
    // handle if chart type changes
    if (this._getComponentName(nextProps) !== this._getComponentName(this.props)) { // eslint-disable-line max-len
      this._loadChartType(nextProps.options.type);
    }

    // update breakpoint idx
    this.setState({
      activeBp: this._getActiveBreakpoint(
        nextProps.options.breakpoints,
        nextProps.widget
      ),
    });
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

  _getActiveBreakpoint(breakpoints, isWidget) {
    if (undefined === breakpoints ||
      !breakpoints.values ||
      !breakpoints.values.length
    ) {
      return defaultBreakpoint;
    }

    if (isWidget) {
      return this._breakpointForWindow(breakpoints.values) || defaultBreakpoint;
    }

    const idx = breakpoints.hasOwnProperty('active') ? breakpoints.active : 0;
    return breakpoints.values[idx] || defaultBreakpoint;
  }

  /**
   * Get breakpoint object for current window size
   * @param array breakpoints
   * @return object Item from breakpoints array
   */
  _breakpointForWindow(breakpoints) {
    // sort from highest to lowest, with "no max width" at the beginning
    return breakpoints
      .sort((prev, next) => {
        if (next.noMaxWidth) {
          return 1;
        } else if (prev.noMaxWidth) {
          return -1;
        }
        return next.maxWidth - prev.maxWidth;
      })
      .reduce((acc, current) => {
        if (current.noMaxWidth) {
          return current;
        }
        return current.maxWidth >= window.innerWidth ? current : acc;
      }, null);
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

    const chartTypeComponent = React.createElement(
      this.state.chartTypeComponent,
      update(this.props, {
        options: { height: { $set: this.state.activeBp.height } },
      })
    );
    return React.createElement(
      this.props.rulers ? RuledBox : 'div', // element type
      this.props.rulers ? this._ruledBoxProps(this.state.activeBp) : {}, // props
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
