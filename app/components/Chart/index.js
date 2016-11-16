import React, { Component } from 'react';
import chartTypeLoader from '../../utils/chartTypeLoader';
import RuledBox from '../lib/RuledBox';
import { getChartTypeObject } from '../../utils/chartTypeUtils';
import update from 'react-addons-update';

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

  _getActiveDimensions(breakpoints) {
    if (undefined === breakpoints ||
      !breakpoints.values ||
      !breakpoints.values.length
    ) {
      /**
       * @todo Real default value here!
       */
      return { width: 395, height: 415 };
    }

    const idx = breakpoints.hasOwnProperty('active') ? breakpoints.active : 0;
    return {
      width: breakpoints.values[idx].maxWidth,
      height: breakpoints.values[idx].height,
    };
  }

  render() {
    if (!this.state.chartTypeComponent) {
      return null;
    }

    const activeDimensions = this._getActiveDimensions(
      this.props.options.breakpoints);

    const chartTypeComponent = React.createElement(
      this.state.chartTypeComponent,
      update(this.props, {
        ref: { $set: 'chartTypeComponent' },
        options: {
          height: { $set: activeDimensions.height },
        },
      })
    );

    return React.createElement(
      this.props.rulers ? RuledBox : 'div', // element type
      this.props.rulers ? activeDimensions : {}, // props
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
