import React from 'react';
import { shallow } from 'enzyme';

import Content from '../../components/pages/template-tasks/Content';
import Hooks from '../../hooks';

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

describe('NewTemplateContent', () => {
  let props;

  beforeEach(() => {
    props = {
      template: {
        'referenceTemplateName': 'Demo template',
        'templateDetails': {
          'templateId': 7198,
          'templateName': 'Demo template',
          'templateShortDescription': 'Demo template',
          'templateDescription': 'Demo template',
          'aboutDeveloper': 'Demo template',
          'templateType': 'Reference',
          'searchTags': 'DEMO, , ',
          'locationType': 'School',
          'footer': 'DEMO',
          'compliantHeader': 'DEMO',
          'nonCompliantHeader': 'DEMO',
          'eventCompletetionText': 'DEMO',
          'eventNextScheduledforText': 'DEMO'
        },
        'tasks': [
          {
            'taskId': 83130,
            'taskName': 'Clean the evaporator drain',
            'taskDescription': '',
            'sequeceOrder': 1,
            'zoneTypeId': 71,
            'imageRequired': true
          },
          {
            'taskId': 83129,
            'taskName': 'Clean the evaporator coil and heater',
            'taskDescription': '',
            'sequeceOrder': 2,
            'zoneTypeId': 71,
            'imageRequired': false
          },
          {
            'taskId': 85592,
            'taskName': 'Sanitize floors',
            'taskDescription': 'Sanitize floors and clean',
            'sequeceOrder': 3,
            'zoneTypeId': 71,
            'imageRequired': false
          },
          {
            'taskId': 85593,
            'taskName': 'Sanitize counter tops',
            'taskDescription': 'Sanitize countertops',
            'sequeceOrder': 4,
            'zoneTypeId': 71,
            'imageRequired': true
          },
          {
            'taskId': 85631,
            'taskName': 'Sanitize counter tops',
            'taskDescription': 'Sanitize countertops',
            'sequeceOrder': 5,
            'zoneTypeId': 71,
            'imageRequired': true
          },
          {
            'taskId': 85632,
            'taskName': 'Sanitize kitchen utencils',
            'taskDescription': 'Sanitize  kitchen utencils',
            'sequeceOrder': 6,
            'zoneTypeId': 71,
            'imageRequired': false
          },
          {
            'taskId': 83132,
            'taskName': 'Clean carpeted floors',
            'taskDescription': '',
            'sequeceOrder': 6,
            'zoneTypeId': 72,
            'imageRequired': false
          },
        ],
        'taskCount': 10
      },
      tasks: [
        {
          'taskId': 83130,
          'taskName': 'Clean the evaporator drain',
          'taskDescription': '',
          'sequeceOrder': 1,
          'zoneTypeId': 71,
          'imageRequired': true
        },
        {
          'taskId': 83129,
          'taskName': 'Clean the evaporator coil and heater',
          'taskDescription': '',
          'sequeceOrder': 2,
          'zoneTypeId': 71,
          'imageRequired': false
        },
        {
          'taskId': 85592,
          'taskName': 'Sanitize floors',
          'taskDescription': 'Sanitize floors and clean',
          'sequeceOrder': 3,
          'zoneTypeId': 71,
          'imageRequired': false
        },
        {
          'taskId': 85593,
          'taskName': 'Sanitize counter tops',
          'taskDescription': 'Sanitize countertops',
          'sequeceOrder': 4,
          'zoneTypeId': 71,
          'imageRequired': true
        },
        {
          'taskId': 85631,
          'taskName': 'Sanitize counter tops',
          'taskDescription': 'Sanitize countertops',
          'sequeceOrder': 5,
          'zoneTypeId': 71,
          'imageRequired': true
        },
        {
          'taskId': 85632,
          'taskName': 'Sanitize kitchen utencils',
          'taskDescription': 'Sanitize  kitchen utencils',
          'sequeceOrder': 6,
          'zoneTypeId': 71,
          'imageRequired': false
        },
        {
          'taskId': 83132,
          'taskName': 'Clean carpeted floors',
          'taskDescription': '',
          'sequeceOrder': 6,
          'zoneTypeId': 72,
          'imageRequired': false
        },
      ],
      zoneTypes: [{
        default: false,
        zoneType: 'Aesthetics',
        zoneTypeId: 145,
      }]
    };
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

  it('useEffect', () => {
    const getTemplateTaskList = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTemplateTaskList);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<Content {...props} />);
  });

  it('hide add new task when adding new task', () => {
    const wrapper = shallow(<Content {...props} />);
    wrapper.find('[data-target="add-new-task"]').simulate('click');
    expect(wrapper.find('[data-target="add-new-task"]').props().hidden).toBeTruthy();
  });
});
