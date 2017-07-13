import React from 'react';
import PropTypes from 'prop-types';
import Rebass from 'rebass';
import * as styles from './RebassComponents.css';

export default function ListBlock(props) {
  return (
    <Rebass.Block
      borderLeft
      px={2}
    >
      <ul>
        {props.list.map((item) =>
          (<li
            className={styles.listBlockItem}
            key={item}
          >{item}</li>)
        )}
      </ul>
    </Rebass.Block>
  );
}

ListBlock.propTypes = {
  list: PropTypes.array.isRequired,
};
