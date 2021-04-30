import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import LocationSelect from '../../components/pages/add-device/location-select';

describe('LocationSelect', () => {
  let props, state;

  beforeEach(() => {
    props = {
      onContinue: jest.fn(),
    };

    state = {
      deviceLocations: {
        items: [
          { locationId: 1 },
        ],
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
    const wrapper = shallow(<LocationSelect {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders correctly with selected location', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    const wrapper = shallow(<LocationSelect {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleContinue', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);

    const wrapper = shallow(<LocationSelect {...props} />);
    const handleContinue = wrapper.find('Button').invoke('onClick');
    handleContinue();
    expect(props.onContinue).toHaveBeenCalled();
  });

  it('handleClickLocation', () => {
    const setLocation = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setLocation]);
    const wrapper = shallow(<LocationSelect {...props} />);
    const handleClickLocation = wrapper.find('LocationCard').at(0).invoke('onClick');
    handleClickLocation();
    expect(setLocation).toHaveBeenCalled();
  });
});
