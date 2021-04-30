import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Hooks from '../../hooks';

import Tasks from '../../components/pages/location-details/tasks';

describe('LocationDetailsTasks', () => {
  let props;
  let state;

  const history = {
    push: jest.fn(),
  };

  const params = {
    locationId: 'locationId',
    taskId: 'taskId',
  };

  beforeEach(() => {
    global.scrollBy = jest.fn();
    global.scrollTo = jest.fn();
    props = {

    };

    state = {
      electron: {
        shortcuts: []
      },
      bulkSelectTaskArray: [
        {
          'templateId': 8996,
          'templateType': 'Todo',
          'taskType': 'Adhoc',
          'templateName': 'BUSS72W7-Todo',
          'taskId': 26712,
          'task': 'Task One',
          'assignedBy': 'Ryan Trainor',
          'stage': 'Assigned',
          'imageRequired': 0,
          'assignee': 'Ryan Trainor',
          'assigneeUserName': 'rptrainor$gmail.com',
          'assignedByUserName': 'rptrainor$gmail.com',
          'dueDate': '2021-02-12',
          'createdDate': '2021-02-04 22:49:19',
          'createdBy': 'rptrainor$gmail.com',
          'taskRecurring': {
            'startDate': '2021-02-11 00:00:00',
            'nextOccurrenceDate': '2021-02-11 15:15:00',
            'startTime': '15:15:00',
            'endTime': '15:20:00',
            'timeZone': 'America/Los_Angeles'
          },
          'groupCard': false
        },
      ],
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
      loc: {
        data: {
          active: true,
          address: {
            addressLine1: 'South 7th Avenue',
            city: 'Anoka',
            state: 'MN',
            zip: '55303'
          },
          locationUserRole: 'Owner',
          locationDetails: 'Ryans Workspace',
          locationId: 'SCH88LBN',
          locationName: 'Anoka School test',
          locationType: 'School',
          numberofMyTasks: 0,
          numberofTasks: 1,
          numberofZones: 4,
        },
        error: false,
        initialLoading: false,
        inprogress: false
      },
      tasks: {
        items: [{
          stage: 'OPEN',
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
      },
      newTemplate: {
        data: {
          selectedTemplate: true
        }
      },
      customJobs: {
        items: [],
      },
      tasksActions: {
        isDescriptionFocused: false,
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue(params);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Tasks {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('render loading', () => {
    const wrapper = shallow(<Tasks {...props} isLoading />);
    expect(wrapper.length).toBe(1);
  });

  it('setShowNewTask', () => {
    const setShowNewTask = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTask]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);

    const wrapper = shallow(<Tasks {...props} />);
    const showNewTask = wrapper.find('LocationDetailsNewTask').invoke('onDelete');
    showNewTask();
    expect(setShowNewTask).toHaveBeenCalledWith(false);
  });

  it('setShowNewTaskTemplate', () => {
    const setShowNewTaskTemplate = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTaskTemplate]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const showNewTask = wrapper.find('LocationDetailsNewTaskTemplate').invoke('onDelete');
    showNewTask();
    expect(setShowNewTaskTemplate).toHaveBeenCalledWith(false);
  });

  it('handleAddTask', async () => {
    const manageTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    const setShowNewTask = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTask]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const handleAddTask = wrapper.find('LocationDetailsNewTask').invoke('onUpdate');
    await handleAddTask({
      title: 'title',
    });
    expect(manageTask).toHaveBeenCalled();
  });

  it('handleAddTask assign', async () => {
    const manageTask = jest.fn().mockResolvedValueOnce({ taskId: 'someId' });
    const assignTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(manageTask);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(assignTask);
    const setShowNewTask = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTask]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const handleAddTask = wrapper.find('LocationDetailsNewTask').invoke('onUpdate');
    await handleAddTask({
      title: 'title',
      assignData: {
        assignee: '+188888888',
      },
    });
    expect(manageTask).toHaveBeenCalledTimes(1);
    expect(assignTask).toHaveBeenCalledTimes(1);
  });

  it('handleAddTaskTemplate', async () => {
    const setShowNewTaskTemplate = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTaskTemplate]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const handleAddTaskTemplate = wrapper.find('LocationDetailsNewTaskTemplate').invoke('onUpdate');
    await handleAddTaskTemplate({});
  });

  it('handleAddTask failed', async () => {
    const manageTask = jest.fn().mockRejectedValueOnce();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    const setShowNewTask = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTask]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const handleAddTask = wrapper.find('LocationDetailsNewTask').invoke('onUpdate');
    await handleAddTask({
      title: 'title',
    });
    expect(manageTask).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalled();
  });


  it('handleAddTaskTemplate failed', async () => {
    const cloneTemplate = jest.fn().mockRejectedValueOnce();

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(cloneTemplate);
    const setShowNewTaskTemplate = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTaskTemplate]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const handleAddTaskTemplate = wrapper.find('LocationDetailsNewTaskTemplate').invoke('onUpdate');
    await handleAddTaskTemplate();
    expect(history.push).toHaveBeenCalled();
  });


  it('handleAddTask photos', async () => {
    const photos = [{}];
    const uploadImages = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(Hooks, 'useActionDispatch').mockImplementation((fn) => {
      if ('uploadTaskImages' === fn.name) {
        return uploadImages;
      } else {
        return jest.fn().mockResolvedValueOnce({});
      }
    });
    const setShowNewTask = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTask]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    const wrapper = shallow(<Tasks {...props} />);
    const handleAddTask = wrapper.find('LocationDetailsNewTask').invoke('onUpdate');
    await handleAddTask({
      title: 'title',
      photos,
    });
    expect(uploadImages).toHaveBeenCalled();
  });

  it('EmptyLocation', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);

    const s = { ...state, loc: { ...state.loc, data: { ...state.loc.data, numberofTasks: 0 } } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });

    const wrapper = shallow(<Tasks {...props} />);
    expect(wrapper.find('EmptyLocation').length).toBe(0);
    expect(wrapper.find('[data-target="no-task-description"]').length).toBe(0);
  });

  it('no-task-description', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue(['dateCreatedNewest', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce([]);

    const s = { ...state, loc: { ...state.loc, initialLoading: true, data: { ...state.loc.data } } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });

    const wrapper = shallow(<Tasks {...props} />);
    expect(wrapper.find('EmptyLocation').length).toBe(0);
    expect(wrapper.find('[data-target="no-task-description"]').length).toBe(0);
  });

  // it('useEffect locationId', () => {
  //   const getLocationZones = jest.fn();

  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getLocationZones);
  //   shallow(<Tasks {...props} />);
  //   expect(getLocationZones).toHaveBeenCalled();
  // });

  it('useEffect selectedTemplate', () => {
    const setShowNewTaskTemplate = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowNewTaskTemplate]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['tasks', jest.fn()]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    shallow(<Tasks {...props} />);
  });
});
