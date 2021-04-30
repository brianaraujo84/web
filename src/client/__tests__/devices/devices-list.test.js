import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import DevicesList from '../../components/pages/devices/devices-list';
import Hooks from '../../hooks';

describe('DevicesList', () => {
  let props, state;
  const history = {
    push: jest.fn(),
  };
  
  beforeEach(() => {
    props = {};

    state = {
      locations: {
        items: [
          {
            active: true,
            address: {
              addressLine1: '2340 Clay Street',
              city: 'San Francisco',
              state: 'CA',
              zip: '94115',
            },
            locationDetails: '',
            locationId: 'HOMUMVXH',
            locationName: 'Dev\'s House',
            locationType: 'Home',
            numberofMyTasks: 17,
            numberofTasks: 30,
          }
        ],
      },
      loc: {
        data: {},
      },
      device: {
        data: {},
      }
    };

    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DevicesList {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const getDevices = jest.fn();

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getDevices);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<DevicesList {...props} />);
    expect(getDevices).toHaveBeenCalled();
  });
});
