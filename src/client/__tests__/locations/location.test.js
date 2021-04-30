import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import Location from '../../components/pages/locations/location';

describe('LocationsLocation', () => {
  let props;
  let state;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      index: 0,
      location: {
        address: {},
        locationName: 'name',
        locationType: 'Business',
        locationDetails: 'Some details',
        numberofTasks: 32,
        numberofMyTasks: 2,
        locationId: 'someid',
        active: false,
      },
    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          userType: 'Manager',
        },
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Location {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders owner no details', () => {
    const s = {
      ...state,
      profile: { ...state.profile, data: { ...state.profile.data, userType: 'Worker' } },
    };

    const p = {
      ...props,
      location: { ...props.location, locationDetails: null, locationType: 'Home' },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Location {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders not first without the name', () => {
    const p = { ...props, index: 1, location: { ...props.location, locationName: undefined } };
    const wrapper = shallow(<Location {...p} />);
    expect(wrapper.length).toBe(1);
  });

});
