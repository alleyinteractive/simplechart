import React from 'react';
import PropTypes from 'prop-types';
import Rebass from 'rebass';
import * as styles from './RebassComponents.css';

export default function ListBlock(props) {
  const markup = (htmlString) => ({ __html: htmlString });
  return (
    <Rebass.Block
      borderLeft
      px={2}
    >
      <ul>
        {props.list.map((item, i) =>
          (<li
            className={styles.listBlockItem}
            key={i} // eslint-disable-line
            dangerouslySetInnerHTML={markup(item)}
          />)
        )}
      </ul>
    </Rebass.Block>
  );
}

ListBlock.propTypes = {
  list: PropTypes.array.isRequired,
};
