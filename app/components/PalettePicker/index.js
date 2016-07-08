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
import * as styles from './PalettePicker.css';

class PalettePicker extends Component {
  constructor() {
    super();
    this._getSeriesNames = this._getSeriesNames.bind(this);
    this._seriesChange = this._seriesChange.bind(this);
    this._pickerChange = this._pickerChange.bind(this);
    this._setOriginalColors = this._setOriginalColors.bind(this);
    this._handleProps = this._handleProps.bind(this);

    this.state = {
      seriesNames: [],
      currentSeries: 0,
      originalColors: [],
    };
  }

  componentWillMount() {
    this._handleProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._handleProps(nextProps);
  }

  _handleProps(props) {
    this.setState({
      seriesNames: this._getSeriesNames(props),
      colors: props.options.color || null,
    });
    this._setOriginalColors(props);
  }

  // Set the original colors once then leave them alone
  _setOriginalColors(props) {
    if (
      !this.state.originalColors.length
      && props.options.color
      && props.options.color.length
    ) {
      this.setState({
        originalColors: update(props.options.color, { $merge: {} }),
      });
    }
  }

  _pickerChange() {
    // debouncing messes with the function args, so get current color this way
    const newColor = this.refs.picker.state.color.hex;

    // clone chart options object and update the data store
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

    // if key contains a non-alphanumeric char, it might have leading/trailing quotes
    // so strip those
    return props.data.map((series) =>
      /^"?(.*?)"?$/i.exec(series.key || series.label)[1]
    );
  }

  _seriesChange(evt) {
    const newValue = parseInt(evt.target.value, 10);
    if (isNaN(newValue)) {
      return;
    }

    this.setState({ currentSeries: newValue });

    // set the color picker's revert option to the original color for this data series
    if (this.state.originalColors) {
      const newOriginalValue = this.state.originalColors[newValue];
      this.refs.picker.setState({
        originalValue: newOriginalValue,
      });
    }
  }

  render() {
    if (!this.state.colors || !this.state.colors.length) {
      return (<span>Waiting for colors...</span>);
    }

    return (
      <div>
        <select onChange={this._seriesChange} >
          {this.state.seriesNames.map((name, index) =>
            (<option key={index} value={index}>{name}</option>)
          )}
        </select>
        <div className={styles.colorpickr}>
          {React.createElement(ColorPicker, {
            value: this.state.colors[this.state.currentSeries],
            onChange: debounce(this._pickerChange, 200),
            ref: 'picker',
          })}
        </div>
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
