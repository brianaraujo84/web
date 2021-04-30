import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Hooks from '../../hooks';

import LocationDetails from '../../components/pages/location-details';

describe('LocationDetails', () => {
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
    const wrapper = shallow(<LocationDetails {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleViewZones', () => {
    const setShowZonePopup = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowZonePopup]);

    const wrapper = shallow(<LocationDetails {...props} />);
    const handleViewZones = wrapper.find('ZonePopupModal').invoke('onViewZones');
    handleViewZones();
    expect(setShowZonePopup).toHaveBeenCalledWith(false);
  });

  it('useEffect', () => {
    let cleanupFunc;
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());

    shallow(<LocationDetails {...props} />);
    cleanupFunc();
  });

  it('useEffect with isFirstTime false', () => {
    const setLocation = jest.fn();
    let cleanupFunc;
    jest.spyOn(ReactRouterDom, 'useLocation').mockReturnValue({ data: { isFirstTime: false, locationType: 'home' } });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(setLocation);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    shallow(<LocationDetails {...props} />);
    cleanupFunc();
    expect(setLocation).toHaveBeenCalled();
  });
});
