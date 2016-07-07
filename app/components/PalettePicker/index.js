import React, { Component } from 'react';
import { connect } from 'react-redux';
// Use Mapbox's colorpickr component
import ColorPicker from 'react-colorpickr';

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
        {this.state.map.map((series) =>
          (<p>{`${series.key} -> ${series.color}`}</p>)
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
