import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import AddLocation from '../../components/pages/add-location';

describe('AddLocation', () => {
  let props, state;

  const history = {
    push: jest.fn(),
    replace: jest.fn(),
  };

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
          isWorker: false,
        },
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  it('renders correctly', () => {
    const wrapper = shallow(<AddLocation {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<AddLocation {...props} />);
    expect(history.replace).not.toHaveBeenCalled();
  });

  it('useEffect worker', () => {
    const s = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '555555',
          img: 'someurl',
          isWorker: true,
        },
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<AddLocation {...props} />);
    expect(history.replace).not.toHaveBeenCalled();
  });
});
