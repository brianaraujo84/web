import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactFormDynamic from 'react-form-dynamic';

import AddManagerModal from '../../components/pages/location-details/add-manager-modal';

describe('AddManagerModal', () => {
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
      values: {newInvites: {}, selectedUsers: {}},
      setFieldValue: jest.fn(),
      resetForm: jest.fn(),
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
      contacts: {
        items: [
          {
            firstName: 'John',
            lastName: 'Doe',
            userName: 'somename',
            contactId: '1',
            contactType: 'Member',
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
            contactType: 'Member',
          },
          {
            lastName: 'Doe',
            userName: 'somename',
            contactId: '2',
            contactType: 'Manager',
          },
          {
            userName: 'somename',
            contactId: '3',
            contactType: 'Member',
          },
        ],
      },
      filteredContacts: [
        {
          firstName: 'John',
          lastName: 'Doe',
          userName: 'somename',
          contactId: '1',
          contactType: 'Member',
        },
        {
          lastName: 'Doe',
          userName: 'somename',
          contactId: '2',
          contactType: 'Manager',
        },
        {
          userName: 'somename',
          contactId: '3',
          contactType: 'Member',
        },
      ],
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
    const setFilteredContacts = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([[{
      firstName: 'John',
      lastName: 'Doe',
      userName: 'somename',
      contactId: '1',
      contactType: 'Member',
    }], setFilteredContacts]);
    const wrapper = shallow(<AddManagerModal {...props} />);
    expect(wrapper.length).toBe(1);
  });


  // it('handleContactClick', async () => {
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
  //   const wrapper = shallow(<AddManagerModal {...props} />);
  //   const handleContactClick = wrapper.find('[data-target="add-contact-btn"]').at(0).invoke('onClick');

  //   handleContactClick();
  //   expect(formik.setFieldValue).toHaveBeenCalledWith('assignee', 'somename');

  //   getForm.mockRestore();
  // });

  it('handleSelectManager', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<AddManagerModal {...props} />);
    const handleSelectManager = wrapper.find('.list-group-item').at(0).invoke('onClick');

    handleSelectManager();
    expect(formik.setFieldValue).toHaveBeenCalledWith('selectedUsers',  {'somename': true});

    getForm.mockRestore();
  });

  it('onSubmit', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<AddManagerModal {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({}, formik);
    expect(props.onUpdate).toHaveBeenCalled();
  });

  // it('onPhoneChange', async () => {
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
  //   const wrapper = shallow(<AddManagerModal {...props} />);
  //   const onPhoneChange = wrapper.find('PhoneInput').invoke('onChange');
  //   const event = {
  //     target: { value: '+11234567890' }
  //   };

  //   onPhoneChange(event);
  //   expect(formik.setFieldValue).toHaveBeenCalledWith('assigneeUserName', '+11234567890');

  //   getForm.mockRestore();
  // });
});
