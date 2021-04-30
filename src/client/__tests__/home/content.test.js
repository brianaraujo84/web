import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Content from '../../components/pages/home/content';

describe('Home Content', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {};
    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
      geolocation: {},
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
