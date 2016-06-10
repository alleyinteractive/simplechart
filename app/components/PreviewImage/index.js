import React, { Component } from 'react';
import * as styles from './PreviewImage.css';

export default class PreviewImage extends Component {
  render() {
    return (
      <div>
        <h3>PNG preview</h3>
        <canvas className={styles.canvas} id="canvas"></canvas>
        <img id="png-preview" />
      </div>
    );
  }
}
