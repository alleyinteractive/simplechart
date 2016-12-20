/* global describe test expect it jest */

import React from 'react';
import { shallow, } from 'enzyme';
import ErrorMessage from '../../app/components/Header/ErrorMessage';

// Enzyme shallow
describe('Basic <ErrorMessage />', () => {
  const wrapper = shallow(<ErrorMessage/>);
  const style = { marginTop: '65px' };

  it('should contain a message element', () => {
    expect(wrapper.text()).toBe('<Message />');
  });

  it('should have the default props', () => {
    expect(wrapper.prop('inverted')).toBe(true);
    expect(wrapper.prop('rounded')).toBe(true);
    expect(wrapper.prop('theme')).toBe('error');
  });

  it('should have a custom style prop', function() {
    expect(wrapper.prop('style')).toEqual(style);
  })

  it('should have the correct error code', () => {
    expect(wrapper.props().children).toEqual({ code: 'e002' });
  });

});

describe('Custom <ErorMessage />', () => {
  const wrapper = shallow(<ErrorMessage>Custom error.</ErrorMessage>);
 
  it('should contain a message element', () => {
    expect(wrapper.text()).toBe('<Message />');
  });

  it('should have the custom message', () => {
    expect(wrapper.props().children).toEqual(
        { children: 'Custom error.' }
    );
  });
});
