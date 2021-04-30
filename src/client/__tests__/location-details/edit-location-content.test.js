import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import EditLocationContent from '../../components/pages/location-details/edit-location-content';

describe('Content', () => {
  let props, state;

  beforeEach(() => {
    props = {
      locationType: 'Home',
      hoursofOperation: [],
      locationData: {
        locationId: 1,
        address: {

        },
      },
      setFormik: jest.fn(),
      setIsInitialValues: jest.fn(),
    };

    state = {
      geolocation: {
        location: {}
      },
      profile: {
        data: {}
      },
      loc: {
        data: {
          locationId: '',
          hoursofOperation: []
        }
      }
    };

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
    const wrapper = shallow(<EditLocationContent {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
