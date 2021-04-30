import React from 'react';
import { shallow } from 'enzyme';

import DeviceActivate from '../../components/pages/add-device/device-activate';

describe('DeviceActivate', () => {
  let props;

  beforeEach(() => {
    props = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DeviceActivate {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const setPasscode = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([0, setPasscode]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<DeviceActivate {...props} />);
    expect(setPasscode).toHaveBeenCalled();
  });
});
