import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import chartTypeLoader from '../../utils/chartTypeLoader';
import RuledBox from '../lib/RuledBox';
import { getChartTypeObject } from '../../utils/chartTypeUtils';
import { defaultBreakpoint } from '../../constants/chartTypes';
import { debounce, ownsProperties } from '../../utils/misc';
import actionTrigger from '../../actions';
import { RECEIVE_CHART_READY } from '../../constants';

import './Chart.css';

class Chart extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    rulers: PropTypes.bool,
    widget: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    rulers: false,
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

    const idx = ownsProperties(breakpoints, ['active']) ? breakpoints.active : 0;
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
   * Attach listener for breakpoints and tooltip modification observer
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

    const touchStartHandler = (event) => {
      const tooltip = document.querySelector('.nvtooltip');
      if (tooltip.contains(event.target)) {
        event.preventDefault();
      }
      if (tooltip) {
        tooltip.style.opacity = 0;
        tooltip.style.pointerEvents = 'none';
      }
    };

    const attributeObserver = new MutationObserver((mutations) => {
      let switchedOpacity = false;
      mutations.forEach((mutation, idx) => {
        // If the tooltip is going invisible, remove the event listener on touchend
        if (mutation.oldValue.match(/opacity: 1/) &&
          '0' === mutation.target.style.opacity) {
          switchedOpacity = true;
          document.removeEventListener('touchstart', touchStartHandler);
        } else if (mutation.oldValue.match(/opacity: 0/) &&
          '1' === mutation.target.style.opacity) {
          switchedOpacity = true;
          // Tooltip is going visible, add the event listener back
          document.addEventListener('touchstart', touchStartHandler);
          mutation.target.style.pointerEvents = 'all'; // eslint-disable-line no-param-reassign
        }

        // Only add the visual cue on the last of the mutations in a set; it
        // gets erased otherwise.
        if (idx === mutations.length - 1 &&
          switchedOpacity &&
          '1' === mutation.target.style.opacity) {
          // Add a visual cue to show that this can be closed by clicking anywhere
          const closeOut = document.createElement('button');
          closeOut.className = 'close-out';
          closeOut.textContent = 'X';
          closeOut.setAttribute('aria-label', 'Close Tooltip');
          closeOut.onclick = touchStartHandler;

          // Set timeout on adding button to avoid race condition on dom modification
          mutation.target.appendChild(closeOut);
        }
      });
    });

    const attributeObserverOptions = {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true,
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if ('childList' === mutation.type) {
          const firstAdded = mutation.addedNodes[0];
          // Check if this is the mutation where the tooltip is added to the dom
          if (firstAdded && firstAdded.classList.contains('nvtooltip')) {
            // Add an event listener for touchstart to the page to close the tooltip
            document.addEventListener('touchstart', touchStartHandler);

            // Add an additional non-passive event listener to the tooltip itself
            // This is so that we can prevent default (and thus scrolling or display of
            // another tooltip) when someone touches the tooltip directly.
            firstAdded.addEventListener('touchstart', touchStartHandler, { passive: false });

            // Set up the attribute observer
            attributeObserver.observe(firstAdded, attributeObserverOptions);
          }
        }
      });
    });
    observer.observe(document.querySelector('html'), {
      childList: true,
    });
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

    this.props.dispatch(actionTrigger(RECEIVE_CHART_READY, false));
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

export default connect()(Chart);
