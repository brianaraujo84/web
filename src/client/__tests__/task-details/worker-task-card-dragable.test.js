import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import WorkerTaskCardDragable from '../../components/pages/task-details/worker-task-card-dragable';

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

describe('WorkerTaskCardDragable', () => {
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
    const wrapper = shallow(<WorkerTaskCardDragable {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders templateType main', () => {
    const p = { ...props, task: { ...props.task, templateType: 'Main' } };
    const wrapper = shallow(<WorkerTaskCardDragable {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('render Accepted status card', () => {
    const wrapper = shallow(<WorkerTaskCardDragable {...propsAccepted} />);
    expect(wrapper.length).toBe(1);
  });

});
