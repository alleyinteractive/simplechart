import React from 'react';
import { Message } from 'rebass';

export default function ErrorMessage(msg) {
	return React.createElement(Message, {
		inverted: true,
		rounded: true,
		theme: 'error',
		style: { marginTop: '65px' },
	}, msg);
}
