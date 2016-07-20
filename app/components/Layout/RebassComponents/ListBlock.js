import React, { Component } from 'react';
import Rebass from 'rebass';

export default class ListBlock extends Component {
  render() {
    return (
      <Rebass.Block
        borderLeft
        px={2}
      >
        <ul>
          {this.props.list.map((item, i) =>
            (<li key={i}>{item}</li>)
          )}
        </ul>
      </Rebass.Block>
    );
  }
}

ListBlock.propTypes = {
  list: React.PropTypes.array,
};
