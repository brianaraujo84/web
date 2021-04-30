import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactFormDynamic from 'react-form-dynamic';
import ReactRouterDom from 'react-router-dom';

import HomeForm from '../../components/pages/location-details/home-form';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('HomeForm', () => {
  let props;
  let state;
  let formik;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      locationType: 'Home',
      locationName: 'home',
      locationData: {
        locationId: 1,
        address: {
          addressLine1: '123 Ave',
          city: 'Los Angeles',
          state: 'CA',
        },
      },
      setFormik: jest.fn(),
      setIsInitialValues: jest.fn(),
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

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<HomeForm {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleAddressChange', () => {
    const setAddress = jest.fn();
    const addressString = '123 Ave, Los Angeles, CA';
    const address = {
      addressLine1: '123 Ave',
      city: 'Los Angeles',
      state: 'CA',
    };

    jest.spyOn(React, 'useState').mockReturnValue([{}, setAddress]);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    const wrapper = shallow(<HomeForm {...props} />);
    const handleAddressChange = wrapper.find('GeoAutocomplete').invoke('onSelect');
    handleAddressChange(addressString, address);

    expect(setAddress).toHaveBeenCalledWith(address);
    expect(formik.setFieldTouched).toHaveBeenCalledWith('addressString', true);
    expect(formik.setFieldValue).toHaveBeenCalledWith('addressString', addressString);

    getForm.mockRestore();
  });

  it('onSubmit', async () => {
    const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<HomeForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({ business_name: 'Test, Inc', location_name: 'location' });
    await flushPromises();
    expect(history.push).not.toHaveBeenCalled();
    getForm.mockRestore();
  });

  it('onSubmit with failed', async () => {
    const manageLocation = jest.fn().mockRejectedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<HomeForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({ business_name: 'Test, Inc', location_name: 'location' });
    await flushPromises();
    expect(history.push).toHaveBeenCalled();
    getForm.mockRestore();
  });

  it('test-zip', () => {
    const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<HomeForm {...props} />);
    const [{ fields }] = getForm.mock.calls[0];
    const testZipFn = fields.reduce((acc, field) => {
      if ('addressString' === field.name) {
        for (let i = 0; i < field.validations.length; i++) {
          if (field.validations[i].rule === 'test' && field.validations[i].params[0] === 'test-zip') {
            return field.validations[i].params[2];
          }
        }
      }
    });
    expect(testZipFn()).toBe(false);
  });

  it('useEffect', () => {
    const setAddress = jest.fn();
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setAddress]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<HomeForm {...props} />);
    expect(setAddress).toHaveBeenCalled();
    expect(props.setFormik).toHaveBeenCalled();
  });
});
