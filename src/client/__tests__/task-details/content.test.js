import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Content from '../../components/pages/task-details/content';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }) => children,
}));

describe('Content', () => {
  let props, state;
  let propsWithReviewTask, propsWithAssignedTask;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      task: {
        stage: 'OPEN',
        task: 'COVID-19 Template',
        templateId: 200,
        templateType: 'Todo',
        recurringType: 'Daily',
      },
      updateTasks: jest.fn(),
    };
    
    propsWithReviewTask = {
      task: {
        stage: 'Review',
        task: 'COVID-19 Template',
        templateId: 200,
        templateType: 'Main',
        recurringType: 'Daily',
      },
      updateTasks: jest.fn(),
      locationUserRole: 'Owner',
    };
    
    propsWithAssignedTask = {
      task: {
        stage: 'Assigned',
        task: 'COVID-19 Template',
        templateId: 200,
        templateType: 'Main',
        recurringType: 'Daily',
        assignee: 'tester',
        taskRecurring: {
          nextOccurrenceDate: '2020-09-09',
        }
      },
      updateTasks: jest.fn(),
      my: false,
      isOwnerManager: true,
    };

    state = {
      contacts: {
        items: [],
      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          isWorker: false,
        },
      },
      taskGroupFilters: { data: {} },
      templateTasks: { data: {} },
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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('updateAssign', () => {
    const setAssignData = jest.fn();
    const setShowAssignModal = jest.fn();
    const setShowNavToAssignedTaskModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setAssignData]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNavToAssignedTaskModal]);

    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);

    const updateAssign = wrapper.find('LocationDetailsAssignModal').invoke('onUpdate');
    updateAssign();
    expect(setAssignData).toHaveBeenCalled();
    expect(setShowAssignModal).toHaveBeenCalledWith(false);
  });

  it('updateSchedule', () => {
    const setScheduleData = jest.fn();
    const setShowScheduleModal = jest.fn();
    const setShowNavToAssignedTaskModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNavToAssignedTaskModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowScheduleModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setScheduleData]);

    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);

    const updateAssign = wrapper.find('LocationDetailsScheduleModal').invoke('onUpdate');
    updateAssign();
    expect(setScheduleData).toHaveBeenCalled();
    expect(setShowScheduleModal).toHaveBeenCalledWith(false);
  });

  it('handleUpdateTask', async () => {
    const setShowEditTitle = jest.fn();
    const setShowNavToAssignedTaskModal = jest.fn();
    const groupManage = jest.fn().mockResolvedValue({});
    const manageTask = jest.fn().mockResolvedValue({});
    const setScheduleData = jest.fn();
    const scheduleData = {
      repeat: 'Daily',
      startTime: '10:00',
      endTime: '10:15',
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowEditTitle]);    
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNavToAssignedTaskModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([scheduleData, setScheduleData]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(groupManage);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(manageTask);
    //jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<Content {...props} />);
    //expect(manageTask).toHaveBeenCalled();
    await flushPromises();
    //expect(setScheduleData).toHaveBeenCalledWith(false);
    //expect(props.updateTasks).toHaveBeenCalled();
  });

  it('handleAssignTask', async () => {
    const assignTask = jest.fn().mockResolvedValue({});
    const setAssignData = jest.fn();
    const assignData = {
      assigneeUserName: 'tester',
    };
    
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([assignData, setAssignData]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(assignTask);
    //jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<Content {...props} />);
    //expect(assignTask).toHaveBeenCalled();
    await flushPromises();
    //expect(setAssignData).toHaveBeenCalledWith(false);
    //expect(props.updateTasks).toHaveBeenCalled();
  });

  it('handleTaskTaking', async () => {

    const wrapper = shallow(<Content {...propsWithReviewTask} />);
    const handleTaskTaking = wrapper.find('[data-target="task-done-button"]').invoke('onClick');
    handleTaskTaking();
  });

  it('handleJobAcceptance', async () => {
    const setShowNavToAssignedTaskModal = jest.fn();
    const setShowRejectJobModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNavToAssignedTaskModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRejectJobModal]);
    const wrapper = shallow(<Content {...props} />);
    const handleJobAcceptance = wrapper.find('RejectJobModal').invoke('onReject');
    handleJobAcceptance();
    await flushPromises();
    expect(setShowRejectJobModal).toHaveBeenCalled();
  });

  it('handleAcceptanceTask with accept task', async () => {
    const acceptOrDeclineTask = jest.fn().mockResolvedValue({});
    const s = {
      contacts: {
        items: [],
      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          isWorker: true,
        },
      },
      templateTasks: { data: {} },
    };
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(acceptOrDeclineTask);
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Content {...propsWithAssignedTask} />);
    const handleAcceptanceTask = wrapper.find('[data-target="accept-task"]').invoke('onClick');
    handleAcceptanceTask();
    expect(acceptOrDeclineTask).toHaveBeenCalled();
    await flushPromises();
    expect(propsWithAssignedTask.updateTasks).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalled();
  });

  it('Show decline job confirmation modal', () => {
    const setShowDeclineJob = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeclineJob]);
    const s = {
      contacts: {
        items: [],
      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          isWorker: true,
        },
      },
      templateTasks: { data: {} },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Content {...propsWithAssignedTask} />);
    const onClick = wrapper.find('[data-target="decline-task"]').invoke('onClick');
    onClick();
    expect(setShowDeclineJob).toHaveBeenCalledWith(true);
  });

  it('Closes decline job modal', () => {
    const setShowDeclineJob = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeclineJob]);
    const wrapper = shallow(<Content {...propsWithAssignedTask} />);
    const onCancel = wrapper.find('DeclineJobModal').invoke('onCancel');
    onCancel();
    expect(setShowDeclineJob).toHaveBeenCalledWith(false);
  });

  it('handleAcceptanceTask with decline task after confirming the modal', async () => {
    const setShowDeclineJob = jest.fn();
    const acceptOrDeclineTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeclineJob]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(acceptOrDeclineTask);
    const wrapper = shallow(<Content {...propsWithAssignedTask} />);
    const onDecline = wrapper.find('DeclineJobModal').invoke('onDecline');
    onDecline();
    expect(acceptOrDeclineTask).toHaveBeenCalled();
    await flushPromises();
    expect(propsWithAssignedTask.updateTasks).toHaveBeenCalled();
    expect(history.push).toHaveBeenCalled();
  });

  it('handleToggleAssignModal', () => {
    const e = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    const setShowAssignModal = jest.fn();
    const setIsCurrentUserOwnerOrManager = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsCurrentUserOwnerOrManager]);
    jest.spyOn(React, 'useMemo').mockReturnValue(true);
    const wrapper = shallow(<Content {...propsWithAssignedTask} />);
    const handleToggleAssignModal = wrapper.find('[data-target="button-toggle-show-edit-assign"]').invoke('onClick');
    handleToggleAssignModal(e);
    expect(e.stopPropagation).toHaveBeenCalled();
    expect(e.preventDefault).toHaveBeenCalled();
    expect(setShowAssignModal).toHaveBeenCalled();
  });

  it('handleToggleScheduleModal', () => {
    const setShowNavToAssignedTaskModal = jest.fn();
    const e = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    const setShowScheduleModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowNavToAssignedTaskModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowScheduleModal]);
    const wrapper = shallow(<Content {...propsWithAssignedTask} />);
    const handleToggleScheduleModal = wrapper.find('[data-target="button-toggle-show-edit-schedule"]').invoke('onClick');
    handleToggleScheduleModal(e);
    expect(e.stopPropagation).toHaveBeenCalled();
    expect(e.preventDefault).toHaveBeenCalled();
    expect(setShowScheduleModal).toHaveBeenCalled();
  });

  it('show RejectJobModal', () => {
    const setShowNavToAssignedTaskModal = jest.fn();
    const setShowRejectJobModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowNavToAssignedTaskModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowRejectJobModal]);
    const wrapper = shallow(<Content {...propsWithReviewTask} />);
    const onClick = wrapper.find('[data-target="reject-job"]').invoke('onClick');
    onClick();
    expect(setShowRejectJobModal).toHaveBeenCalledWith(true);
  });
});
