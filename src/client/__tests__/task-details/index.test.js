import React from 'react';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';

import TaskDetails from '../../components/pages/task-details';

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

describe('TaskDetails', () => {
  let props, state;

  beforeEach(() => {
    props = {

    };

    state = {
      newTemplate: {
        data: {}
      },
      tasks: {
        items: [{
          templateId: 195,
          taskId: 1432,
          editable: false
        }]
      },
      loc: {
        data: {
          locationUserRole: 'Owner'
        }
      }
    };

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
    const task = {
      templateId: 195,
      taskId: 1432,
      editable: false
    };
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'someId', taskTemplateId: '195' });
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(task);
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('editable job', () => {
    const task = {
      templateId: 195,
      taskId: 1432,
      editable: false
    };
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'someId', taskTemplateId: '195' });
    jest.spyOn(React, 'useMemo').mockReturnValueOnce(task);
    const wrapper = shallow(<TaskDetails {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
