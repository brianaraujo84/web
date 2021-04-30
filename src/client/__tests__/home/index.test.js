import React from 'react';
import { shallow } from 'enzyme';

import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Home from '../../components/pages/home';

describe('Home', () => {
  let props;

  const history = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      locationType: 'Business',
    };

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Home {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    const state = {
      locations: {
        items: [],
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
    shallow(<Home {...props} />);
    expect(history.replace).not.toHaveBeenCalled();
  });

  it('useEffect one location', () => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    const state = {
      locations: {
        items: [
          { locationId: 'someId' }
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
    shallow(<Home {...props} />);
    expect(history.replace).toHaveBeenCalledWith('/location/someId/');
  });

  it('useEffect multiple locations', () => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    const state = {
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
    shallow(<Home {...props} />);
    expect(history.replace).toHaveBeenCalledWith('/locations');
  });
});
