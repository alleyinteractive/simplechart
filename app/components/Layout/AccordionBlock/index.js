import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, PanelHeader, Space, Tooltip } from 'rebass';
import infoSvg from '../../../img/icons/info-circle.svg';
import downSvg from '../../../img/icons/chevron-circle-down.svg';
import upSvg from '../../../img/icons/chevron-circle-up.svg';
import * as styles from './AccordionBlock.css';

class AccordionBlock extends Component {
  static svgIcon(svgString, iconClass = '') {
    return (
      <span
        className={`${styles.icon} ${styles[iconClass]}`}
        dangerouslySetInnerHTML={{ __html: svgString }} // eslint-disable-line react/no-danger
      />
    );
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

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
    });

    this.props.toggleCallback(!this.state.expanded);
  };

  renderPanelHeader = (toggleIcon) => (
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

  renderExpanded = () => (
    <div>
      <Panel theme="info">
        {this.renderPanelHeader(upSvg)}
        {this.props.children}
      </Panel>
    </div>
  );

  renderCollapsed = () => (
    <div className={styles.padCollapsed}>
      {this.renderPanelHeader(downSvg)}
    </div>
  );

  render() {
    return this.state.expanded ?
      this.renderExpanded() : this.renderCollapsed();
  }
}

AccordionBlock.defaultProps = {
  updateExpandOnProps: false,
  toggleCallback: () => {},
  tooltip: '',
};

AccordionBlock.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  defaultExpand: PropTypes.bool.isRequired,
  updateExpandOnProps: PropTypes.bool,
  tooltip: PropTypes.string,
  toggleCallback: PropTypes.func,
};

export default AccordionBlock;
