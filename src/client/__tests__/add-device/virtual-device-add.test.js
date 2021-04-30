import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import ReactFormDynamic from 'react-form-dynamic';

import VirtualDeviceAdd from '../../components/pages/add-device/virtual-device-add';
import { DeviceSetupSteps } from '../../constants';
import * as Services from '../../services/services';
import Hooks from '../../hooks';

describe('VirtualDeviceAdd', () => {
  let props, state;
  let formik;

  const history = {
    push: jest.fn(),
  };


  beforeEach(() => {
    props = {};

    state = {
      locations: {
        items: [
          {
            locationId: 'id',
            locationName: 'My School',
            address: {
              addressLine1: '1556 Stockton St.',
              city: 'San Francisco',
              state: 'CA',
            },
          },
        ],
      },
      locationZones: {
        items: [],
      },
      templates: {
        items: [],
      },
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'id' });

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
    const wrapper = shallow(<VirtualDeviceAdd {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleSubmit', async () => {
    const _postObject = jest.fn().mockResolvedValue({});

    jest.spyOn(Services, '_postObject').mockReturnValueOnce(_postObject);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<VirtualDeviceAdd {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(history.push).toHaveBeenCalled();
  });

  it('handleSubmit with error', async () => {
    const _postObject = jest.fn().mockRejectedValue({});
    const setState = jest.fn();
    const setError = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_SELECT_TEMPLATE, setState]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', setError]);
    jest.spyOn(Services, '_postObject').mockImplementationOnce(_postObject);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<VirtualDeviceAdd {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(setError).toHaveBeenCalled();
    expect(setState).toHaveBeenCalled();
  });

  it('handleLocationZoneChange', () => {
    const event = {
      target: {
        value: 1,
      },
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_SELECT_ZONE, jest.fn()]);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<VirtualDeviceAdd {...props} state={DeviceSetupSteps.STATE_SELECT_ZONE} />);
    const handleLocationZoneChange = wrapper.find('[data-target="select-location-zone"]').invoke('onChange');
    handleLocationZoneChange(event);
    expect(formik.setFieldValue).toHaveBeenCalled();

    getForm.mockRestore();
  });

  it('handleTemplateChange', () => {
    const event = {
      target: {
        value: 1,
      },
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_SELECT_TEMPLATE, jest.fn()]);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<VirtualDeviceAdd {...props} />);
    const handleTemplateChange = wrapper.find('[data-target="select-template"]').invoke('onChange');
    handleTemplateChange(event);
    expect(formik.setFieldValue).toHaveBeenCalled();

    getForm.mockRestore();
  });

  it('handleGoToPrev', () => {
    const setState = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_SELECT_TEMPLATE, setState]);
    const wrapper = shallow(<VirtualDeviceAdd {...props} />);
    const handleGoToPrev = wrapper.find('[data-target="back-btn"]').invoke('onClick');
    handleGoToPrev();
    expect(setState).toHaveBeenCalled();
  });

  it('handleGoToNext', () => {
    const setState = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_SELECT_LOCATION, setState]);
    const wrapper = shallow(<VirtualDeviceAdd {...props} />);
    const handleGoToNext = wrapper.find('[data-target="next-btn"]').invoke('onClick');
    handleGoToNext();
    expect(setState).toHaveBeenCalled();
  });

  it('useEffect', () => {
    const getLocationZones = jest.fn();
    const getTemplates = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_PLACEMENT, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getLocationZones);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTemplates);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<VirtualDeviceAdd {...props} />);
    expect(getLocationZones).toHaveBeenCalled();
    expect(getTemplates).toHaveBeenCalled();
  });

  it('toggleHelperText', () => {
    const setShowHelperText = jest.fn();
    const event = {
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowHelperText]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([DeviceSetupSteps.STATE_SELECT_TEMPLATE, jest.fn()]);
    const wrapper = shallow(<VirtualDeviceAdd {...props} />);
    const toggleHelperText = wrapper.find('[data-target="toggle-helper-text"]').invoke('onClick');
    toggleHelperText(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(setShowHelperText).toHaveBeenCalled();
  });
});
