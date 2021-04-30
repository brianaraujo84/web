import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactFormDynamic from 'react-form-dynamic';

import RideshareForm from '../../components/pages/add-location/rideshare-form';

describe('RideshareForm', () => {
  let props;
  let state;
  let formik;

  beforeEach(() => {
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
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
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
    const wrapper = shallow(<RideshareForm {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('isValid', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<RideshareForm {...props} />);
    expect(wrapper.find('button').hasClass('disabled')).toBe(true);

    getForm.mockRestore();
  });

  it('onSubmit', () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<RideshareForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});
    // expect(props.onSubmit).toHaveBeenCalled();
    getForm.mockRestore();
  });
});
