import React, { Component } from 'react';

class RuledBox extends Component {
  render() {
    return (
      <div
        style={{
          width: `${this.props.width}px`,
          height: `${this.props.height}px`,
          overflow: 'hidden',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

RuledBox.propTypes = {
  children: React.PropTypes.isRequired,
  width: React.PropTypes.number,
  height: React.PropTypes.number,
};

export default RuledBox;
