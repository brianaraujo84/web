import React from 'react';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';
import ReactRedux from 'react-redux';

import AssignModal, { TYPE_SMS, TYPE_CONTACT, TYPE_EMAIL } from '../../components/pages/location-details/assign-modal';

describe('LocationDetailsAssignModal', () => {
  let props;
  let state;
  let formik;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onUpdate: jest.fn(),
      show: true,
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      resetForm: jest.fn(),
    };

    state = {
      contacts: {
        items: [
          {
            firstName: 'John',
            lastName: 'Doe',
            userName: 'somename',
            contactId: '1',
            contactType: 'Manager',
            contactTypeLabel: 'Member'
          },
          {
            lastName: 'Doe',
            userName: 'somename',
            contactId: '2',
            contactType: 'Manager',
            contactTypeLabel: 'Member'
          },
          {
            userName: 'somename',
            contactId: '3',
            contactType: 'Member',
            contactTypeLabel: 'Member'
          },
        ],
      },
      managers: {
        items: [
          {
            firstName: 'John',
            lastName: 'Doe',
            userName: 'somename',
            contactId: '1',
            contactType: 'Manager',
            contactTypeLabel: 'Member'
          },
          {
            lastName: 'Doe',
            userName: 'somename',
            contactId: '2',
            contactType: 'Manager',
            contactTypeLabel: 'Member'
          },
          {
            userName: 'somename',
            contactId: '3',
            contactType: 'Member',
            contactTypeLabel: 'Member'
          },
        ],
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([TYPE_SMS, jest.fn()]);
    const wrapper = shallow(<AssignModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders email', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([TYPE_EMAIL, jest.fn()]);
    const wrapper = shallow(<AssignModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders contact', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([TYPE_CONTACT, jest.fn()]);
    const wrapper = shallow(<AssignModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  // it('handlePhoneChange', async () => {
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
  //   const wrapper = shallow(<AssignModal {...props} />);
  //   const handlePhoneChange = wrapper.find('[data-target="phone-input"]').invoke('onChange');
  //   const event = {
  //     target: { value: '55533332222' }
  //   };
  //   handlePhoneChange(event);
  //   expect(formik.setFieldValue).toHaveBeenCalledTimes(1);

  //   getForm.mockRestore();
  // });

  it('handleSelectAssignee', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<AssignModal {...props} />);
    const handleSelectAssignee = wrapper.find('.list-group-item').at(0).invoke('onClick');

    handleSelectAssignee();
    expect(formik.setFieldValue).toHaveBeenCalled();

    getForm.mockRestore();
  });

  it('onSubmit', () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<AssignModal {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({}, formik);
    expect(props.onUpdate).toHaveBeenCalled();
  });
});
