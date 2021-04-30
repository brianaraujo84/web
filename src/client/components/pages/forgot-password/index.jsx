import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import Layout from '../../shared/layout';
import { useTitle, useActionDispatch } from '../../../hooks';
import { forgotPassword, resetPassword } from '../../../redux/actions/profile';
import * as URLS from '../../../urls';
import PasswordResetModal from './password-reset-modal';
import PhoneInput from '../../shared/phone-input';
import { TextUtils } from '../../../utils';
import { _postObject } from '../../../services/services';

const STATE_FORGOT = 1;
const STATE_VERIFICATION = 2;
const STATE_NEW_PASSWORD = 3;
const codeMaskRegex = [/\S/, ' ', /\S/, ' ', /\S/, ' ', /\S/, ' ', /\S/, ' ', /\S/,];

const classes = {
  input: {
    input: 'form-control',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
  password: {
    container: 'form-group input-group mb-0',
    input: 'form-control border-right-0',
    inputError: 'error_1 is-invalid_1',
    error: 'invalid-feedback_1',
    containerError: 'error_1',
  },
};

const ForgotPassword = () => {
  const { t } = useTranslation();
  const history = useHistory();
  useTitle(t('Forgot Password'));
  const fields = [
    {
      name: 'userName',
      // type: 'tel',
      // showError: false,
      // placeholder: t('Phone number'),
      label: t('Phone number'),
      // classes: {
      //   input: 'form-control mb-3',
      // },
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'test',
          params: [
            'isValid',
            t('Incorrect email or phone format'),
            function (userName) {
              return isValidContact(userName);
            }
          ]
        }
      ],
    }
  ];
  const fieldsVerify = [
    {
      name: 'oneTimePasscode',
      label: t('Verification Code'),
      classes: {
        input: 'form-control mb-3',
      },
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'min',
          params: [4]
        },
        {
          rule: 'max',
          params: [6]
        },
      ],
    },
  ];
  const fieldsNewPassword = [
    {
      name: 'password',
      label: t('Password'),
      classes: {
        input: 'form-control mb-3',
      },
      type: 'password',
      validations: [
        {
          rule: 'required',
        },
      ],
    },
  ];

  const [lengthValid, setLengthValid] = React.useState(false);
  const [lettersValid, setLettersValid] = React.useState(false);
  const [numbersValid, setNumbersValid] = React.useState(false);
  const [specialValid, setSpecialValid] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [state, setState] = React.useState(STATE_FORGOT);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = React.useState(false);
  const [userNameText, setUserNameText] = React.useState('');
  // const forgotPwdData = useSelector(state => state.profile.forgotPassword);
  const forgotPwd = useActionDispatch(forgotPassword);
  const resetPwd = useActionDispatch(resetPassword);

  const handleForgotPassword = async (values) => {
    setError(false);
    const { userName } = values;
    const data = { userName };
    try {
      const response = await forgotPwd(data);
      setUserNameText(response.codeDeliveryMethod);

      await _postObject('v1/confidence/usertype', data);
      setState(STATE_VERIFICATION);
    } catch (e) {
      setError(e.data?.message);
      formik.handleReset();
    }
  };

  const continueResetPassword = async () => {
    setState(STATE_NEW_PASSWORD);
  };

  const handleResetPassword = async (values) => {
    setError(false);
    try {
      const data = {
        confirmationCode: formikVerify.values.oneTimePasscode,
        userName: formik.values.userName,
        password: values.password || values.pin,
      };

      await resetPwd(data);
      setShowPasswordResetModal(true);
    } catch (e) {
      setError(e.message);
      formikVerify.handleReset();
      formikNewPassword.handleReset();
      setState(STATE_VERIFICATION);
    }
  };

  const handleCodeChange = ({ target: { value } }) => {
    setError(false);
    formikVerify.setFieldValue('oneTimePasscode', value.replace(/[\W_]+/g, ''));
  };

  const togglePassword = () => {
    setShowPassword(show => !show);
  };

  const onPasswordResetModalClose = () => {
    setShowPasswordResetModal(false);
    history.push(URLS.LOGIN());
  };

  const formik = useForm({ fields, onSubmit: handleForgotPassword });
  const formikVerify = useForm({ fields: fieldsVerify, onSubmit: continueResetPassword });
  const formikNewPassword = useForm({ fields: fieldsNewPassword, onSubmit: handleResetPassword });
  
  React.useMemo(() => {
    const lettersRegex = /[a-zA-Z]/;
    const numbersRegex = /[0-9]/;
    const specialRegex = /[@$!%*#?&^]/;
    if (formikNewPassword.values.password.length >= 8 && formikNewPassword.values.password.length <= 15) {
      setLengthValid(true);
    } else {
      setLengthValid(false);
    }
    if (lettersRegex.test(formikNewPassword.values.password)) {
      setLettersValid(true);
    } else {
      setLettersValid(false);
    }
    if (numbersRegex.test(formikNewPassword.values.password)) {
      setNumbersValid(true);
    } else {
      setNumbersValid(false);
    }
    if (specialRegex.test(formikNewPassword.values.password)) {
      setSpecialValid(true);
    } else {
      setSpecialValid(false);
    }
  },[formikNewPassword.values.password]);

  const isValidContact = (contact) => {
    return /^\+{1}\d{11,14}$/.test(contact)
      ? contact
      : /^\d{10,13}$/.test(contact)
        ? `${formik.values._countryCode}${contact}`
        : TextUtils.isEmail(contact)
          ? contact
          : '';
  };

  // const [formElements, formik] = useGeneratedForm(fields, handleForgotPassword);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container pb-5 mt-5 pt-5">
          <div className="row row justify-content-center">
            <div className="col-12 col-md-6">
              {state === STATE_FORGOT && <div>
                <h1 className="text-center mb-4"><Trans>Forgot Password?</Trans></h1>
                <p className="lead text-center">Type in your email address or phone number and we will send you a one-time code to reset your password.</p>
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                  <div className='form-group'>
                    {!!error &&
                    (
                      <div className="error text-danger mb-3" role="alert">
                        <small className="mb-0">
                          <i className="fas fa-exclamation-triangle" aria-hidden="true" /> {error}
                        </small>
                      </div>
                    )
                    }
                    <PhoneInput
                      name="userName"
                      formik={formik}
                      placeholder={t('Email or phone number')}
                      autoComplete="off"
                    />
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    block
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    <Trans>Send Code</Trans>
                  </Button>
                </form>
              </div>}

              {state === STATE_VERIFICATION && <div>
                <h1 className="text-center mb-4">Verification</h1>
                <p className="lead text-center">{`We sent you a text message to the number ${userNameText}. Enter code below to reset your password.`}</p>
                <form onSubmit={formikVerify.handleSubmit} autoComplete="off">
                  <div className='form-group'>
                    <Input
                      name="oneTimePasscode"
                      formik={formikVerify}
                      classes={classes.input}
                      placeholder={t('Verification Code')}
                      // showMask={!!formikVerify.values.oneTimePasscode}
                      mask={codeMaskRegex}
                      showError={false}
                      onChange={handleCodeChange}
                      data-target="code-input"
                    />
                    {error && <p className="error text-danger"><small><Trans>Code incorrect. Please check your texts and try again.</Trans></small></p>}
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    block
                    disabled={!formikVerify.isValid || formikVerify.isSubmitting}
                  >
                    <Trans>Verify</Trans>
                  </Button>
                </form>
              </div>}

              {state === STATE_NEW_PASSWORD && <div>
                <h1 className="text-center mb-4">Create Password</h1>
                <p id="pwHelp" className="form-text text-muted mb-3">
                  You must include:
                  <span className='d-block ml-2 mt-2'><i className={lengthValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> 8-15 characters</span>
                  <span className='d-block ml-2 mt-2'><i className={lettersValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> letters (a-Z)</span>
                  <span className='d-block ml-2 mt-2'><i className={numbersValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> numbers (0-9)</span>
                  <span className='d-block ml-2 my-2'><i className={specialValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> at least one special character</span>
                </p>
                <form onSubmit={formikNewPassword.handleSubmit} autoComplete="off">
                  <div className='form-group'>
                    <Input
                      showError={false}
                      type={showPassword ? 'text' : 'password'}
                      classes={classes.password}
                      name="password"
                      formik={formikNewPassword}
                      maxLength="15"
                      append={(
                        <div className="input-group-append" onClick={togglePassword}>
                          <span className="input-group-text border-left-0 bg-white">
                            <i className="fas fa-eye-slash" aria-hidden="true" />
                            <span className="sr-only"><Trans>Show Password</Trans></span>
                          </span>
                        </div>
                      )}
                      placeholder={t('Create Password')}
                    />
                    <br />
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    block
                    disabled={formikNewPassword.isSubmitting || !lengthValid || !numbersValid || !lettersValid || !specialValid}
                  >
                    <Trans>Submit</Trans>
                  </Button>
                </form>
              </div>}
              <hr className="mt-4 mb-4" />

              <Link to={URLS.LOGIN()} className="btn btn-outline-primary btn-block" title={t('Go back to Login')}>
                <Trans>Go back to Login</Trans>
              </Link>
            </div>
          </div>

          <PasswordResetModal
            show={showPasswordResetModal}
            onClose={onPasswordResetModalClose}
          />

        </div>
      </div>
    </Layout>

  );
};

ForgotPassword.displayName = 'ForgotPassword';
export default ForgotPassword;
