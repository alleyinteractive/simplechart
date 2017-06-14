import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Space, Tooltip } from 'rebass';
import infoSvg from '!!raw-loader!../../../img/icons/info-circle.svg'; // eslint-disable-line
import downSvg from '!!raw-loader!../../../img/icons/chevron-circle-down.svg'; // eslint-disable-line
import upSvg from '!!raw-loader!../../../img/icons/chevron-circle-up.svg';  // eslint-disable-line
import * as styles from './AccordionBlock.css';

class AccordionBlock extends Component {
  static svgIcon(svgString, iconClass = '') {
    return (
      <span
        className={`${styles.icon} ${styles[iconClass]}`}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  }

  constructor() {
    super();
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.renderExpanded = this.renderExpanded.bind(this);
    this.renderCollapsed = this.renderCollapsed.bind(this);
    this.renderPanelHeader = this.renderPanelHeader.bind(this);
  }

  componentWillMount() {
    this.setState({
      expanded: !!this.props.defaultExpand,
      updateExpandOnProps: !!this.props.updateExpandOnProps,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.updateExpandOnProps) {
      this.setState({
        expanded: !!nextProps.defaultExpand,
      });
    }
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded,
    });
    if (this.props.toggleCallback) {
      this.props.toggleCallback(!this.state.expanded);
    }
  }

  renderPanelHeader(toggleIcon) {
    return (
      <div>
        <PanelHeader
          inverted
          theme="info"
        >
          {this.props.title}
          <Tooltip
            title={this.props.tooltip}
          >
            {AccordionBlock.svgIcon(infoSvg, 'info')}
          </Tooltip>
          <Space auto x={1} />
          <span onClick={this.toggleExpanded} role="button" tabIndex={0}>
            {AccordionBlock.svgIcon(toggleIcon)}
          </span>
        </PanelHeader>
      </div>
    );
  }

  renderExpanded() {
    return (
      <div>
        <Panel theme="info">
          {this.renderPanelHeader(upSvg)}
          {this.props.children}
        </Panel>
      </div>
    );
  }

  renderCollapsed() {
    return (
      <div className={styles.padCollapsed}>
        {this.renderPanelHeader(downSvg)}
      </div>
    );
  }

  render() {
    return this.state.expanded ?
      this.renderExpanded() : this.renderCollapsed();
  }
}

AccordionBlock.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
  updateExpandOnProps: PropTypes.bool.isRequired,
  tooltip: PropTypes.string.isRequired,
  toggleCallback: PropTypes.func.isRequired,
};

export default AccordionBlock;
