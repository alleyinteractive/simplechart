import React, { Component } from 'react';
import * as styles from './RuledBox.css';
import rulerDefaults from './rulerDefaults';

class RuledBox extends Component {
  _getTicks(value) {
    // Very unlikely edge case
    if (value < rulerDefaults.tickMinor) {
      return '';
    }
    let dist = rulerDefaults.tickMinor;
    let output = '';
    while (dist <= value) {
      output += `<span style="flex-basis:${rulerDefaults.tickMinor}px">${(0 < dist && 0 === dist % rulerDefaults.tickMajor) ? `<span>${dist}</span>` : ''}</span>`;
      dist += rulerDefaults.tickMinor;
    }
    return { __html: output };
  }

  render() {
    return (
      <div
        className={styles.container}
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`,
        }}
      >
        <div
          className={`${styles.ruler} ${styles.horizontal}`}
          dangerouslySetInnerHTML={this._getTicks(this.props.width)}
        >
        </div>
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
