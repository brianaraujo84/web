import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import DevicesContent from '../../components/pages/devices/content';
import * as Services from '../../services/services';

const flushPromises = () => new Promise(setImmediate);

describe('DevicesContent', () => {
  let props, state;
  
  beforeEach(() => {
    props = {};

    state = {
      deviceLocations: {
        items: [
          { id: 1 },
        ],
      },
    };

    jest.useFakeTimers();

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
    const wrapper = shallow(<DevicesContent {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const getDevices = jest.fn();

    jest.spyOn(React, 'useCallback').mockReturnValueOnce(getDevices);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<DevicesContent {...props} />);
    expect(getDevices).toHaveBeenCalled();
  });

  it('useCallback', async () => {
    const setNumberOfDevices = jest.fn();
    const _postObject = jest.fn().mockResolvedValueOnce({ devices: 1 });

    jest.spyOn(React, 'useState').mockReturnValueOnce([0, setNumberOfDevices]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    jest.spyOn(Services, '_postObject').mockReturnValueOnce(_postObject);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<DevicesContent {...props} />);
    await flushPromises();
    expect(setNumberOfDevices).toHaveBeenCalled();
  });
});
