import React from 'react';
import { shallow } from 'enzyme';

import InputItemRef, { InputItem } from '../../../components/shared/pin-input/input-item';

describe('PinInput InputItem', () => {
  let props;

  beforeEach(() => {
    props = {
      inputRef: {},
      onChange: jest.fn(),
      onBackspace: jest.fn(),
      first: true,
      last: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<InputItem {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders mid', () => {
    const p = { ...props, last: false, first: false };
    const wrapper = shallow(<InputItem {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders ref', () => {
    const wrapper = shallow(<InputItemRef {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('input', () => {
    const wrapper = shallow(<InputItem {...props} />);
    expect(wrapper.find('input').length).toBe(1);
  });

  it('handleFocus', () => {
    const wrapper = shallow(<InputItem {...props} />);
    const handleFocus = wrapper.find('input').invoke('onFocus');
    const event = {
      target: {
        select: jest.fn(),
      }
    };
    handleFocus(event);
    expect(event.target.select).toHaveBeenCalled();
  });

  it('handleChange', () => {
    const wrapper = shallow(<InputItem {...props} />);
    const handleChange = wrapper.find('input').invoke('onChange');
    const event = {
      target: {
        value: '1',
      }
    };
    handleChange(event);
    expect(props.onChange).toHaveBeenCalledWith('1');
    props.onChange.mockClear();
    handleChange({ target: { value: '' } });
    expect(props.onChange).toHaveBeenCalledWith('');
  });

  it('handleKeyDown', () => {
    const wrapper = shallow(<InputItem {...props} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    handleKeyDown({ keyCode: 9 });
    expect(props.onBackspace).not.toHaveBeenCalled();
    handleKeyDown({ keyCode: 8 });
    expect(props.onBackspace).toHaveBeenCalled();
  });

  it('handleKeyDown initial', () => {
    const p = { ...props, initialValue: '3' };
    const wrapper = shallow(<InputItem {...p} />);
    const handleKeyDown = wrapper.find('input').invoke('onKeyDown');
    const event = {
      keyCode: 8,
    };
    handleKeyDown(event);
    expect(props.onBackspace).not.toHaveBeenCalled();
  });
});
