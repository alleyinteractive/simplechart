import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import * as styles from './Help.css';
import { CLEAR_HELP_DOCUMENT, RECEIVE_ERROR } from '../../constants';

/**
 * Show Help content from Markdown file
 */
class Help extends Component {
  constructor() {
    super();
    this._getHtml = this._getHtml.bind(this);
    this._clearDoc = this._clearDoc.bind(this);
    this.state = { content: '' };
  }

  componentWillMount() {
    this.setState({ content: this._getHtml(this.props.docName) });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ content: this._getHtml(nextProps.docName) });
  }

  /**
   * Get Markdown help doc contents as HTML
   *
   * @param string docName
   * @return string Empty string or HTML content from Markdown file
   */
  _getHtml(docName) {
    if (!docName) {
      return '';
    }

    let content;
    try {
      content = require(`../../pages/help/${docName}.md`);
    } catch (e) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e008'));
      content = '';
    }

    return content;
  }

  _clearDoc(evt) {
    evt.preventDefault();
    this.props.dispatch(actionTrigger(CLEAR_HELP_DOCUMENT));
  }

  render() {
    return !this.state.content ? null : (
      <div className={styles.container}>
        <a href="#0" onClick={this._clearDoc}>Clear Help Document</a>
        <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
      </div>
    );
  }
}

Help.propTypes = {
  docName: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

export default connect()(Help);
