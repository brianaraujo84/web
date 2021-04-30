import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import TaskCard from '../../components/pages/location-details/task-card';
import Hooks from '../../hooks';
import Utils from '../../utils';

const flushPromises = () => new Promise(setImmediate);

describe('TaskCard', () => {
  let props, propsAssigned, propsReviewed, propsReviewedJob, propsCloned, propsWithOccurrenceDate, state;

  const history = {
    push: jest.fn(),
    replace: jest.fn(),
    location: {
      pathname: '/',
    },
  };

  beforeAll(() => {
    const { location: loc } = window;
    location = loc;
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  beforeEach(() => {
    props = {
      setShowCreateBtn: jest.fn(),
      locationZones: [
        {
          id: 1,
          type: 'Kitchen',
          sequenceOrder: 1,
        },
        {
          id: 2,
          type: 'Office',
          label: 'Entry',
          sequenceOrder: 2,
        },
      ],
      background_save: false,
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      isOnTaskDetailsPage: true,
      showCompleteModal: false,
      updateTaskGroup: jest.fn(),
      locationUserRole: 'Owner',
      task: {
        stage: 'OPEN',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        recurringType: 'Daily',
      },
      index: 1,
    };

    propsAssigned = {
      getLocation: jest.fn(),
      setShowCreateBtn: jest.fn(),
      onRemove: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      locationUserRole: 'Owner',
      task: {
        stage: 'Assign',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        numberofTasks: 3,
        templateName: 'Temp',
        assignee: 'Person',
        assigneeUserName: 'testing$testing.com',
      },
      profile: {
        username: 'another$another.com',
      },
      index: 2,
    };

    propsReviewed = {
      setShowCreateBtn: jest.fn(),
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      task: {
        stage: 'Review',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        numberofTasks: 3,
        templateName: 'Temp',
        assignee: 'Person'
      },
      index: 3,
    };

    propsReviewedJob = {
      setShowCreateBtn: jest.fn(),
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      task: {
        stage: 'Review',
        taskId: 169,
        templateId: 22,
        templateType: 'Main',
        numberofTasks: 3,
        templateName: 'Temp',
        assignee: 'Person',
        groupCard: true
      },
      index: 4,
    };

    propsCloned = {
      setShowCreateBtn: jest.fn(),
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      task: {
        stage: 'Copy',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        numberofTasks: 3,
        templateName: 'Temp',
        assignee: 'Person'
      },
      index: 5,
    };

    propsWithOccurrenceDate = {
      setShowCreateBtn: jest.fn(),
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      setNonGrpJobTasks: jest.fn(),
      nonGrpJobTasks: [{
        stage: 'OPEN',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        recurringType: 'Daily',
        nextOccurrenceDate: '2020-09-01',
        taskRecurring: {
          nextOccurrenceDate: '2020-09-01',
        },
      }],
      task: {
        stage: 'ACCEPTED',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        recurringType: 'Daily',
        nextOccurrenceDate: '2020-09-01',
        taskRecurring: {
          nextOccurrenceDate: '2020-09-01',
        },
      },
      index: 1,
    };

    state = {
      userpreferences: {
        initialLoading: false,
        inprogress: false,
        data: {
          quickCompleteTaskOption: false,
        }

      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
      files: {
        list: {
          predefined: {
            169: [
              { blob: 'blob' },
            ],
          },
          adhoc: {
            169: [
              { blob: 'blob' },
            ],
          },
        },
      },
      templateTasks: {
        data: {
          tasks: [
            {
              stage: 'OPEN',
              task: 'Task 1',
              taskId: 169,
              templateId: 22,
              templateType: 'Todo',
              recurringType: 'Daily',
            },
          ]
        }
      },
      loc: {
        data: {
          locationName: 'SF',
        }
      }
    };

    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);

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
    const wrapper = shallow(<TaskCard {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders templateType main', () => {
    const p = { ...props, task: { ...props.task, templateType: 'Main' } };
    const wrapper = shallow(<TaskCard {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('render Assigned status card', () => {
    const wrapper = shallow(<TaskCard {...propsAssigned} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleAddCommentClick', async () => {

    const wrapper = shallow(<TaskCard {...props} />);
    expect(wrapper.length).toBe(1);

    const handleAddCommentClick = wrapper.find('[data-target="button-add-comment"]').at(0).invoke('onClick');
    await handleAddCommentClick();
  });

  it('handleRemove', async () => {
    const setShowDeleteModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeleteModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);

    const manageTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    const wrapper = shallow(<TaskCard {...props} />);
    expect(wrapper.length).toBe(1);

    const handleCancel = wrapper.find('[data-target="delete-modal"]').at(0).invoke('onCancel');
    const handleRemove = wrapper.find('[data-target="delete-modal"]').at(0).invoke('onConfirm');
    handleCancel();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
    await handleRemove();
    expect(manageTask).toHaveBeenCalled();
    expect(props.onRemove).toHaveBeenCalled();
  });

  it('handleRemove job', async () => {
    const p = { ...props, task: { ...props.task, numberofTasks: 3 } };
    const setShowDeleteModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeleteModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);

    const manageTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(manageTask);
    const wrapper = shallow(<TaskCard {...p} />);
    expect(wrapper.length).toBe(1);

    const handleCancel = wrapper.find('[data-target="delete-modal"]').at(0).invoke('onCancel');
    const handleRemove = wrapper.find('[data-target="delete-modal"]').at(0).invoke('onConfirm');
    handleCancel();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
    await handleRemove();
    expect(manageTask).toHaveBeenCalled();
    expect(props.onRemove).toHaveBeenCalled();
  });

  it('updateSchedule', async () => {
    const setShowScheduleModal = jest.fn();
    const manageTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowScheduleModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ repeat: 'OneTime' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());


    const wrapper = shallow(<TaskCard {...props} />);

    const updateSchedule = wrapper.find('LocationDetailsScheduleModal').invoke('onUpdate');
    await updateSchedule({});
    expect(manageTask).toHaveBeenCalled();
  });

  it('updateSchedule without data', () => {
    const setShowScheduleModal = jest.fn();
    const manageTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowScheduleModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const wrapper = shallow(<TaskCard {...props} />);

    const updateSchedule = wrapper.find('LocationDetailsScheduleModal').invoke('onUpdate');
    updateSchedule();
    expect(setShowScheduleModal).toHaveBeenCalled();
  });

  it('onClose of LocationDetailsScheduleModal', () => {
    const setShowScheduleModal = jest.fn();
    const manageTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowScheduleModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ repeat: 'OneTime' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const wrapper = shallow(<TaskCard {...props} />);

    const onClose = wrapper.find('LocationDetailsScheduleModal').invoke('onClose');
    onClose();
    expect(manageTask).toHaveBeenCalled();
  });

  it('setShowTaskDetails', () => {
    const p = {
      setShowCreateBtn: jest.fn(),
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      task: {
        stage: 'OPEN',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        recurringType: 'Daily',
        taskDescription: 'description',
      },
      index: 1,
    };

    const setShowTaskDetails = jest.fn();
    const setShowEditTaskDescription = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTaskDetails]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowEditTaskDescription]);
    const wrapper = shallow(<TaskCard {...p} />);
    const toggleTaskDetails = wrapper.find('[data-target="toggle-task-details"]').invoke('onClick');
    toggleTaskDetails();
    expect(setShowTaskDetails).toHaveBeenCalled();
  });

  it('setShowAssignModal', () => {
    const setShowAssignModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<TaskCard {...props} />);
    const showModal = wrapper.find('[data-target="button-toggle-show-assign"]').invoke('onClick');
    showModal();
    expect(setShowAssignModal).toHaveBeenCalled();
    const callback = setShowAssignModal.mock.calls[0][0];
    expect(callback(true)).toBe(false);
  });

  it('updateAssign', async () => {
    const setShowAssignModal = jest.fn();
    const assignTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ repeat: 'OneTime' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(assignTask);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());


    const wrapper = shallow(<TaskCard {...props} />);

    const updateAssign = wrapper.find('LocationDetailsAssignModal').invoke('onUpdate');
    await updateAssign({});
    expect(assignTask).toHaveBeenCalled();
  });

  it('updateAssign without data', () => {
    const setShowAssignModal = jest.fn();
    const assignTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ repeat: 'OneTime' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(assignTask);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const wrapper = shallow(<TaskCard {...props} />);
    const updateAssign = wrapper.find('LocationDetailsAssignModal').invoke('onUpdate');
    updateAssign();
    expect(assignTask).toHaveBeenCalled();
  });

  it('onClose of LocationDetailsAssignModal', () => {
    const setShowAssignModal = jest.fn();
    const assignTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ repeat: 'OneTime' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(assignTask);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());


    const wrapper = shallow(<TaskCard {...props} />);

    const onClose = wrapper.find('LocationDetailsAssignModal').invoke('onClose');
    onClose();
    expect(assignTask).toHaveBeenCalled();
  });

  it('toggleAssignModal', () => {
    const setShowAssignModal = jest.fn();
    const event = {
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<TaskCard {...propsAssigned} />);
    const toggleAssignModal = wrapper.find('[data-target="button-toggle-show-edit-assign"]').invoke('onClick');
    toggleAssignModal(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setShowAssignModal).toHaveBeenCalled();
    const callback = setShowAssignModal.mock.calls[0][0];
    expect(callback(false)).toBe(true);
  });

  it('setShowZoneModal', () => {
    const setShowZoneModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowZoneModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleAddZoneClick = wrapper.find('EllipsisMenuV2').invoke('handleAddZoneClick');
    handleAddZoneClick();
    expect(setShowZoneModal).toHaveBeenCalled();
  });

  it('associate', async () => {
    const setShowZoneModal = jest.fn();
    const manageTask = jest.fn().mockReturnValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowZoneModal]);

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);

    const wrapper = shallow(<TaskCard {...propsWithOccurrenceDate} />);
    const associateZoneToTask = wrapper.find('LocationDetailsAssociateZoneModal').invoke('onAssociate');
    await associateZoneToTask('locationId');
    expect(manageTask).toHaveBeenCalled();
    expect(setShowZoneModal).toHaveBeenCalled();
  });

  it('onClose AssociateZoneModal', () => {
    const setShowZoneModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowZoneModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const closeModal = wrapper.find('LocationDetailsAssociateZoneModal').invoke('onClose');
    closeModal();
    expect(setShowZoneModal).toHaveBeenCalled();
  });

  it('openReassignModal', () => {
    const setShowReassignModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowReassignModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const openReassignModal = wrapper.find('RejectTaskModal').invoke('onReassign');
    openReassignModal();
    expect(setShowReassignModal).toHaveBeenCalledWith(true);
  });

  it('handleShowTaskDetails', () => {
    const setShowTaskDetails = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowTaskDetails]);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleShowTaskDetails = wrapper.find('[data-target="toggle-task-details"]').invoke('onClick');
    handleShowTaskDetails();
    expect(setShowTaskDetails).toHaveBeenCalled();
  });

  it('handleJobAcceptance', async () => {
    const setShowRejectJobModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRejectJobModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const onReject = wrapper.find('RejectJobModal').invoke('onReject');
    onReject();
    await flushPromises();
    expect(setShowRejectJobModal).toHaveBeenCalled();
  });

  it('handleReassignTaking', async () => {
    const manageTask = jest.fn().mockResolvedValue({ taskId: 'id', templateId: '42' });
    const values = {
      photos: ['photo'],
    };
    const setShowReassignModal = jest.fn();
    const setShowRejectModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRejectModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowReassignModal]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    jest.spyOn(Utils, 'toBase64Array').mockImplementation(() => Promise.resolve(['1']));

    const wrapper = shallow(<TaskCard {...propsWithOccurrenceDate} />);
    const handleReassignTaking = wrapper.find('AssignTaskModal').invoke('onReassign');
    handleReassignTaking(values);

    await flushPromises();
    expect(Utils.toBase64Array).toHaveBeenCalled();
    expect(setShowReassignModal).toHaveBeenCalledWith(false);
    expect(setShowRejectModal).toHaveBeenCalledWith(false);
  });

  it('handleRejectTask', async () => {
    const setShowRejectModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRejectModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleRejectTask = wrapper.find('RejectTaskModal').invoke('onReject');
    handleRejectTask();
    await flushPromises();
    expect(setShowRejectModal).toHaveBeenCalledWith(false);
  });

  it('openRejectModal', () => {
    const setShowRejectModal = jest.fn();
    const setExpandReviewTask = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowRejectModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setExpandReviewTask]);

    const wrapper = shallow(<TaskCard {...propsReviewed} />);
    const openRejectModal = wrapper.find('[data-target="task-reject-button"]').invoke('onClick');
    openRejectModal();
    expect(setShowRejectModal).toHaveBeenCalledWith(true);
  });

  it('openRejectJobModal', () => {
    const setShowRejectJobModal = jest.fn();
    const setExpandReviewTask = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowRejectJobModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setExpandReviewTask]);

    const wrapper = shallow(<TaskCard {...propsReviewedJob} />);
    const openRejectJobModal = wrapper.find('[data-target="job-reject-button"]').invoke('onClick');
    openRejectJobModal();
    expect(setShowRejectJobModal).toHaveBeenCalledWith(true);
  });

  it('handleShowEditDescription', async () => {
    const manageTask = jest.fn().mockResolvedValue({ taskId: 'id' });
    const setShowTaskDetails = jest.fn();
    const setShowEditTaskDescription = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTaskDetails]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowEditTaskDescription]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleShowEditDescription = wrapper.find('EllipsisMenuV2').invoke('handleShowEditDescription');
    handleShowEditDescription();
    expect(setShowTaskDetails).toHaveBeenCalledWith(true);
    expect(setShowEditTaskDescription).toHaveBeenCalledWith(true);
  });

  it('handleSaveTitleForTemplateTask', () => {
    const manageTask = jest.fn().mockResolvedValue({ taskId: 'id' });
    const setShowEditTitle = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowEditTitle]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleSaveTitle = wrapper.find('[data-target="save-title-button"]').invoke('onClick');

    handleSaveTitle();
    expect(setShowEditTitle).toHaveBeenCalledWith(false);
    expect(manageTask).toHaveBeenCalled();
  });

  it('handleSaveTitleForCustomTask', () => {
    const p = {
      setShowCreateBtn: jest.fn(),
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      task: {
        stage: 'OPEN',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        recurringType: 'Daily',
        custom: true,
      },
      index: 1,
    };

    const manageTask = jest.fn().mockResolvedValue({ taskId: 'id' });
    const manageCustomJob = jest.fn().mockResolvedValue({ taskId: 'id' });
    const setShowEditTitle = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowEditTitle]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageTask);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageCustomJob);

    const wrapper = shallow(<TaskCard {...p} />);
    const handleSaveTitle = wrapper.find('[data-target="save-title-button"]').invoke('onClick');

    handleSaveTitle();
    expect(setShowEditTitle).toHaveBeenCalledWith(false);
    expect(manageCustomJob).toHaveBeenCalled();
    expect(manageTask).toHaveBeenCalledTimes(0);
  });

  it('useEffect isCloneTask', () => {
    const setShowEditTitle = jest.fn();
    const getLinks = jest.fn(() => new Promise(() => { }));

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowEditTitle]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getLinks);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    shallow(<TaskCard {...propsCloned} />);
    expect(setShowEditTitle).toHaveBeenCalledWith(true);
  });

  it('useEffect loadImages', () => {
    const loadImages = jest.fn();
    const getLinks = jest.fn(() => new Promise(() => { }));

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getLinks);
    jest.spyOn(React, 'useCallback').mockReturnValue(loadImages);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    shallow(<TaskCard {...props} />);
    expect(loadImages).not.toHaveBeenCalled();
  });

  it('handleDiscardTitle', () => {
    const setShowEditTitle = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowEditTitle]);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleSaveTitle = wrapper.find('[data-target="discard-title-button"]').invoke('onClick');
    handleSaveTitle();
    expect(setShowEditTitle).toHaveBeenCalledWith(false);
  });

  it('toggle schedule modal', () => {
    const setShowScheduleModal = jest.fn();
    const event = {
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowScheduleModal]);

    const wrapper = shallow(<TaskCard {...propsWithOccurrenceDate} />);
    const toggleScheduleModal = wrapper.find('[data-target="button-toggle-show-schedule-date"]').invoke('onClick');
    toggleScheduleModal(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setShowScheduleModal).toHaveBeenCalled();
  });

  it('onAssign', () => {
    const setShowAssignModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);

    const wrapper = shallow(<TaskCard {...props} />);
    const onAssign = wrapper.find('[data-target="button-toggle-show-assign"]').invoke('onClick');
    onAssign();
    expect(setShowAssignModal).toHaveBeenCalled();
  });

  it('loadImages useCallback', async () => {
    const getTaskImagesList = jest.fn().mockResolvedValue([]);
    const getTaskActivityImagesList = jest.fn().mockResolvedValue([]);

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskImagesList);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskActivityImagesList);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    shallow(<TaskCard {...props} />);
    expect(getTaskImagesList).not.toHaveBeenCalled();
    expect(getTaskActivityImagesList).not.toHaveBeenCalled();
  });

  it('AssignTaskModal onCancel', () => {
    const setShowReassignModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowReassignModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const onCancel = wrapper.find('AssignTaskModal').invoke('onCancel');
    onCancel();
    expect(setShowReassignModal).toHaveBeenCalledWith(false);
  });

  it('RejectJobModal onCancel', () => {
    const setShowRejectJobModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRejectJobModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const onCancel = wrapper.find('RejectJobModal').invoke('onCancel');
    onCancel();
    expect(setShowRejectJobModal).toHaveBeenCalledWith(false);
  });

  it('RejectJobModal onReassign', async () => {
    const setShowRejectJobModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRejectJobModal]);

    const wrapper = shallow(<TaskCard {...propsWithOccurrenceDate} />);
    const onReassign = wrapper.find('RejectJobModal').invoke('onReassign');
    onReassign();
    await flushPromises();
    expect(setShowRejectJobModal).toHaveBeenCalled();
  });

  it('RejectTaskModal onCancel', () => {
    const setRejectModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setRejectModal]);

    const wrapper = shallow(<TaskCard {...props} />);
    const onCancel = wrapper.find('RejectTaskModal').invoke('onCancel');
    onCancel();
    expect(setRejectModal).toHaveBeenCalledWith(false);
  });

  // it('useEffect assignData', async () => {
  //   const assignData = {
  //     assigneeUserName: 'username',
  //     assignee: 'assignee',
  //     assigneeName: 'assigneeName',
  //   };
  //   const setAssignData = jest.fn();

  //   jest.spyOn(React, 'useState').mockReturnValueOnce([{taskDescription: ''}, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([assignData, setAssignData]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(jest.fn());
  //   jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
  //   jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
  //   jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
  //   jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

  //   shallow(<TaskCard {...props} />);
  //   await flushPromises();
  //   expect(setAssignData).toHaveBeenCalledWith(false);
  // });

  it('handleShowEditTask', () => {
    const setShowEditTitle = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowEditTitle]);

    const wrapper = shallow(<TaskCard {...props} />);
    const handleShowEditTask = wrapper.find('[data-target="task-title"]').invoke('onClick');
    handleShowEditTask();
    expect(setShowEditTitle).toHaveBeenCalledWith(true);
  });

  it('useEffect RequireImageVerification', async () => {
    const setImageRequired = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, setImageRequired]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    shallow(<TaskCard {...props} />);
    await flushPromises();
    expect(setImageRequired).toHaveBeenCalled();
  });

  it('RequireImageVerificationModal onSelectItem', async () => {
    const setShowRequireImageVerificationModal = jest.fn();
    const manageTask = jest.fn().mockResolvedValue({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRequireImageVerificationModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(manageTask);

    const wrapper = shallow(<TaskCard {...props} />);
    const onSelectItem = wrapper.find('LocationDetailsRequireImageVerificationModal').invoke('onSelectItem');
    onSelectItem();
    expect(setShowRequireImageVerificationModal).toHaveBeenCalled();
    expect(manageTask).toHaveBeenCalled();
  });

  it('RequireImageVerificationModal onCancel', () => {
    const setShowRequireImageVerificationModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{ task: '', taskDescription: '' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRequireImageVerificationModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);

    const wrapper = shallow(<TaskCard {...props} />);
    const onCancel = wrapper.find('LocationDetailsRequireImageVerificationModal').invoke('onClose');
    onCancel();
    expect(setShowRequireImageVerificationModal).toHaveBeenCalledWith(false);
  });
});
