import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actionTrigger from '../../../actions';
import { RECEIVE_HELP_DOCUMENT } from '../../../constants';
import infoSvg from '../../../img/icons/info-circle.svg';
import * as styles from './HelpTrigger.css';

/**
 * Render SVG icon that opens the Help panel when clicked
 * by sending the name of a Markdown doc to Redux
 */
class HelpTrigger extends Component {
  constructor() {
    super();
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch() {
    // Toggling the panel is handled in middleware
    this.props.dispatch(
      actionTrigger(RECEIVE_HELP_DOCUMENT, this.props.docName));
  }

  render() {
    return (
      <span
        style={Object.keys(this.props.style).length ? this.props.style : null}
        className={styles.icon}
        dangerouslySetInnerHTML={{ __html: infoSvg }} // eslint-disable-line react/no-danger
        onClick={this.dispatch}
        role="button"
        tabIndex={0}
      />
    );
  }
}

HelpTrigger.defaultProps = {
  style: {},
};

HelpTrigger.propTypes = {
  docName: PropTypes.string.isRequired,
  style: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(HelpTrigger);
