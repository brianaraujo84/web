import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import WorkerJobTaskCard from '../../components/pages/task-details/worker-job-task-card';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('TaskDetails', () => {
  let props, propsInProgress, state;
  
  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      task: {
        stage: 'open',
        nextOccurrenceDate: new Date(),
      },
      templateImageObj: {
        taskIdMapping: {},
      },
      previousTask: {},
      taskIdx: 1,
      locationZoneId: 1,
      workingOnTaskId: 0,
      isLastTaskOfJob: false,
      taskSummary: { assigneeUserName: 'userA', assignedByUserName: 'userB' },
    };
    propsInProgress = {
      task: {
        stage: 'in progress',
        nextOccurrenceDate: new Date(),
        imageRequired: 1,
      },
      templateImageObj: {
        taskIdMapping: {},
      },
      previousTask: {},
      taskIdx: 1,
      locationZoneId: 1,
      workingOnTaskId: 0,
      isLastTaskOfJob: false,
      taskSummary: { assigneeUserName: 'userA', assignedByUserName: 'userB', stage: 'open' },
    };
    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          status: 'Review'
        },
      },
      taskGroupFilters: { data: {} },
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

  it('render correctly', () => {
    const wrapper = shallow(<WorkerJobTaskCard {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleStartTask without handling', async () => {
    const startTask = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(startTask);
    const wrapper = shallow(<WorkerJobTaskCard {...props} workingOnTaskId={1} />);
    const handleStartTask = wrapper.find('[data-target="start-task"]').invoke('onClick');
    handleStartTask();
    expect(startTask).not.toHaveBeenCalled();
  });

  it('handleCompleteTask', async () => {
    const completeTask = jest.fn().mockResolvedValueOnce({});
    const getTaskTemplateInfo = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskTemplateInfo);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(completeTask);
    const wrapper = shallow(<WorkerJobTaskCard {...props} />);
    const handleCompleteTask = wrapper.find('LocationDetailsAddImageModal').invoke('onUpload');
    handleCompleteTask();
    expect(completeTask).toHaveBeenCalled();
    await flushPromises();
  });

  it('handleCompleteTask with last task', async () => {
    const completeTask = jest.fn().mockResolvedValueOnce({});
    const getTaskTemplateInfo = jest.fn().mockResolvedValueOnce({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskTemplateInfo);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(completeTask);
    const wrapper = shallow(<WorkerJobTaskCard {...props} isLastTaskOfJob />);
    const handleCompleteTask = wrapper.find('LocationDetailsAddImageModal').invoke('onUpload');
    handleCompleteTask();
    expect(completeTask).toHaveBeenCalled();
    await flushPromises();
    expect(history.push).toHaveBeenCalled();
  });

  it('handleImageInputChange', async () => {
    const uploadImages = jest.fn();
    const shouldCompleteTask = {
      current: false,
    };
    const imageInputRef = {
      current: {
        value: '',
      },
    };
    const event = {
      target: {
        files: [
          { blob: 'blob' },
        ],
      },
    };

    jest.spyOn(React, 'useRef').mockReturnValueOnce(shouldCompleteTask);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(uploadImages);
    const wrapper = shallow(<WorkerJobTaskCard {...props} />);
    const handleImageInputChange = wrapper.find('[type="file"]').invoke('onChange');
    handleImageInputChange(event);
    await flushPromises();
    expect(uploadImages).toHaveBeenCalled();
  });

  it('handleAddImageButtonClick', () => {
    const shouldCompleteTask = {
      current: false,
    };
    const imageInputRef = {
      current: {
        click: jest.fn(),
      },
    };
    const setShowMore = jest.fn();

    jest.spyOn(React, 'useRef').mockReturnValueOnce(shouldCompleteTask);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMore]);
    const wrapper = shallow(<WorkerJobTaskCard {...propsInProgress} />);
    const handleAddImageButtonClick = wrapper.find('[data-target="add-image-btn"]').invoke('onClick');
    handleAddImageButtonClick();
    expect(imageInputRef.current.click).toHaveBeenCalled();
    expect(setShowMore).toHaveBeenCalledWith(true);
  });

  it('handleAddScreenshotButtonClick', () => {
    const shouldCompleteTask = {
      current: false,
    };
    const imageInputRef = {
      current: {
        click: jest.fn(),
      },
    };
    const setShowMore = jest.fn();

    const p = {
      ...propsInProgress,
      task: {
        ...propsInProgress.task,
        imageRequired: 2,
      },
    };

    jest.spyOn(React, 'useRef').mockReturnValueOnce(shouldCompleteTask);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMore]);
    const wrapper = shallow(<WorkerJobTaskCard {...p} />);
    const handleAddImageButtonClick = wrapper.find('[data-target="add-screenshot-btn"]').invoke('onClick');
    handleAddImageButtonClick();
    expect(setShowMore).toHaveBeenCalledWith(true);
  });

  it('showMoreSection', async () => {
    const setShowMore = jest.fn();
    const setActivityImages = jest.fn();
    const setActivityImagesLoaded = jest.fn();
    const getTaskActivityImagesList = jest.fn().mockResolvedValueOnce({ list: [] });
    const p = {
      task: {
        stage: 'open',
        nextOccurrenceDate: new Date(),
        jobActivityId: 1,
        taskActivityTrackerId: 1,
      },
      templateImageObj: {
        taskIdMapping: {},
      },
      previousTask: {},
      taskIdx: 1,
      locationZoneId: 1,
      workingOnTaskId: 0,
      isLastTaskOfJob: false,
      taskSummary: { assigneeUserName: 'userA', assignedByUserName: 'userB', stage: 'open' },
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowMore]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setActivityImages]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setActivityImagesLoaded]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskActivityImagesList);
    const wrapper = shallow(<WorkerJobTaskCard {...p} />);
    const showMoreSection = wrapper.find('[data-target="show-more-btn"]').invoke('onClick');
    showMoreSection();
    expect(getTaskActivityImagesList).toHaveBeenCalled();
    await flushPromises();
    expect(setActivityImages).toHaveBeenCalled();
    expect(setActivityImagesLoaded).toHaveBeenCalledWith(true);
    expect(setShowMore).toHaveBeenCalled();
  });

  // it('deleteActivityImages', async () => {
  //   const deleteTaskActivityImg = jest.fn().mockResolvedValueOnce();
  //   const activityImages = [
  //     { name: 'image 1', url: 'url', originUrl: 'originUrl' },
  //   ];

  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([activityImages, jest.fn()]);
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(deleteTaskActivityImg);
  //   const wrapper = shallow(<WorkerJobTaskCard {...props} />);
  //   const onDelete = wrapper.find('TaskImage').at(0).invoke('onDelete');
  //   onDelete();
  //   expect(deleteTaskActivityImg).toHaveBeenCalled();
  // });
});
