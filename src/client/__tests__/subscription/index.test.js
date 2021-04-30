import React from 'react';
import { shallow } from 'enzyme';

import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Subscription from '../../components/pages/subscription';

describe('Home', () => {
  let state;

  const history = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();

    state = {
      locations: {
        items: [
          { locationId: 'someId' },
          { locationId: 'anotherId' },
        ],
      },
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
    const wrapper = shallow(<Subscription />);
    expect(wrapper.length).toBe(1);
  });

  it('startSubscription', () => {
    const wrapper = shallow(<Subscription />);
    const startSubscription = wrapper.find('[data-target="start-subscription"]').invoke('onClick');
    startSubscription();
    expect(wrapper.length).toBe(1);
  });

  it('startSubscription with one location', () => {
    const stateTemp = {
      locations: {
        items: [
          { locationId: 'someId' },
        ],
      },
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
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(stateTemp);
    });
    const wrapper = shallow(<Subscription />);
    const startSubscription = wrapper.find('[data-target="start-subscription"]').invoke('onClick');
    startSubscription();
    expect(wrapper.length).toBe(1);
  });
});
