import React from 'react';
import ReactRedux from 'react-redux';
import { shallow } from 'enzyme';

import DragableTaskList from '../../components/pages/task-details/dragable-task-list';

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

describe('DragableTaskList', () => {
  let props, state;

  beforeEach(() => {
    props = {

    };

    state = {
      profile: {
        data: {}
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
    const wrapper = shallow(<DragableTaskList {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
