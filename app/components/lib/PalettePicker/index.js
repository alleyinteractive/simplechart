import React, { Component } from 'react';
import { connect } from 'react-redux';
// Use Mapbox's colorpickr component
import ColorPicker from '@mapbox/react-colorpickr';
import 'style-loader!raw-loader!@mapbox/react-colorpickr/dist/colorpickr.css';
import { debounce, loopArrayItemAtIndex } from '../../../utils/misc';
import update from 'immutability-helper';
import { RECEIVE_CHART_OPTIONS } from '../../../constants';
import actionTrigger from '../../../actions';
import * as styles from './PalettePicker.css';
import { Select } from 'rebass';

class PalettePicker extends Component {
  constructor() {
    super();
    this._seriesChange = this._seriesChange.bind(this);
    this._pickerChange = this._pickerChange.bind(this);
    this._handleProps = this._handleProps.bind(this);
    this.state = {
      data: [], // label, current, original for each data series
      selectedIdx: 0, // current selected series in the picker
      defaultPalette: [], // original received palette
    };
  }

  componentWillMount() {
    this._handleProps(this.props, true);
    this.setState({ defaultPalette: this.props.palette });
  }

  componentWillReceiveProps(nextProps) {
    this._handleProps(nextProps);
  }

 /**
  * Build/rebuild state.data array when props are received
  */
  _handleProps(props, setOriginal = false) {
    this.setState({
      data: props.data.map((series, idx) => {
        const seriesColor = loopArrayItemAtIndex(idx, props.palette);
        // Setup series label and current color
        const seriesForState = {
          label: this._getSeriesName(series),
          current: seriesColor,
        };

        // set original color that we can revert back to
        if (setOriginal || !this.state.data[idx].original) {
          seriesForState.original = seriesColor;
        } else {
          seriesForState.original = this.state.data[idx].original;
        }
        return seriesForState;
      }),
    });
  }

  /**
   * Keys containing non-alphanumeric characters might be enclosed in double quotes
   * so we just strip those.
   */
  _getSeriesName(series) {
    return /^"?(.*?)"?$/i.exec(series.key || series.label)[1];
  }

  /**
   * Handle when a new color is selected in the picker
   */
  _pickerChange() {
    // debouncing messes with the function args, so get current color this way
    const newColor = `#${this.refs.picker.state.color.hex}`;
    let paletteArray = this.state.data.map(({ current }) => current);
    paletteArray = update(paletteArray, {
      [this.state.selectedIdx]: { $set: newColor },
    });

    // If there are more colors in the default palette than there are data series,
    // splice new array into default palette so we don't lose any
    if (this.state.defaultPalette.length > paletteArray.length) {
      paletteArray = paletteArray.concat(update(this.state.defaultPalette, {
        $splice: [[0, paletteArray.length]],
      }));
    }

    this.props.dispatch(actionTrigger(
      RECEIVE_CHART_OPTIONS,
      { color: paletteArray },
      'PalettePicker'
    ));
  }

  /**
   * Handle when a new series is selected in the dropdown
   */
  _seriesChange(evt) {
    const newValue = parseInt(evt.target.value, 10);
    if (isNaN(newValue)) {
      return;
    }

    this.setState({ selectedIdx: newValue });

    // set the color picker's revert option to the original color for this data series
    if (this.state.data[newValue].original) {
      this.refs.picker.setState({
        originalValue: this.state.data[newValue].original,
      });
    }
  }

  render() {
    if (!this.state.data || !this.state.data.length) {
      return (<span>Waiting for colors...</span>);
    }

    return (
      <div>
        <Select
          label="Select data series"
          name="selectDataSeries"
          options={this.state.data.map((item, idx) =>
            ({ children: item.label, value: idx })
          )}
          onChange={this._seriesChange}
        />
        <div className={styles.colorpickr}>
          <ColorPicker
            value={this.state.data[this.state.selectedIdx].current}
            onChange={debounce(this._pickerChange, 200)}
            ref="picker"
          />
        </div>
      </div>
    );
  }
}

PalettePicker.propTypes = {
  palette: React.PropTypes.array,
  data: React.PropTypes.array,
  dispatch: React.PropTypes.func,
};

// Redux connection
export default connect()(PalettePicker);
