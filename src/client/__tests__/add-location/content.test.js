import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Content, {
  STATE_HOME,
  STATE_BUSINESS,
  STATE_OFFICE,
  STATE_SCHOOL,
  STATE_HOTEL,
  STATE_RIDESHARE,
} from '../../components/pages/add-location/content';
import Hooks from '../../hooks';

describe('Content', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {};

    state = {
      locationType: {
        data: {
          locationType: 'School'
        }
      },
      locationTypes: {
        items: [
          {
            locationTypeId: 9,
            locationType: 'Office',
            description: 'Office Buildings, Co-Working Spaces',
            prefix: 'OFF',
          }
        ]
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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('setState', () => {
    const wrapper = shallow(<Content {...props} />);
    const setState = wrapper.find('ButtonLabel').at(0).invoke('handleClick');
    expect(wrapper.find('HomeForm').length).toBe(0);
    setState(STATE_HOME);
    expect(wrapper.find('HomeForm').length).toBe(0);
    setState(STATE_BUSINESS);
    expect(wrapper.find('BusinessForm').length).toBe(0);
    setState(STATE_OFFICE);
    expect(wrapper.find('BusinessForm').length).toBe(0);
    setState(STATE_HOTEL);
    expect(wrapper.find('BusinessForm').length).toBe(0);
    setState(STATE_SCHOOL);
    expect(wrapper.find('BusinessForm').length).toBe(0);
    expect(wrapper.find('SchoolForm').length).toBe(0);
  });

  it('useEffect', () => {
    const getLocationTypes = jest.fn();

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getLocationTypes);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<Content {...props} />);
    expect(getLocationTypes).toHaveBeenCalled();
  });

  it('handleSubmit', () => {
    const setState = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([STATE_RIDESHARE, setState]);
    const wrapper = shallow(<Content {...props} />);
    const handleSubmit = wrapper.find('RideshareForm').invoke('onSubmit');
    handleSubmit({});
    expect(setState).toHaveBeenCalled();
  });
});
