import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Account from '../../components/pages/account';

describe('Account', () => {
  let props, state;

  beforeEach(() => {
    props = {

    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '555555',
          img: 'someurl',
        },
      },
      geolocation: {},
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
    const wrapper = shallow(<Account {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
