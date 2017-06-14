/**
 * Renders whatever children are passed to it inside a container with
 * horizontal and vertical rulers
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as styles from './RuledBox.css';
import rulerDefaults from './rulerDefaults';

class RuledBox extends Component {

  /**
   * Get a <span> for each tick for insertion into the ruler element
   */
  static renderTicks(rulerLength) {
    // Very unlikely edge case
    if (rulerLength < rulerDefaults.tickMinor) {
      return [];
    }
    let dist = rulerDefaults.tickMinor;
    const output = [];

    // Build HTML of tick spans
    while (dist <= rulerLength) {
      // Is this a labled tick?
      const labeled = (0 < dist && 0 === dist % rulerDefaults.tickMajor);

      // Append in one of these formats:
      // <span style="flex-basis:10px"></span>
      // <span class="labeled" style="flex-basis:10px"><span>100</span></span>
      output.push(<span
        key={dist}
        className={`${labeled ? styles.labeled : ''}`}
        style={{ flexBasis: `${rulerDefaults.tickMinor}px` }}
      >
        {labeled && <span>{dist}</span>}
      </span>);

      // Increment the distance covered so far
      dist += rulerDefaults.tickMinor;
    }

    return output;
  }

  static getInlineStyles(props) {
    const inlineStyle = {};
    if (0 < props.width) {
      inlineStyle.width = `${props.width}px`;
    }
    if (0 < props.height) {
      inlineStyle.height = `${props.height}px`;
    }
    return inlineStyle;
  }

  constructor() {
    super();
    this.renderRuler = this.renderRuler.bind(this);
  }

  /**
   * Validate the dimension (width or height)
   * then render the ruler element
   */
  renderRuler(dimension) {
    // validate dimension exists and is a positive number
    if (('width' !== dimension && 'height' !== dimension) ||
      'number' !== typeof this.props[dimension] ||
      0 >= this.props[dimension]
    ) {
      return '';
    }

    return (
      <div className={`${styles.ruler} ${styles[dimension]}`}>
        {RuledBox.renderTicks(this.props[dimension])}
      </div>
    );
  }

  render() {
    return (
      <div
        className={styles.container}
        style={RuledBox.getInlineStyles(this.props)}
      >
        {this.renderRuler('width')}
        {this.renderRuler('height')}
        {this.props.children}
      </div>
    );
  }
}

RuledBox.propTypes = {
  children: PropTypes.any.isRequired,
  width: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  height: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export default RuledBox;
