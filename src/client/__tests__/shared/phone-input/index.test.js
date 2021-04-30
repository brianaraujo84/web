import React from 'react';
import { shallow } from 'enzyme';

import { PhoneInput } from '../../../components/shared/phone-input';

describe('PhoneInput', () => {
  let props;

  beforeEach(() => {
    props = {
      formik: {
        values: {
          _inputPhoneName: 'some value',
        },
        errors: {
          _inputPhoneName: true,
        },
        touched: {
          _inputPhoneName: true,
        },
        setFieldValue: jest.fn(),
      },
      classes: {
        inputPhone: {
          error: 'some class',
        },
        inputEmail: {
          error: 'another class',
        },
      },
      placeholder: 'pl',
      name: 'some name',
      phoneonly: false,
      showError: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<PhoneInput {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
