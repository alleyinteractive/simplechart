import React, { Component } from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';
import AccordionBlock from '../../Layout/AccordionBlock';

class Annotations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
  }
  onEditClick = () => {
    this.setState({
      editing: !this.state.editing,
    });

    // Select SVG and append invisible rectangle
    // This will add as a click target to capture x and y for annotations
    const svg = d3.select('.nv-chart svg');
    const { height, width } = svg.node().getBBox();

    svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'red');
  };

  render() {
    return (
      <AccordionBlock
        title="Annotations"
        tooltip="Set chart annotations"
        defaultExpand={this.props.defaultExpand}
      >
        Hey!
        <button onClick={this.onEditClick}>Edit Annotations</button>
        <p>
          {
            this.state.editing && 'Editing!!'
          }
        </p>
      </AccordionBlock>
    );
  }
}

Annotations.propTypes = {
  defaultExpand: PropTypes.bool.isRequired,
};

export default Annotations;
