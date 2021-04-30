import React from 'react';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';

import ReactFormDynamic from 'react-form-dynamic';
import Hooks from '../../hooks';
import ForgotPassword from '../../components/pages/forgot-password';

describe('ForgotPassword', () => {
  let props, state;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
    };
    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
        forgotPassword: '+18888888888'
      },
    };
    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
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
    const wrapper = shallow(<ForgotPassword {...props} />);
    expect(wrapper.length).toBe(1);
  });

  // it('handleCodeChange', async () => {
  //   const formik = {
  //     isValid: false,
  //     values: {
  //       oneTimePasscode: '111111'
  //     },
  //     setFieldValue: jest.fn(),
  //   };

  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([2, jest.fn()]);
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
  //   const wrapper = shallow(<ForgotPassword {...props} />);
  //   const handleCodeChange = wrapper.find('[data-target="code-input"]').invoke('onChange');
  //   const event = {
  //     target: { value: '222222' }
  //   };
  //   handleCodeChange(event);
  //   expect(formik.setFieldValue).toHaveBeenCalledTimes(1);

  //   getForm.mockRestore();
  // });

  it('togglePassword', async () => {
    const formik = {
      isValid: false,
      values: {
        oneTimePasscode: '111111'
      },
      setFieldValue: jest.fn(),
    };
    const setShowPassword = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([3, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowPassword]);
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<ForgotPassword {...props} />);
    expect(wrapper.find('[name="password"]').prop('type')).toBe('password');
    const append = wrapper.find('[name="password"]').prop('append');

    const appendWrapper = shallow(append);
    const togglePassword = appendWrapper.find('.input-group-append').invoke('onClick');
    togglePassword();
    setShowPassword(show => !show);
    expect(wrapper.find('[name="password"]').prop('type')).toBe('password');
    togglePassword();
    expect(wrapper.find('[name="password"]').prop('type')).toBe('password');
  });

  it('handleForgotPassword', async () => {

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    //jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    const forgotPwd = jest.fn().mockReturnValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(forgotPwd);

    shallow(<ForgotPassword {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];

    await onSubmit({});
    expect(forgotPwd).toHaveBeenCalled();
  });

  // it('handleForgotPassword failure', async () => {
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
  //   const forgotPwd = jest.fn().mockRejectedValueOnce({});
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(forgotPwd);

  //   shallow(<ForgotPassword {...props} />);
  //   const [{ onSubmit }] = getForm.mock.calls[0];

  //   await onSubmit({});
  //   expect(forgotPwd).toHaveBeenCalled();
  // });

  // it('handleResetPassword', async () => {
  //   const fieldsNewPassword = {
  //     isValid: false,
  //     values: {
  //       oneTimePasscode: '111111',
  //       password: 'Password$2'
  //     },
  //     setFieldValue: jest.fn(),
  //     handleReset: jest.fn(),
  //   };
  //   const setShowPasswordResetModal = jest.fn();
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([3, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowPasswordResetModal]);

  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([3, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowPasswordResetModal]);
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(fieldsNewPassword);

  //   const forgotPwd = jest.fn().mockReturnValueOnce({});
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(forgotPwd);
  //   const resetPwd = jest.fn().mockReturnValueOnce({});
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(resetPwd);
  //   jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);

  //   const wrapper = shallow(<ForgotPassword {...props} />);
  //   const [{ onSubmit: handleResetPassword }] = getForm.mock.calls[1];
  //   const onClose = wrapper.find('PasswordResetModal').invoke('onClose');
  //   onClose();

  //   await handleResetPassword({});
  //   expect(resetPwd).toHaveBeenCalled();
  //   expect(history.push).toHaveBeenCalled();
  // });

  // it('handleResetPassword failure', async () => {
  //   const fieldsNewPassword = {
  //     isValid: false,
  //     values: {
  //       oneTimePasscode: '111111',
  //       password: 'Password$2'
  //     },
  //     setFieldValue: jest.fn(),
  //     handleReset: jest.fn(),
  //   };
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([3, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(fieldsNewPassword);
  //   const resetPwd = jest.fn().mockRejectedValueOnce();
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(resetPwd);
  //   jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);

  //   shallow(<ForgotPassword {...props} />);
  //   const [{ onSubmit: handleResetPassword }] = getForm.mock.calls[1];

  //   await handleResetPassword();
  //   expect(history.push).not.toHaveBeenCalled();
  // });

  // it('handleResetPassword failure', async () => {
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([2, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
  //   const resetPwd = jest.fn().mockRejectedValueOnce();
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(resetPwd);

  //   shallow(<ForgotPassword {...props} />);
  //   const [{ onSubmit: handleResetPassword }] = getForm.mock.calls[0];

  //   await handleResetPassword();
  //   expect(history.push).not.toHaveBeenCalled();
  // });

  // it('useEffect', async () => {
  //   const formik = {
  //     isValid: false,
  //     values: {
  //       oneTimePasscode: '111111',
  //       password: 'Password$2'
  //     },
  //     setFieldValue: jest.fn(),
  //   };
  //   let setUserName;

  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([1, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
  //   jest.spyOn(React, 'useEffect').mockImplementation(f => setUserName = f);
  //   jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

  //   shallow(<ForgotPassword {...props} />);
  //   setUserName();
  //   expect(formik.setFieldValue).not.toHaveBeenCalled();

  // });
});
