import React from 'react';
import { shallow } from 'enzyme';

import Toast from '../../../components/shared/toast';

describe('Toast', () => {
  let props;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      message: 'some message',
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Toast {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders custom delay', () => {
    const p = {
      ...props,
      delay: 5000,
    };
    const wrapper = shallow(<Toast {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    let cleanupFunc;
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    const wrapper = shallow(<Toast {...props} />);
    expect(wrapper.length).toBe(1);
    jest.runAllTimers();
    cleanupFunc();
    expect(props.onClose).toHaveBeenCalled();
  });
});
