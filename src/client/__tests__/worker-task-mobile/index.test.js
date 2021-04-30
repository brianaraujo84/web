import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import WorkerTaskMobile from '../../components/pages/worker-task-mobile';
import * as URLS from '../../urls';

describe('WorkerTaskMobile', () => {
  let props;
  const history = {
    replace: jest.fn(),
    location: {
      pathname: '/',
    },
  };


  beforeEach(() => {
    props = {

    };

    const state = {
      profile: {
        loggedIn: false,
        data: {
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
    const wrapper = shallow(<WorkerTaskMobile {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const params = {
      mobile: '+155555555',
      locationId: '123',
      taskId: 123,
      cardType: 'task'
    };
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue(params);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    shallow(<WorkerTaskMobile {...props} />);
    expect(history.replace).toHaveBeenCalled();
    const [[{ pathname }]] = history.replace.mock.calls;
    expect(pathname).toBe(URLS.LOGIN(encodeURIComponent(URLS.NOTIFY_MY_TASK_GRP(params.locationId, params.cardType, params.taskId))));
  });

  it('useEffect new user', () => {
    const params = {
      mobile: '+155555555',
      locationId: '123',
      taskId: 123,
      newUser: true,
    };

    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue(params);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<WorkerTaskMobile {...props} />);
    expect(history.replace).toHaveBeenCalled();
    const [[{ pathname }]] = history.replace.mock.calls;
    expect(pathname).toBe(URLS.SIGNUP_TYPE(params.mobile, 'worker'));
  });

  it('useEffect logout', () => {
    const state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          phone: '555555',
        },
      },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<WorkerTaskMobile {...props} />);
  });
});
