import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import LocationMy from '../../components/pages/location-details/location-my';
import Hooks from '../../hooks';

describe('LocationMy', () => {
  let props, state;

  beforeEach(() => {
    props = {
    };

    state = {
      loc: {
        data: {
          locationType: 'Business',
        },
      },
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

    global.scrollTo = jest.fn();

    jest.spyOn(ReactRouterDom, 'useLocation').mockReturnValue({ data: { isFirstTime: true, locationType: 'home' } });
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
    const wrapper = shallow(<LocationMy {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    let cleanupFunc;
    const resetLocation = jest.fn().mockReturnValueOnce({});
    const resetTasks = jest.fn().mockReturnValueOnce([]);

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(resetLocation);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(resetTasks);
    jest.spyOn(React, 'useEffect').mockImplementation(f => cleanupFunc = f());

    shallow(<LocationMy {...props} />);
    cleanupFunc();
    expect(resetLocation).toHaveBeenCalled();
    expect(resetTasks).toHaveBeenCalled();
  });
});
