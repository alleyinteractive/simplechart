import React from 'react';
import { Message } from 'rebass';

export default function ErrorMessage(msg = 'An error occurred.') {
  return React.createElement(Message, {
    inverted: true,
    rounded: true,
    theme: 'error',
    style: { marginTop: '55px' },
  }, msg);
}
