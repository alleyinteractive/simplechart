/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Use Mapbox's colorpickr component
import ColorPicker from 'react-colorpickr';
import * as ColorPickrStyles
  from 'style!raw!react-colorpickr/dist/colorpickr.css';
import { debounce } from '../../utils/misc';
import update from 'react-addons-update';
import { RECEIVE_CHART_OPTIONS } from '../../constants';
import actionTrigger from '../../actions';

class PalettePicker extends Component {
  constructor() {
    super();
    this._mapDataSwatches = this._mapDataSwatches.bind(this);
    this.state = {
      map: [],
    };
  }

  componentWillMount() {
    this.setState({ map: this._mapDataSwatches(this.props) });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ map: this._mapDataSwatches(nextProps) });
  }

  onChange(key) {
    const newColor = this.refs[`picker${key}`].state.color.hex;
    const options = update(this.props.options, { $merge: {} });
    if (options.color && options.color.length > key) {
      options.color[key] = `#${newColor}`;
      this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, options));
    }
  }

  _mapDataSwatches(props) {
    if (!props.data.length || !props.options.color) {
      return [];
    }

    // Setup map of
    const map = [];
    function setMap(series, index) {
      // if key contains a char like '/', it might have leading/trailing quotes
      // so strip those
      const key = /^"?(.*?)"?$/i.exec(series.key || series.label)[1];
      map.push({ key, color: props.options.color[index] });
    }
    props.data.forEach((series, index) =>
      setMap(series, index)
    );
    return map;
  }

  render() {
    return (
      <div>
        {this.state.map.map((series, index) =>
          React.createElement(ColorPicker, {
            value: series.color,
            key: index,
            onChange: debounce(this.onChange.bind(this, index), 200),
            ref: `picker${index}`,
          })
        )}
      </div>
    );
  }
}

PalettePicker.propTypes = {
  options: React.PropTypes.object,
  data: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

// Redux connection
export default connect()(PalettePicker);
