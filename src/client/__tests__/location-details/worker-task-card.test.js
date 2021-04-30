import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import WorkerTaskCard from '../../components/pages/location-details/worker-task-card';
import Hooks from '../../hooks';
import * as StorageUtils from '../../utils/storage-utils';

describe('WorkerTaskCard', () => {
  let props, propsAccepted, state;

  const history = {
    push: jest.fn(),
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
      updateTaskInNonGrpJobTasks: jest.fn(),
      getLocation: jest.fn(),
      task: {
        stage: 'assigned',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        modifiedDate: '2020-12-04 16:38:55',
        groupCard: true
      },
      index: 1,
    };

    propsAccepted = {
      getLocation: jest.fn(),
      task: {
        stage: 'accepted',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        numberofTasks: 3,
        templateName: 'Temp',
        assignee: 'Person',
        groupCard: true
      },
      index: 1,
    };

    state = {
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
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          isWorker: true,
        },
      },
      templateTasks: {
        data: [],
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
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders templateType main', () => {
    const p = { ...props, task: { ...props.task, templateType: 'Main' } };
    const wrapper = shallow(<WorkerTaskCard {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('render Accepted status card', () => {
    const wrapper = shallow(<WorkerTaskCard {...propsAccepted} />);
    expect(wrapper.length).toBe(1);
  });

  it('setShowTaskDetails', () => {
    const setShowTaskDetails = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTaskDetails]);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const toggleTaskDetails = wrapper.find('[data-target="toggle-task-details"]').invoke('onClick');
    toggleTaskDetails(show => !show);
    expect(setShowTaskDetails).toHaveBeenCalled();
  });

  it('handleAcceptanceTask for accept', () => {
    const acceptOrDeclineTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(acceptOrDeclineTask);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const handleAcceptanceTask = wrapper.find('[data-target="accept-task"]').invoke('onClick');
    handleAcceptanceTask('accepted');
    expect(acceptOrDeclineTask).toHaveBeenCalled();
  });

  it('handleClickStartTask without popup modal', () => {
    const p = { getLocation: jest.fn(), index: 1, task: { stage: 'Accepted', groupCard: true, task: 'Task 1', taskId: 169, templateId: 22, templateType: 'Todo', modifiedDate: '01/01/2021' } };
    const startTask = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(StorageUtils, 'getItem').mockReturnValueOnce(true);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(startTask);
    const wrapper = shallow(<WorkerTaskCard {...p} />);
    const handleClickStartTask = wrapper.find('[data-target="start-task"]').invoke('onClick');
    handleClickStartTask();
    expect(startTask).toHaveBeenCalled();
  });

  it('handleClickStartTask with popup modal', () => {
    const setShowTaskStart = jest.fn();
    const p = { getLocation: jest.fn(), index: 1, task: { stage: 'Accepted', task: 'Task 1', taskId: 169, groupCard: true, templateId: 22, templateType: 'Todo', modifiedDate: '2020-12-04 16:11:20' } };

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTaskStart]);
    jest.spyOn(StorageUtils, 'getItem').mockReturnValue(false);
    const wrapper = shallow(<WorkerTaskCard {...p} />);
    const handleClickStartTask = wrapper.find('[data-target="start-task"]').invoke('onClick');
    handleClickStartTask();
    expect(setShowTaskStart).toHaveBeenCalledWith(true);
  });

  it('capture photo button click ', () => {
    const shouldCompleteTask = {
      current: false,
    };

    const imageInputRef = {
      current: {
        click: jest.fn(),
      },
    };
    const p = { getLocation: jest.fn(), index: 1, task: { stage: 'In Progress', task: 'Task 1', groupCard: true, taskId: 169, templateId: 22, templateType: 'Todo', modifiedDate: '2020-12-04 16:11:20', imageRequired: 1 }, canStartToday: false };
    const completeTask = jest.fn().mockResolvedValueOnce({});
    const setShowAddImage = jest.fn();
    jest.spyOn(React, 'useRef').mockReturnValueOnce(shouldCompleteTask);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAddImage]);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(completeTask);
    const wrapper = shallow(<WorkerTaskCard {...p} />);
    const handleAddImageButtonClick = wrapper.find('[data-target="add-image-btn"]').invoke('onClick');
    handleAddImageButtonClick();
    expect(imageInputRef.current.click).toHaveBeenCalled();
    expect(completeTask).toHaveBeenCalled();
  });

  it('capture screenshot button click', () => {
    const shouldCompleteTask = {
      current: false,
    };

    const imageInputRef = {
      current: {
        click: jest.fn(),
      },
    };
    const p = { getLocation: jest.fn(), index: 1, task: { stage: 'In Progress', task: 'Task 1', groupCard: true, taskId: 169, templateId: 22, templateType: 'Todo', modifiedDate: '2020-12-04 16:11:20', imageRequired: 2 }, canStartToday: false };
    const completeTask = jest.fn().mockResolvedValueOnce({});
    const setShowScreenshotModal = jest.fn();

    jest.spyOn(React, 'useRef').mockReturnValueOnce(shouldCompleteTask);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
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
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowScreenshotModal]);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(true);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(completeTask);
    const wrapper = shallow(<WorkerTaskCard {...p} />);
    const handleAddScreenshotButtonClick = wrapper.find('[data-target="add-screenshot-btn"]').invoke('onClick');
    handleAddScreenshotButtonClick();
    expect(setShowScreenshotModal).toHaveBeenCalled();
  });

  it('handleCloseTaskStart', () => {
    const setShowTaskStart = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTaskStart]);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const handleCloseTaskStart = wrapper.find('TaskStartModal').invoke('onClose');
    handleCloseTaskStart();
    expect(setShowTaskStart).toHaveBeenCalledWith(false);
  });

  it('handleStartConfirm', () => {
    const setShowTaskStart = jest.fn();
    const p = { getLocation: jest.fn(), index: 1, task: { stage: 'Accepted', task: 'Task 1', groupCard: true, taskId: 169, templateId: 22, templateType: 'Todo', modifiedDate: '2020-12-04 16:11:20' } };
    const startTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTaskStart]);
    jest.spyOn(StorageUtils, 'getItem').mockReturnValueOnce(true);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(startTask);
    const wrapper = shallow(<WorkerTaskCard {...p} />);
    const handleStartConfirm = wrapper.find('TaskStartModal').invoke('onConfirm');
    handleStartConfirm();
    expect(setShowTaskStart).toHaveBeenCalledWith(false);
    expect(startTask).toHaveBeenCalled();
  });

  it('Show decline job modal', () => {
    const setShowDeclineJob = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeclineJob]);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const onClick = wrapper.find('[data-target="decline-task"]').invoke('onClick');
    onClick();
    expect(setShowDeclineJob).toHaveBeenCalledWith(true);
  });

  it('Close decline job modal', () => {
    const setShowDeclineJob = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeclineJob]);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const onCancel = wrapper.find('DeclineJobModal').invoke('onCancel');
    onCancel();
    expect(setShowDeclineJob).toHaveBeenCalledWith(false);
  });

  it('Confirm decline job', () => {
    const setShowDeclineJob = jest.fn();
    const acceptOrDeclineTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeclineJob]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(acceptOrDeclineTask);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const onDecline = wrapper.find('DeclineJobModal').invoke('onDecline');
    onDecline();
    expect(setShowDeclineJob).toHaveBeenCalledWith(false);
    expect(acceptOrDeclineTask).toHaveBeenCalled();
  });

  it('AddImageModal onClose', () => {
    const setShowAddImage = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAddImage]);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const onClose = wrapper.find('LocationDetailsAddImageModal').invoke('onClose');
    onClose();
    expect(setShowAddImage).toHaveBeenCalled();
  });

  it('handleCompleteTask with can\'t start today', () => {
    const setShowAddImage = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAddImage]);
    const wrapper = shallow(<WorkerTaskCard {...props} />);
    const handleCompleteTask = wrapper.find('LocationDetailsAddImageModal').invoke('onUpload');
    handleCompleteTask();
  });

  // it('useEffect showTaskDetails', () => {
  //   const loadImages = jest.fn();

  //   jest.spyOn(React, 'useCallback').mockReturnValueOnce(loadImages);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce(true, jest.fn());
  //   jest.spyOn(React, 'useEffect').mockImplementation(f => f());
  //   shallow(<WorkerTaskCard {...props} />);
  //   expect(loadImages).toHaveBeenCalled();
  // });
});
