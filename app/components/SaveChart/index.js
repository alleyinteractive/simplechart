/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import * as styles from './SaveChart.css';

class SaveChart extends Component {
  constructor() {
    super();
    this._renderPreviewImage = this._renderPreviewImage.bind(this);
    this._sendParentMessage = this._sendParentMessage.bind(this);
    this.state = {};
  }

  _sendParentMessage() {
    const saveData = update(this.props.state, { $apply: (state) =>
      ({
        rawData: state.rawData,
        chartData: state.chartData,
        chartMetadata: state.chartMetadata,
        chartOptions: state.chartOptions,
        previewImg: this.refs.pngPreview.src,
      }),
    });

    /**
     * @todo send postMessage to parent window
     */
    console.log(saveData);

    this.setState({ sent: true });
  }

  _svgToString(svgEl) {
    const copyEl = svgEl.cloneNode(true);
    const defs = document.createElement('defs');
    const appliedStyles = 'path.nv-line { fill:none; }';
    const style = document.createElement('style');
    const cdata = document.createTextNode(appliedStyles);

    copyEl.insertBefore(defs, copyEl.firstChild);
    style.setAttribute('type', 'text/css');
    style.appendChild(cdata);
    defs.appendChild(style);

    return new XMLSerializer().serializeToString(copyEl);
  }

  /**
   * h/t to https://bl.ocks.org/biovisualize/8187844
   */
  _renderPreviewImage() {
    // Set up elements and svg
    const chartEl = document.getElementsByClassName('nv-chart')[0];
    const canvasEl = document.getElementById('canvas');
    const previewEl = document.getElementById('png-preview');
    canvasEl.setAttribute('width', chartEl.offsetWidth);
    canvasEl.setAttribute('height', chartEl.offsetHeight);

    const svgString = this._svgToString(chartEl.getElementsByTagName('svg')[0]);
    const ctx = canvasEl.getContext('2d');
    const DOMURL = self.URL || self.webkitURL || self;
    const img = new Image();
    const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svg);

    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      const png = canvasEl.toDataURL('image/png');
      previewEl.src = png;
      DOMURL.revokeObjectURL(png);
    };
    img.src = url;
  }

  render() {
    const status = this.state.sent ? 'Chart saved!' : '';
    return (
      <div>
        <button onClick={this._renderPreviewImage}>
          Save Chart
        </button>
        <span>{status}</span>
        <div>
          <h3>PNG preview</h3>
          <canvas className={styles.canvas} id="canvas"></canvas>
          <img
            id="png-preview"
            onLoad={this._sendParentMessage}
            ref="pngPreview"
          />
        </div>
      </div>
    );
  }
}

SaveChart.propTypes = {
  state: React.PropTypes.object,
};

export default connect()(SaveChart);
