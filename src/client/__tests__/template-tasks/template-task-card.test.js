import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import TemplateTaskCard from '../../components/pages/template-tasks/template-task-card';
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
    provided: jest.fn(),
    innerRef: jest.fn(),
  }, {}),
  DragDropContext: ({ children }) => children,
}));

describe('TaskCard', () => {
  
  let props, state;

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
      getLocation: jest.fn(),
      onRemove: jest.fn(),
      onUpdate: jest.fn(),
      updateTaskInNonGrpJobTasks: jest.fn(),
      isOnTaskDetailsPage: true,
      updateTaskGroup: jest.fn(),
      locationUserRole: 'Owner',
      task: {
        stage: 'OPEN',
        task: 'Task 1',
        taskId: 169,
        templateId: 22,
        templateType: 'Todo',
        recurringType: 'Daily',
        zoneTypeId: 16,
      },
      index: 1,
    };

    state = {
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
    const wrapper = shallow(<TemplateTaskCard {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect RequireImageVerification', async () => {
    const setImageRequired = jest.fn();

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
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, setImageRequired]);

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    shallow(<TemplateTaskCard {...props} />);
    await flushPromises();
    expect(setImageRequired).toHaveBeenCalled();
  });

  it('RequireImageVerificationModal onSelectItem', async () => {
    const setShowRequireImageVerificationModal = jest.fn();
    const manageTask = jest.fn().mockResolvedValue({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRequireImageVerificationModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(manageTask);

    const wrapper = shallow(<TemplateTaskCard {...props} />)
      .find('Draggable')
      .renderProp('children')(jest.fn());
    const onSelectItem = wrapper.find('LocationDetailsRequireImageVerificationModal').invoke('onSelectItem');
    onSelectItem();
    expect(setShowRequireImageVerificationModal).toHaveBeenCalled();
    expect(props.onUpdate).toHaveBeenCalled();
  });

  it('RequireImageVerificationModal onCancel', () => {
    const setShowRequireImageVerificationModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowRequireImageVerificationModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([0, jest.fn()]);

    const wrapper = shallow(<TemplateTaskCard {...props} />)
      .find('Draggable')
      .renderProp('children')(jest.fn());
    const onCancel = wrapper.find('LocationDetailsRequireImageVerificationModal').invoke('onClose');
    onCancel();
    expect(setShowRequireImageVerificationModal).toHaveBeenCalledWith(false);
  });
});
