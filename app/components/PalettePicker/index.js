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
    this._getSeriesNames = this._getSeriesNames.bind(this);
    this._seriesChange = this._seriesChange.bind(this);
    this._pickerChange = this._pickerChange.bind(this);

    this.state = {
      seriesNames: [],
      currentSeries: 0,
    };
  }

  componentWillMount() {
    this.setState({
      seriesNames: this._getSeriesNames(this.props),
      colors: this.props.options.color || null,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      seriesNames: this._getSeriesNames(nextProps),
      colors: this.props.options.color || null,
    });
  }

  _pickerChange() {
    // debouncing messes with the function args, so get current color this way
    const newColor = this.refs.picker.state.color.hex;
    const options = update(this.props.options, { $merge: {} });
    if (options.color && options.color[this.state.currentSeries]) {
      options.color[this.state.currentSeries] = `#${newColor}`;
      this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS, options));
    }
  }

  _getSeriesNames(props) {
    if (!props.data.length) {
      return [];
    }

    // if key contains a char like '/', it might have leading/trailing quotes
    // so strip those
    return props.data.map((series) =>
      /^"?(.*?)"?$/i.exec(series.key || series.label)[1]
    );
  }

  _seriesChange(evt) {
    this.setState({ currentSeries: evt.target.value });
  }

  render() {
    return (
      <div>
        <select onChange={this._seriesChange} >
          {this.state.seriesNames.map((name, index) =>
            (<option key={index} value={index}>{name}</option>)
          )}
        </select>
        {React.createElement(ColorPicker, {
          value: this.state.colors[this.state.currentSeries],
          onChange: debounce(this._pickerChange, 200),
          reset: false,
          ref: 'picker',
        })}
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
