import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'github-markdown-css/github-markdown.css';
import actionTrigger from '../../actions';
import * as styles from './Help.css';
import { CLEAR_HELP_DOCUMENT, RECEIVE_ERROR } from '../../constants';
import closeSvg from '../../img/icons/times-circle.svg';
import helpPages from '../../pages/help';

/**
 * Show Help content from Markdown file
 */
class Help extends Component {
  static propTypes = {
    docName: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  state = { content: '' };

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
  getHtml = (docName) => {
    if (!docName) {
      return '';
    }

    const content = helpPages[docName] || '';
    if (!content.length) {
      this.props.dispatch(actionTrigger(RECEIVE_ERROR, 'e008'));
    }

    return content;
  };

  clearDoc = () => {
    this.props.dispatch(actionTrigger(CLEAR_HELP_DOCUMENT));
  };

  render() {
    return !this.state.content ? null : (
      <div className={styles.container}>
        <span
          role="button"
          tabIndex={0}
          onClick={this.clearDoc}
          className={styles.closeHelp}
          dangerouslySetInnerHTML={{ __html: closeSvg }} // eslint-disable-line react/no-danger
        />
        <div
          className="markdown-body"
          style={{ fontSize: '15px' }} // override default markdown style
          dangerouslySetInnerHTML={{ __html: this.state.content }} // eslint-disable-line react/no-danger
        />
      </div>
    );
  }
}

export default connect()(Help);
