import React, { Component } from 'react';
import { Panel, PanelHeader, Space, Tooltip } from 'rebass';
import infoSvg from '!!raw!../../../node_modules/font-awesome-svg-png/black/svg/info-circle.svg'

class AccordionBlock extends Component {
  render() {
    return (
      <div>
        <Panel theme="info">
          <PanelHeader
            inverted
            theme="default"
          >
            {this.props.title}
            <Tooltip
              title={this.props.tooltip}
            >
              {infoSvg}
            </Tooltip>
            <Space auto x={1} />
          </PanelHeader>
          {this.props.children}
        </Panel>
      </div>
    );
  }
}

AccordionBlock.propTypes = {
  children: React.PropTypes.any.isRequired,
  title: React.PropTypes.string,
  tooltip: React.PropTypes.string,
};

export default AccordionBlock;
