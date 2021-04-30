import React from 'react';
import { shallow } from 'enzyme';

import DeviceEmpty from '../../components/pages/devices/empty';

describe('DeviceEmpty', () => {
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
    const wrapper = shallow(<DeviceEmpty {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
