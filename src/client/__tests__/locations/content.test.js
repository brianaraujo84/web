import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Content from '../../components/pages/locations/content';

describe('LocationsContent', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      fetchMore: jest.fn(),
    };

    state = {
      electron: {
        shortcuts: {
          CREATE_WORKSPACE: 'create-workspace',
          CREATE_GROUP: 'create-group',
          CREATE_TASK: 'create-task',
        }
      },
      profile: {
        loggedIn: true,
        data: {
          isWorker: false,
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
      locations: {
        items: [{
          address: {},
          locationId: 'id',
          locationType: 'Business',
          numberofTasks: 2,
          locationUserRole: 'Owner',
        }],
      },
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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('Location').length).toBe(1);
    expect(wrapper.find('LocationWorker').length).toBe(0);
  });
  it('isWorker', () => {
    const s = { ...state, locations: { ...state.locations, items: [{ ...state.locations.items, locationUserRole: 'Member', locationType: 'Business' }] } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('Location').length).toBe(0);
    expect(wrapper.find('LocationWorker').length).toBe(1);
  });
});
