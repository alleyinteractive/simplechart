import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import * as styles from './Help.css';
import { CLEAR_HELP_DOCUMENT } from '../../constants';

class Help extends Component {
  constructor() {
    super();
    this._clearDoc = this._clearDoc.bind(this);
  }

  _getHtml(docName) {
    const content = require(`../../pages/help/${docName}.md`);
    return { __html: content || '' };
  }

  _clearDoc(evt) {
    evt.preventDefault();
    this.props.dispatch(actionTrigger(CLEAR_HELP_DOCUMENT));
  }

  render() {
    return !this.props.docName ? null : (
      <div className={styles.container}>
        <a href="#0" onClick={this._clearDoc}>Clear Help Document</a>
        <div dangerouslySetInnerHTML={this._getHtml(this.props.docName)} />
      </div>
    );
  }
}

Help.propTypes = {
  docName: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(Help);
