import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import TemplateTasks from '../../components/pages/template-tasks';
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

describe('TemplateTasks', () => {
  let props, state;

  beforeEach(() => {
    props = {
      templateId: '2334'
    };

    state = {
      template: {
        data: {
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
        }
      },
      templates: {
        aboutDeveloper: 'The Center of Disease Control (CDC)',
        locationType: 'Business',
        templateDescription: 'Process for cleaning and sanitizied of 75% alcohol. ',
        templateId: 85,
        templateName: 'COVID-19 standard template - Business',
        templateType: 'Reference'
      },
      tasks: {
        imageRequired: true,
        sequeceOrder: 1,
        taskDescription: 'Clean and polish mirrors',
        taskId: 176,
        taskName: 'Clean and polish mirrors',
        zoneTypeId: 35
      },
      zoneTypes: {
        items: [{
          default: false,
          zoneType: 'Aesthetics',
          zoneTypeId: 145,
        }]
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
    jest.spyOn(React, 'useMemo').mockReturnValueOnce({});
    const wrapper = shallow(<TemplateTasks {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const loadTemplate = jest.fn();
    
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(loadTemplate);
    shallow(<TemplateTasks {...props} />);
    expect(loadTemplate).toHaveBeenCalled();
  });
});
