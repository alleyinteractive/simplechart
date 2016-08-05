import React, { Component } from 'react';
import Rebass from 'rebass';
import * as styles from './RebassComponents.css';

export default class ListBlock extends Component {
  render() {
    const markup = (htmlString) => ({ __html: htmlString });
    return (
      <Rebass.Block
        borderLeft
        px={2}
      >
        <ul>
          {this.props.list.map((item, i) =>
            (<li
              className={styles.listBlockItem}
              key={i}
              dangerouslySetInnerHTML={markup(item)}
            ></li>)
          )}
        </ul>
      </Rebass.Block>
    );
  }
}

ListBlock.propTypes = {
  list: React.PropTypes.array,
};
