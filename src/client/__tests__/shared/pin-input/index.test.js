import React from 'react';
import { shallow } from 'enzyme';

import PinInput from '../../../components/shared/pin-input';

describe('PinInput', () => {
  let props;

  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      length: 4,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<PinInput {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const setValues = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setValues]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    shallow(<PinInput {...props} />);
    expect(setValues).toHaveBeenCalled();
  });

  it('InputItem', () => {
    const setValues = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([['1', '2', '3', '4'], setValues]);

    const wrapper = shallow(<PinInput {...props} />);
    expect(wrapper.find('[data-target="input-item"]').length).toBe(4);
  });

  it('handleItemValueChange', () => {
    const setValues = jest.fn();
    const current = [{ focus: jest.fn() }, { focus: jest.fn() }];
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current });
    jest.spyOn(React, 'useState').mockReturnValueOnce([['1', '2'], setValues]);

    const wrapper = shallow(<PinInput {...props} />);
    const handleItemValueChange = wrapper.find('[data-target="input-item"]').at(0).invoke('onChange');
    handleItemValueChange('9');
    expect(current[1].focus).toHaveBeenCalled();
    expect(setValues).toHaveBeenCalledWith(['9', '2']);
    current[1].focus.mockClear();
    handleItemValueChange('');
    expect(current[1].focus).not.toHaveBeenCalled();
  });

  it('handleBackspace', () => {
    const current = [{ focus: jest.fn() }, { focus: jest.fn() }];
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current });
    jest.spyOn(React, 'useState').mockReturnValueOnce([['1', '2'], jest.fn()]);

    const wrapper = shallow(<PinInput {...props} />);
    const handleBackspace0 = wrapper.find('[data-target="input-item"]').at(0).invoke('onBackspace');
    const handleBackspace1 = wrapper.find('[data-target="input-item"]').at(1).invoke('onBackspace');
    handleBackspace0();
    handleBackspace1();
    expect(current[0].focus).toHaveBeenCalled();
  });

  it('ref', () => {
    const current = [];
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current });
    jest.spyOn(React, 'useState').mockReturnValueOnce([['1', '2'], jest.fn()]);

    const wrapper = shallow(<PinInput {...props} />);
    const refFn = wrapper.find('[data-target="input-item"]').at(0).getElement().ref;
    refFn('someEl');
    expect(current[0]).toBe('someEl');
  });
});
