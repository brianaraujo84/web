import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';

import GroupNav from '../../../components/shared/layout/group-nav';

describe('GroupNavBar', () => {
  let props, params, state;

  const history = {
    push: jest.fn(),
    replace: jest.fn(),
    location: {
      pathname: '/',
    },
  };

  beforeEach(() => {
    props = {
      open: true,
      onToggle: jest.fn(),
    };

    state = {
      groupMenuUpdate: { data: { update: false }},
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '555555',
          img: 'someurl',
        },
      },
      tasks: {
        items: []
      },
      loc: {
        data: {
          locationName: null
        }
      },
      taskGroups: {
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
      templateGroups: {
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
    };

    params = {
      locationId: 'HOM4PBVG',
      taskTemplateId: '7489'
    };

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue(params);
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
    const wrapper = shallow(<GroupNav {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleToggle', () => {
    const wrapper = shallow(<GroupNav {...props} />);
    const clickToggleButton = wrapper.find('[data-target="group-nav-toggle-icon"]').invoke('onClick');
    clickToggleButton();
    expect(props.onToggle).toHaveBeenCalled();
  });
});
