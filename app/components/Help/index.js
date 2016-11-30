import React, { Component } from 'react';
import * as styles from './Help.css';

class Help extends Component {

  _getHtml(docName) {
    if (!docName) {
      return { __html: '' };
    }
    const content = require(`../../pages/help/${docName}.md`);
    if (!content) {
      return { __html: '' };
    }
    return { __html: content };
  }

  render() {
    return (
      <div
        className={styles.container}
        dangerouslySetInnerHTML={this._getHtml(this.props.docName)}
      />
    );
  }
}

Help.propTypes = {
  docName: React.PropTypes.string,
};

export default Help;
