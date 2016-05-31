import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as styles from './DataInput.css';

class DataInput extends Component {

  render() {
    return (
      <div>
        <textarea
          id="DataInput"
          className={styles.DataInput}
          value={this.props.rawData}
        />
        <button onClick={this._handleClick}>Go</button>
      </div>
    );
  }

}

DataInput.propTypes = {
  rawData: React.PropTypes.string,
};

export default connect()(DataInput);
