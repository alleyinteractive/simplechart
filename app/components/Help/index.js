import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actionTrigger from '../../actions';
import * as styles from './Help.css';
import { CLEAR_HELP_DOCUMENT, RECEIVE_ERROR } from '../../constants';
import closeSvg from '!!raw-loader!../../img/icons/times-circle.svg'; // eslint-disable-line
import markdownCSS from '!!style-loader!css-loader!../../../node_modules/github-markdown-css/github-markdown.css';  // eslint-disable-line

/**
 * Show Help content from Markdown file
 */
class Help extends Component {
  constructor() {
    super();
    this.getHtml = this.getHtml.bind(this);
    this.clearDoc = this.clearDoc.bind(this);
    this.state = { content: '' };
  }

  componentWillMount() {
    this.setState({ content: this.getHtml(this.props.docName) });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ content: this.getHtml(nextProps.docName) });
  }

  /**
   * Get Markdown help doc contents as HTML
   *
   * @param {string} docName
   * @return {string} Empty string or HTML content from Markdown file
   */
  getHtml(docName) {
    if (!docName) {
      return '';
    }

    let content;
    try {
      content = require(`../../pages/help/${docName}.md`); // eslint-disable-line
    } catch (e) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e008'));
      content = '';
    }

    return content;
  }

  clearDoc() {
    this.props.dispatch(actionTrigger(CLEAR_HELP_DOCUMENT));
  }

  render() {
    return !this.state.content ? null : (
      <div className={styles.container}>
        <span
          role="button"
          tabIndex={0}
          onClick={this.clearDoc}
          className={styles.closeHelp}
          dangerouslySetInnerHTML={{ __html: closeSvg }}
        />
        <div
          className="markdown-body"
          style={{ fontSize: '15px' }} // override default markdown style
          dangerouslySetInnerHTML={{ __html: this.state.content }}
        />
      </div>
    );
  }
}

Help.propTypes = {
  docName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Help);
