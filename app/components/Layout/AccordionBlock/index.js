import React, { Component } from 'react';
import { Panel, PanelHeader, Space, Tooltip } from 'rebass';
import infoSvg from '!!raw!../../../img/icons/info-circle.svg';
import plusSvg from '!!raw!../../../img/icons/plus-circle.svg';
import minusSvg from '!!raw!../../../img/icons/minus-circle.svg';
import * as styles from './AccordionBlock.css';

class AccordionBlock extends Component {

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

  svgIcon(svgString, iconClass = '') {
    return (
      <span
        className={`${styles.icon} ${styles[iconClass]}`}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
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
            {this.svgIcon(infoSvg, 'info')}
          </Tooltip>
          <Space auto x={1} />
          <span onClick={this.toggleExpanded}>
            {this.svgIcon(toggleIcon)}
          </span>
        </PanelHeader>
      </div>
    );
  }

  renderExpanded() {
    return (
      <div>
        <Panel theme="info">
          {this.renderPanelHeader(minusSvg)}
          {this.props.children}
        </Panel>
      </div>
    );
  }

  renderCollapsed() {
    return (
      <div className={styles.padCollapsed}>
        {this.renderPanelHeader(plusSvg)}
      </div>
    );
  }

  render() {
    return this.state.expanded ?
      this.renderExpanded() : this.renderCollapsed();
  }
}

AccordionBlock.propTypes = {
  children: React.PropTypes.any.isRequired,
  title: React.PropTypes.string,
  defaultExpand: React.PropTypes.bool,
  updateExpandOnProps: React.PropTypes.bool,
  tooltip: React.PropTypes.string,
  toggleCallback: React.PropTypes.func,
};

export default AccordionBlock;
