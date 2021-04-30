import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Content from '../../components/pages/device-details/content';

describe('Content', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {};

    state = {
      device: {
        data: {
          location: {
            companyId: null,
            locationId: 'SCHJWOQ9',
            locationName: 'Graham Middle School',
            locationDetails: '',
            locationType: 'School',
            userName: null,
            address: {
              addressLine1: '175 Castro Street',
              city: 'Mountain View',
              state: 'CA',
              zip: '94041'
            }
          },
          deviceList: [
            {
              id:63,
              deviceUId: 'VIR202009201000000041',
              deviceStatus: 'initiate',
              signalStrength: '-80',
              battery: '3.3',
              latestFirmwareVersion: '01.00.01',
              placement: 'Front Desk',
              initialTimeInterval: null,
              timeInterval: null,
              tempalteName: 'Weekly Covid Cleaning'
            }
          ],
        },
      },
    };

    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ deviceId: 'VIR202009201000000041' });
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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
