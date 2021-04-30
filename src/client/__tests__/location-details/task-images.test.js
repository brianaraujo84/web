import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import Hooks from '../../hooks';
import TasksImages from '../../components/pages/location-details/task-images';

describe('TaskImages', () => {
  let props, props2, state;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      task: {
        taskId: 123,
      },
      isJob: true,
      loadImages: jest.fn(),
    };
    props2 = {
      task: {
        taskId: 123,
      },
      isJob: false,
      loadImages: jest.fn(),
    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          isWorker: false,
        },
      },
      files: {
        inprogress: false,
        list: {
          adhoc: {
            123: [{
              name: 'name',
              url: 'url',
            }],
          }
        },
        activityList: {},
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly TaskImages', () => {
    const wrapper = shallow(<TasksImages {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const wrapper = shallow(<TasksImages {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('deleteImage', () => {
    const taskImages = [{ url: 'abc.png', name: 'abc.png' }];
    jest.spyOn(React, 'useState').mockReturnValueOnce([taskImages, jest.fn()]);

    const deleteTaskImg = jest.fn().mockResolvedValue({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(deleteTaskImg);

    const s = {
      ...state,
      files: {
        inprogress: false,
        list: {
          predefined: {
            123: [{
              name: 'name',
              url: 'url',
            }],
          }
        },
        activityList: {},
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });

    const wrapper = shallow(<TasksImages {...props} />);
    const deleteImage = wrapper.find('[data-target="task-image"]').invoke('onDelete');
    deleteImage('abc.png');

    expect(deleteTaskImg).toHaveBeenCalled();
  });

  it('deleteImage of adhoc', () => {
    const taskImages = [{ url: 'abc.png', name: 'abc.png' }];
    jest.spyOn(React, 'useState').mockReturnValueOnce([taskImages, jest.fn()]);
    const getTaskImagesList = jest.fn().mockResolvedValue({ list: [] });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getTaskImagesList);

    const deleteTaskImg = jest.fn().mockResolvedValue({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(deleteTaskImg);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const wrapper = shallow(<TasksImages {...props2} />);
    const deleteImage = wrapper.find('[data-target="task-image"]').invoke('onDelete');
    deleteImage('abc.png');

    expect(deleteTaskImg).toHaveBeenCalled();
  });
});
