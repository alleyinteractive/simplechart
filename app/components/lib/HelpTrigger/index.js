import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../../actions';
import { RECEIVE_HELP_DOCUMENT } from '../../../constants';
import infoSvg from '!!raw!../../../img/icons/info-circle.svg';
import * as styles from './HelpTrigger.css';

/**
 * Render SVG icon that opens the Help panel when clicked
 * by sending the name of a Markdown doc to Redux
 */
class HelpTrigger extends Component {
  constructor() {
    super();
    this._dispatch = this._dispatch.bind(this);
  }

  _dispatch() {
    this.props.dispatch(
      actionTrigger(RECEIVE_HELP_DOCUMENT, this.props.docName));
  }

  render() {
    return (
      <span
        style={ this.props.style || null }
        className={styles.icon}
        dangerouslySetInnerHTML={{ __html: infoSvg }}
        onClick={this._dispatch}
      />
    );
  }
}

HelpTrigger.propTypes = {
  docName: React.PropTypes.string,
  style: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

export default connect()(HelpTrigger);
