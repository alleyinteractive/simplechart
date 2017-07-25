import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonOutline } from 'rebass';

/**
 * Button group to determine current scope for data format settings updates
 * Uses grouped button style from Rebass v0.3.4
 * See https://github.com/jxnblk/rebass/blob/7a93abfeabdfff09855a30a7fcc5bfaf1a845c53/docs/examples.js#L148-L162
 */
function FormatScopeSelect({ buttonOpts, value, handler }) {
  const handleClick = (evt) => {
    handler(evt.target.name);
  };

  return (
    <div>
      {buttonOpts.map(({ name, label }, idx) => {
        const buttonProps = {
          children: label,
          key: name,
          name,
          onClick: handleClick,
          style: {
            marginLeft: (0 < idx) ? -1 : 0,
          },
        };

        return name === value ?
          (<Button {...buttonProps} />) : (<ButtonOutline {...buttonProps} />);
      })}
    </div>
  );
}

FormatScopeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  buttonOpts: PropTypes.array.isRequired,
};

export default FormatScopeSelect;
