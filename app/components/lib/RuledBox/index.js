/**
 * Renders whatever children are passed to it inside a container with
 * horizontal and vertical rulers
 */
import React, { Component } from 'react';
import * as styles from './RuledBox.css';
import rulerDefaults from './rulerDefaults';

class RuledBox extends Component {
  constructor() {
    super();
    this._renderRuler = this._renderRuler.bind(this);
  }

  /**
   * Get a <span> for each tick for insertion into the ruler element
   */
  _getTicksHTML(rulerLength) {
    // Very unlikely edge case
    if (rulerLength < rulerDefaults.tickMinor) {
      return { __html: '' };
    }
    let dist = rulerDefaults.tickMinor;
    let output = '';

    // Build HTML of tick spans
    while (dist <= rulerLength) {
      // Is this a labled tick?
      const labeled = (0 < dist && 0 === dist % rulerDefaults.tickMajor);

      // Append in one of these formats:
      // <span style="flex-basis:10px"></span>
      // <span class="labeled" style="flex-basis:10px"><span>100</span></span>
      output += `<span
        class="${labeled ? styles.labeled : ''}"
        style="flex-basis:${rulerDefaults.tickMinor}px"
      >
        ${labeled ? `<span>${dist}</span>` : ''}
      </span>`;

      // Increment the distance covered so far
      dist += rulerDefaults.tickMinor;
    }
    return { __html: output };
  }

  /**
   * Validate the dimension (width or height)
   * then render the ruler element
   */
  _renderRuler(dimension) {
    // validate dimension exists and is a positive number
    if (('width' !== dimension && 'height' !== dimension) ||
      'number' !== typeof this.props[dimension] ||
      0 >= this.props[dimension]
    ) {
      return '';
    }

    return (
      <div
        className={`${styles.ruler} ${styles[dimension]}`}
        dangerouslySetInnerHTML={this._getTicksHTML(this.props[dimension])}
      />
    );
  }

  _getInlineStyles(props) {
    const inlineStyle = {};
    if (0 < props.width) {
      inlineStyle.width = `${props.width}px`;
    }
    if (0 < props.height) {
      inlineStyle.height = `${props.height}px`;
    }
    return inlineStyle;
  }

  render() {
    return (
      <div
        className={styles.container}
        style={this._getInlineStyles(this.props)}
      >
        {this._renderRuler('width')}
        {this._renderRuler('height')}
        {this.props.children}
      </div>
    );
  }
}

RuledBox.propTypes = {
  children: React.PropTypes.any.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};

export default RuledBox;
