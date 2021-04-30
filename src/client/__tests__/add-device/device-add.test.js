import React from 'react';
import { shallow } from 'enzyme';
import ReactRouterDom from 'react-router-dom';

import DeviceAdd from '../../components/pages/add-device/device-add';
import * as Services from '../../services/services';

describe('DeviceAdd', () => {
  let props;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      location: {
        locationId: 'id'
      },
      templateId: 123
    };

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DeviceAdd {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleAddVirtualDisplay', async () => {
    const _postObject = jest.fn().mockResolvedValue({});
    jest.spyOn(Services, '_postObject').mockImplementationOnce(_postObject);
    const wrapper = shallow(<DeviceAdd {...props} />);
    const handleAddVirtualDisplay = wrapper.find('[data-target="add-virtual-display-btn"]').invoke('onClick');
    await handleAddVirtualDisplay();
    expect(history.push).toHaveBeenCalled();
  });

  it('handleAddVirtualDisplay with error', async () => {
    const _postObject = jest.fn().mockRejectedValue({});
    const setError = jest.fn();
    
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setError]);
    jest.spyOn(Services, '_postObject').mockImplementationOnce(_postObject);
    const wrapper = shallow(<DeviceAdd {...props} />);
    const handleAddVirtualDisplay = wrapper.find('[data-target="add-virtual-display-btn"]').invoke('onClick');
    await handleAddVirtualDisplay();
    expect(setError).toHaveBeenCalled();
  });
});
