import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { Select } from 'rebass';
// Use Mapbox's colorpickr component
import ColorPicker from '@mapbox/react-colorpickr';
import '@mapbox/react-colorpickr/dist/colorpickr.css';
import { debounce, loopArrayItemAtIndex } from '../../../utils/misc';
import { RECEIVE_CHART_OPTIONS } from '../../../constants';
import actionTrigger from '../../../actions';
import * as styles from './PalettePicker.css';

class PalettePicker extends Component {
  static propTypes = {
    palette: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired, // eslint-disable-line react/no-unused-prop-types
    dispatch: PropTypes.func.isRequired,
  };

  /**
   * Keys containing non-alphanumeric characters might be enclosed in double quotes
   * so we just strip those.
   */
  static getSeriesName(series) {
    return /^"?(.*?)"?$/i.exec(series.key || series.label)[1];
  }

  state = {
    data: [], // label, current, original for each data series
    selectedIdx: 0, // current selected series in the picker
    defaultPalette: [], // original received palette
  };

  componentWillMount() {
    this.handleProps(this.props, true);
    this.setState({ defaultPalette: this.props.palette });
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

 /**
  * Build/rebuild state.data array when props are received
  */
  handleProps = (props, setOriginal = false) => {
    this.setState({
      data: props.data.map((series, idx) => {
        const seriesColor = loopArrayItemAtIndex(idx, props.palette);
        // Setup series label and current color
        const seriesForState = {
          label: PalettePicker.getSeriesName(series),
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
  };

  /**
   * Handle when a new color is selected in the picker
   */
  pickerChange = () => {
    // debouncing messes with the function args, so get current color this way
    const newColor = `#${this.picker.state.color.hex}`;
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
  };

  /**
   * Handle when a new series is selected in the dropdown
   */
  seriesChange = (evt) => {
    const newValue = parseInt(evt.target.value, 10);
    if (isNaN(newValue)) {
      return;
    }

    this.setState({ selectedIdx: newValue });

    // set the color picker's revert option to the original color for this data series
    if (this.state.data[newValue].original) {
      this.picker.setState({
        originalValue: this.state.data[newValue].original,
      });
    }
  };

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
          onChange={this.seriesChange}
        />
        <div className={styles.colorpickr}>
          <ColorPicker
            value={this.state.data[this.state.selectedIdx].current}
            onChange={debounce(this.pickerChange, 200)}
            ref={(picker) => {
              this.picker = picker;
            }}
          />
        </div>
      </div>
    );
  }
}

// Redux connection
export default connect()(PalettePicker);
