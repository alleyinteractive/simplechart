/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import PreviewImage from '../PreviewImage';
import renderPreviewImage from '../../utils/chartToPng';

class SaveChart extends Component {
  constructor() {
    super();
    this._sendToParent = this._sendToParent.bind(this);
    this._sendMessageWithImageSrc = this._sendMessageWithImageSrc.bind(this);
    this.state = {};
  }

  _sendToParent() {
    const chartEl = document.getElementsByClassName('nv-chart')[0];
    const canvasEl = document.getElementById('canvas');
    const previewEl = document.getElementById('png-preview');

    canvasEl.setAttribute('width', chartEl.offsetWidth);
    canvasEl.setAttribute('height', chartEl.offsetHeight);

    // render image then send everything to parent window
    previewEl.onload = this._sendMessageWithImageSrc(previewEl.src);
    renderPreviewImage(chartEl, canvasEl, previewEl);
  }

  _sendMessageWithImageSrc(imageSrc) {
    const saveData = update(this.props.state, { $apply: (state) =>
      ({
        rawData: state.rawData,
        chartData: state.chartData,
        chartMetadata: state.chartMetadata,
        chartOptions: state.chartOptions,
        previewImg: imageSrc,
      }),
    });

    /**
     * @todo send postMessage to parent window
     */
    console.log(saveData);

    this.setState({ sent: true });
  }

  render() {
    return (
      <div>
        <button onClick={this._sendToParent}>
          Save Chart
        </button>
        <span>
          {this.state.sent ?
            'Chart saved!' :
            ''
          }
        </span>
        <PreviewImage />
      </div>
    );
  }
}

SaveChart.propTypes = {
  state: React.PropTypes.object,
};

export default connect()(SaveChart);
