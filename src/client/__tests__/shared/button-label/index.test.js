import React from 'react';
import { shallow } from 'enzyme';

import ButtonLabel from '../../../components/shared/button-label';

describe('ButtonLabel', () => {
  let props;

  beforeEach(() => {
    props = {
      state: 0,
      stateUnselected: 0,
      buttonState: 1,
      children: (<div></div>),
      handleClick: jest.fn(),
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ButtonLabel {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders no handleClick', () => {
    const wrapper = shallow(<ButtonLabel {...{ ...props, handleClick: undefined }} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('label').length).toBe(1);
    wrapper.find('label').simulate('click');
    expect(props.handleClick).not.toHaveBeenCalled();
  });

  it('changeState', () => {
    const wrapper = shallow(<ButtonLabel {...props} />);
    expect(wrapper.find('label').length).toBe(1);
    wrapper.find('label').simulate('click');
    expect(props.handleClick).toHaveBeenCalledWith(1);
  });

  it('changeState default', () => {
    const wrapper = shallow(<ButtonLabel {...{ ...props, state: 1 }} />);
    expect(wrapper.find('label').length).toBe(1);
    wrapper.find('label').simulate('click');
    expect(props.handleClick).toHaveBeenCalledWith(0);
  });
});
