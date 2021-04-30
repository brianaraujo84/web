import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactFormDynamic from 'react-form-dynamic';
import ReactRouterDom from 'react-router-dom';

import BusinessForm from '../../components/pages/add-location/business-form';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('BusinessForm', () => {
  let props;
  let state;
  let formik;

  const history = {
    push: jest.fn(),
  };

  const place = {
    geometry: {
      location: {
        toJSON: jest.fn(),
      }
    }
  };


  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      locationType: 'Business',
      resetLocationType: jest.fn(),
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
      locations: {
        total: 2,
      },
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
    const wrapper = shallow(<BusinessForm {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('isValid', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<BusinessForm {...props} />);
    expect(wrapper.find('Button').prop('disabled')).toBe(true);

    getForm.mockRestore();
  });

  it('handleAddressChange', () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<BusinessForm {...props} />);
    const handleAddressChange = wrapper.find('[data-target="autocomplete-address"]').invoke('onSelect');
    handleAddressChange('address', {}, {}, place);
    wrapper.find('Button').simulate('click');
    expect(formik.setFieldValue).toHaveBeenCalled();

    getForm.mockRestore();
  });

  // it('onSubmit location data', async () => {
  //   const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
  //   const p = { ...props, locationData: { locationId: 'someid' } };
  //   shallow(<BusinessForm {...p} />);
  //   const [{ onSubmit }] = getForm.mock.calls[0];
  //   onSubmit({ zip: '90210' });
  //   await flushPromises();
  //   expect(history.push).not.toHaveBeenCalled();
  //   getForm.mockRestore();
  // });

  it('onSubmit', async () => {
    const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<BusinessForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({ zip: '90210' });
    await flushPromises();
    expect(history.push).toHaveBeenCalledWith({ 'data': { 'isFirstTime': true, locationType: 'Business' }, 'pathname': '/location/id/' });
    getForm.mockRestore();
  });

  it('onSubmit failed', async () => {
    const manageLocation = jest.fn().mockRejectedValueOnce();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<BusinessForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});
    await flushPromises();
    expect(history.push).toHaveBeenCalledWith('/400');
    getForm.mockRestore();
  });

  it('test-zip', () => {
    const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<BusinessForm {...props} />);
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

  it('test-zip not valid', () => {
    const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
    jest.spyOn(React, 'useState').mockReturnValue([{ zip: '90210' }, jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<BusinessForm {...props} />);
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
    expect(testZipFn()).toBe(true);
  });
});
