import React from 'react';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';

import Hooks from '../../hooks';

import ZoneTasks from '../../components/pages/task-details/zone-tasks';

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

describe('ZoneTasks', () => {
  let props, state;

  beforeEach(() => {
    props = {
      editable: true
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
      templateTasks: {

        data: {
          templateId: 21,
          templateName: 'OSHA Cleaning',
          zones: [
            {
              label: 'Kitchen',
              locationZoneId: 40,
              sequenceOrder: 1,
              tasks: [
                {
                  stage: 'Not Started',
                  task: 'Sanitize Bar',
                  taskId: 31,
                }
              ]
            }
          ]
        }
      },
      locationZones: [
        {
          id: 1330,
          label: 'working on bathroom',
          sequenceOrder: 0,
          type: 'Bathroom',
          zoneTypeId: 5,
        }
      ],
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'someId', taskTemplateId: 'tmpId' });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ZoneTasks {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('getTaskTemplateInfo', () => {
    const getTaskTemplateInfo = jest.fn().mockResolvedValueOnce({ taskId: 'someId' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskTemplateInfo);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<ZoneTasks {...props} />);
    expect(getTaskTemplateInfo).toHaveBeenCalledTimes(1);
  });

  it('getTasksCount', () => {
    const getTasksCount = jest.fn(() => new Promise(() => {}).catch(() => {}));
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTasksCount);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<ZoneTasks {...props} />);
    expect(getTasksCount).toHaveBeenCalledTimes(1);
  });

  it('Empty Tasks zone', () => {
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
      templateTasks: {
        data: {
          templateId: 21,
          templateName: 'OSHA Cleaning'
        }
      },
      locationZones: [
        {
          id: 1330,
          label: 'working on bathroom',
          sequenceOrder: 0,
          type: 'Bathroom',
          zoneTypeId: 5,
        }
      ],
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    const getTasksCount = jest.fn(() => new Promise(() => {}).catch(() => {}));
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTasksCount);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<ZoneTasks {...props} />);
    expect(getTasksCount).toHaveBeenCalledTimes(1);
  });

  it('handleAddTask', async () => {
    const setShowNewTask = jest.fn();
    const getTaskTemplateInfo = jest.fn().mockResolvedValueOnce({ taskId: 'someId' });
    const cloneTemplate = jest.fn().mockResolvedValue({ taskId: 'someId' });

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowNewTask]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, jest.fn]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTaskTemplateInfo);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    // jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(cloneTemplate);
    const wrapper = shallow(<ZoneTasks {...props} />);
    const handleAddTask = wrapper.find('LocationDetailsNewTask').invoke('onUpdate');
    handleAddTask({ photos: [] });
    expect(setShowNewTask).toHaveBeenCalledWith(false);
  });
});
