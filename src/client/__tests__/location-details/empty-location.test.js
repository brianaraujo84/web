import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import EmptyLocation from '../../components/pages/location-details/empty-location';

describe('EmptyLocation', () => {
  let props, state;

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      locationType: 'Business',
      tab: 'tasks',
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
      geolocation: {},
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });


  beforeEach(() => {
    props = {
      onAddTask: jest.fn(),
      onAddTemplate: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<EmptyLocation {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleAddTask', () => {
    const wrapper = shallow(<EmptyLocation {...props} />);
    const handleAddTask = wrapper.find('[data-target="create-task-button"]').invoke('onClick');
    handleAddTask();
    expect(props.onAddTask).toHaveBeenCalled();
  });
});
