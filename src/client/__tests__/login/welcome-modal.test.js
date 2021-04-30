import React from 'react';
import { shallow } from 'enzyme';

import WelcomeModal from '../../components/pages/login/welcome-modal';

describe('WelcomeModal', () => {
  let props;

  beforeEach(() => {
    props = {

    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<WelcomeModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  // it('renders email', () => {
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([TYPE_EMAIL, jest.fn()]);
  //   const wrapper = shallow(<AddManagerModal {...props} />);
  //   expect(wrapper.length).toBe(1);
  // });

  // it('renders contact', () => {
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([TYPE_CONTACT, jest.fn()]);
  //   const wrapper = shallow(<AddManagerModal {...props} />);
  //   expect(wrapper.length).toBe(1);
  // });


  // it('handlePhoneChange', async () => {
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
  //   const wrapper = shallow(<AddManagerModal {...props} />);
  //   const handlePhoneChange = wrapper.find('[data-target="phone-input"]').invoke('onChange');
  //   const event = {
  //     target: { value: '55533332222' }
  //   };
  //   handlePhoneChange(event);
  //   expect(formik.setFieldValue).toHaveBeenCalledTimes(1);

  //   getForm.mockRestore();
  // });

  // it('handleContactClick', async () => {
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
  //   const wrapper = shallow(<AddManagerModal {...props} />);
  //   const handleContactClick = wrapper.find('[data-target="add-contact-btn"]').at(0).invoke('onClick');

  //   handleContactClick();
  //   expect(formik.setFieldValue).toHaveBeenCalledWith('assignee', 'somename');

  //   getForm.mockRestore();
  // });


  it('close', async () => {
    const setShow = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShow]);
    const wrapper = shallow(<WelcomeModal {...props} />);
    const onClose = wrapper.find('[data-target="modal-container"]').invoke('onHide');
    onClose();

    expect(setShow).toHaveBeenCalled();
  });
});
