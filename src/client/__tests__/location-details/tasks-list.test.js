import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import TasksList from '../../components/pages/location-details/tasks-list';

describe('TaskCard', () => {
  let props, state;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      getLocation: jest.fn(),
      handleRemove: jest.fn(),
      locationUserRole: 'Owner',
      tasks: [{
        stage: 'Open',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo'
      },
      {
        stage: 'OPEN',
        task: 'Task 2',
        taskId: 169,
        templateId: 23,
        templateType: 'Todo'
      }]
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

  it('renders correctly TaskCard', () => {
    const wrapper = shallow(<TasksList {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders correctly WorkerTaskCard', () => {
    state = { profile: { loggedIn: true, data: { email: 'no@no.com', firstname: 'John', lastname: 'Doe', isWorker: true } } };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    const wrapper = shallow(<TasksList {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleRemove', () => {
    const wrapper = shallow(<TasksList {...props} />);
    expect(wrapper.length).toBe(1);

    const handleRemove = wrapper.find('TaskCard').at(0).invoke('onRemove');
    handleRemove();
    expect(props.handleRemove).toHaveBeenCalledWith(0);
  });
});
