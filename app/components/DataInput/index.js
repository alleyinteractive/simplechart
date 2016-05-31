import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as styles from '../../css/components.css';
import { textarea } from './DataInput.css';

class DataInput extends Component {

  render() {
    return (
      <div className={styles.component}>
        <textarea
          id="DataInput"
          className={textarea}
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
