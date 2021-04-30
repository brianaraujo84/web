import React from 'react';
import ReactRedux from 'react-redux';
import { shallow } from 'enzyme';

import Layout from '../../../components/shared/layout';
import Hooks from '../../../hooks';

describe('Layout', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      nologin: false,
      blue: false,
      children: [],
      // isMobile: jest.fn(),
    };

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
      toasts: {
        list: [
          {
            message: 'Some message',
            delay: 4000,
          },
        ],
      },
    };
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  afterEach(() => {
    React.useEffect.mockClear();
    ReactRedux.useSelector.mockClear();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Layout {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders blue', () => {
    const p = { ...props, blue: true };
    const wrapper = shallow(<Layout {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('Header', () => {
    const wrapper = shallow(<Layout {...props} />);
    expect(wrapper.find('Header').length).toBe(1);
    expect(wrapper.find('HeaderNoLogin').length).toBe(0);
  });

  it('useEffect', async () => {
    const s = { ...state, profile: { ...state.profile, loggedIn: false } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Layout {...props} />);
    expect(wrapper.find('HeaderNoLogin').length).toBe(1);
  });

  it('useEffect geolocation', async () => {
    const s = { ...state, geolocation: { location: {} } };
    const getGeoLocation = jest.fn();
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getGeoLocation);
    shallow(<Layout {...props} />);
    expect(getGeoLocation).toHaveBeenCalled();
  });

  it('delToast', async () => {
    const deleteToast = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockImplementation((fn) => {
      if ('removeToast' === fn.name) {
        return deleteToast;
      } else {
        return jest.fn();
      }
    });
    const wrapper = shallow(<Layout {...props} />);
    const handleDelete = wrapper.find('Toast').at(0).invoke('onClose');
    handleDelete();
    expect(deleteToast).toHaveBeenCalled();
  });
});

