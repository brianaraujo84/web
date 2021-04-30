import React from 'react';
import { shallow } from 'enzyme';

import DeviceDetails from '../../components/pages/device-details';

describe('DeviceDetails', () => {
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
    const wrapper = shallow(<DeviceDetails {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
