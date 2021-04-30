import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';

import DeviceCard from '../../components/pages/devices/device-card';

describe('DeviceCard', () => {
  let props;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      device: {
        id: 1,
        deviceUId: 'vir20200911',
        signalStrength: -80,
      },
    };

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DeviceCard {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleGotoDetails', () => {
    const wrapper = shallow(<DeviceCard {...props} />);
    const handleGotoDetails = wrapper.find('.card').at(0).invoke('onClick');
    handleGotoDetails();
    expect(history.push).toHaveBeenCalled();
  });
});
