/* global describe test expect it jest */

import React from 'react';
import ErrorMessage from '../../app/utils/errorMessage.js';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

// Enzyme shallow
describe('Basic <errorMessage />', () => {
  const wrapper = shallow(<ErrorMessage />);
  const style = { marginTop: '65px' };
  it('It should contain a message element', function () {
    expect(wrapper.text()).toBe('<Message />');
  });
  it('It should have the default props', function () {
    expect(wrapper.prop('inverted')).toBe(true);
    expect(wrapper.prop('rounded')).toBe(true);
    expect(wrapper.prop('theme')).toBe('error');
    expect(wrapper.prop('style')).toEqual(style);
    // @TODO Diagnose why default message doesn't return
  });
});

describe('Custom <errorMessage />', () => {
  const wrapper = shallow(<ErrorMessage>Custom error.</ErrorMessage>);
  const style = { marginTop: '65px' };
  it('It should contain a message element', function () {
    expect(wrapper.text()).toBe('<Message />');
  });
  it('It should have the default props & a custom message', function () {
    expect(wrapper.prop('inverted')).toBe(true);
    expect(wrapper.prop('rounded')).toBe(true);
    expect(wrapper.prop('theme')).toBe('error');
    expect(wrapper.prop('style')).toEqual(style);
    expect(wrapper.props().children).toEqual(
        { children: 'Custom error.' }
    );
    // @TODO Diagnose why default message doesn't return
  });
});

// React test utils
describe('<errorMessage />', () => {
  const style = { marginTop: '65px' };
  const renderer = ReactTestUtils.createRenderer();
  renderer.render(<ErrorMessage />);
  const obj = renderer.getRenderOutput();
  it('It should contain a message element', function() {
    expect(obj.props['inverted']).toBe(true);
    expect(obj.props['rounded']).toBe(true);
    expect(obj.props['theme']).toBe('error');
    expect(obj.props['style']).toEqual(style);
  })
});

describe('Custom <errorMessage />', () => {
  const wrapper = shallow(<ErrorMessage>Custom error.</ErrorMessage>);
  const style = { marginTop: '65px' };
  it('It should contain a message element', function () {
    expect(wrapper.text()).toBe('<Message />');
  });
  it('It should have the default props & a custom message', function () {
    expect(wrapper.prop('inverted')).toBe(true);
    expect(wrapper.prop('rounded')).toBe(true);
    expect(wrapper.prop('theme')).toBe('error');
    expect(wrapper.prop('style')).toEqual(style);
    expect(wrapper.props().children).toEqual(
        { children: 'Custom error.' }
    );
  });
});
