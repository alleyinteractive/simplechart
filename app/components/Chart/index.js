import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import chartTypeLoader from '../../utils/chartTypeLoader';
import RuledBox from '../lib/RuledBox';
import { getChartTypeObject } from '../../utils/chartTypeUtils';
import { defaultBreakpoint } from '../../constants/chartTypes';
import { debounce } from '../../utils/misc';

class Chart extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    rulers: PropTypes.bool.isRequired,
    widget: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
  };

  /**
   * Setting width or height to -1 will hide that ruler and
   * prevent inline CSS from fixing the box's width/height
   */
  static ruledBoxProps(breakpoint) {
    const bpHasNoMaxWidth = breakpoint.noMaxWidth || !breakpoint.maxWidth;
    return {
      width: bpHasNoMaxWidth ? -1 : breakpoint.maxWidth,
      height: (!breakpoint.height) ? -1 : breakpoint.height,
    };
  }

  /**
   * Get breakpoint object for current window size
   * @param {array} breakpoints
   * @return object Item from breakpoints array
   */
  static breakpointForWindow(breakpoints) {
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
      // traverse to the smallest breakpoint
      .reduce((acc, current) => {
        if (current.noMaxWidth) {
          return current;
        }
        return current.maxWidth >= window.innerWidth ? current : acc;
      }, null);
  }

  static getActiveBreakpoint(breakpoints, isWidget) {
    if (undefined === breakpoints ||
      !breakpoints.values ||
      !breakpoints.values.length
    ) {
      return defaultBreakpoint;
    }

    if (isWidget) {
      return Chart.breakpointForWindow(breakpoints.values) || defaultBreakpoint;
    }

    const idx = breakpoints.active ? breakpoints.active : 0;
    return breakpoints.values[idx] || defaultBreakpoint;
  }

  static getComponentName(props) {
    return getChartTypeObject(props.options.type).config.componentName;
  }

  state = {};

  componentWillMount() {
    if (this.props.options.type) {
      this.loadChartType(this.props.options.type);
    }
    this.setState({
      activeBp: Chart.getActiveBreakpoint(
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
          activeBp: Chart.getActiveBreakpoint(
            this.props.options.breakpoints,
            this.props.widget
          ),
        });
      }, 150));
    }
  }

  componentWillReceiveProps(nextProps) {
    // handle if chart type changes
    if (
      Chart.getComponentName(nextProps) !== Chart.getComponentName(this.props)
    ) {
      this.loadChartType(nextProps.options.type);
    }

    // update breakpoint idx
    this.setState({
      activeBp: Chart.getActiveBreakpoint(
        nextProps.options.breakpoints,
        nextProps.widget
      ),
    });
  }

  loadChartType = (type) => {
    chartTypeLoader(getChartTypeObject(type).config.componentName)
      .then((component) => {
        this.setState({ chartTypeComponent: component });
      });
  };

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
      this.props.rulers ? Chart.ruledBoxProps(this.state.activeBp) : {}, // props

      chartTypeComponent // children
    );
  }
}

export default Chart;
