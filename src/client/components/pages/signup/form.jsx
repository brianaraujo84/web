import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useForm, Input, classnames, ErrorMessage } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import * as URLS from '../../../urls';
import { toBase64 } from '../../../utils';
import { placeholderUserImg, ErrorTypes } from '../../../constants';
import useIsMobile from '../../../hooks/is-mobile';

import PhoneInput from '../../shared/phone-input';
import CropModal from '../../shared/crop-modal';

import AlreadyExist from './already-exist';
const classes = {
  input: {
    input: 'form-control mb-0',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group input-group mb-0',
  },
  password: {
    container: 'form-group input-group mb-0',
    input: 'form-control border-right-0',
    inputError: 'error_1 is-invalid_1',
    error: 'invalid-feedback_1',
    containerError: 'error_1',
  },
};

let imgUrl;

const Form = ({ handleSubmit, error }) => {
  const { t } = useTranslation();
  const fileEl = React.useRef(null);

  // const [profilePhoto, setProfilePhoto] = React.useState(null);
  const [lengthValid, setLengthValid] = React.useState(false);
  const [lettersUpperCaseValid, setLettersUpperCaseValid] = React.useState(false);
  const [lettersLowerCaseValid, setLettersLowerCaseValid] = React.useState(false);
  const [numbersValid, setNumbersValid] = React.useState(false);
  const [specialValid, setSpecialValid] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [tmpPhoto, setTmpPhoto] = React.useState(null);
  const [showCropModal, setShowCropModal] = React.useState(false);

  const { phone = '' } = useParams();
  const registerInProgress = useSelector(state => state.profile.inprogress);

  const fields = [
    {
      name: '_inputPhoneName',
      label: t('Phone number'),
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'matches',
          params: [/^\+?[0-9]{10,14}$/, t('Incorrect Phone Number Format')],
        },
      ],
    },
    {
      name: 'phone',
      label: t('Phone number'),
      initialValue: phone,
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'matches',
          params: [/^\+[0-9]{11,14}$/, t('Incorrect Phone Number Format')],
        },
      ],
    },
    {
      name: 'firstName',
      label: t('First Name'),
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'matches',
          params: [/^[a-zA-Z ]+$/, t('Only alphabetical characters are allowed')],
        },
      ],
    },
    {
      name: 'lastName',
      label: t('Last Name'),
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'matches',
          params: [/^[a-zA-Z ]+$/, t('Only alphabetical characters are allowed')],
        },
      ],
    },
    {
      name: 'email',
      label: t('Email'),
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'email',
          params: [t('Incorrect E-mail format')]
        },
      ],
    },
    {
      name: 'password',
      label: t('Password'),
      type: 'password',
      validations: [
        {
          rule: 'required',
        },
      ],
    },
    {
      name: 'profilePhoto',
      validations: [
        {
          rule: isMobile ? 'required' : '',
        },
      ],
    },
  ];

  const handleSetPhotoFromFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.match(/^image\//)) {
        setTmpPhoto(files[i]);
        setShowCropModal(true);
        fileEl.current.value = null;
        return;
      }
    }
  };

  const handlePhotoClick = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    fileEl.current.click();
  };

  const handlePhotoDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { files } = e.dataTransfer;
    handleSetPhotoFromFiles(files);
  };
  const handlePhotoUpload = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { files } = e.target;
    handleSetPhotoFromFiles(files);
  };

  const handlePhotoDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const onSubmit = async (values) => {
    const data = { ...values };
    data.userName = values.email;
    const { profilePhoto } = values;

    const result = profilePhoto && await toBase64(profilePhoto);
    handleSubmit(data, result);
  };

  const togglePassword = () => {
    setShowPassword(show => !show);
  };

  const handleCropUpdate = (blob) => {
    imgUrl = URL.createObjectURL(blob);
    setTmpPhoto(null);
    setShowCropModal(false);
    formik.setFieldValue('profilePhoto', blob);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setTmpPhoto(null);
    handlePhotoClick();
  };

  React.useEffect(() => {
    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, []);

  const formik = useForm({ fields, onSubmit });
  const { profilePhoto } = formik.values;

  React.useMemo(() => {
    const lettersLowerCaseRegex = /[a-z]/;
    const lettersUpperCaseRegex = /[A-Z]/;
    const numbersRegex = /[0-9]/;
    const specialRegex = /[@$!%*#?&^]/;
    if (formik.values.password.length >= 8 && formik.values.password.length <= 15) {
      setLengthValid(true);
    } else {
      setLengthValid(false);
    }
    if (lettersLowerCaseRegex.test(formik.values.password)) {
      setLettersLowerCaseValid(true);
    } else {
      setLettersLowerCaseValid(false);
    }
    if (lettersUpperCaseRegex.test(formik.values.password)) {
      setLettersUpperCaseValid(true);
    } else {
      setLettersUpperCaseValid(false);
    }
    if (numbersRegex.test(formik.values.password)) {
      setNumbersValid(true);
    } else {
      setNumbersValid(false);
    }
    if (specialRegex.test(formik.values.password)) {
      setSpecialValid(true);
    } else {
      setSpecialValid(false);
    }
  },[formik.values.password]);

  const isMobile = useIsMobile();
  
  if (registerInProgress) {
    return (
      <div className='p-2 col'>
        <span className='ph-animate ph-text ph-title mb-2'></span>
        <span className='ph-animate ph-text ph-title mb-2'></span>
        <span className='ph-animate ph-text ph-title mb-2'></span>
        <div className='form-group form-row'>
          <div className='col'><span className='ph-animate ph-text ph-title mb-2'></span></div>
          <div className='col'><span className='ph-animate ph-text ph-title mb-2'></span></div>
        </div>
        <span className='ph-animate ph-text ph-text-half mb-2'></span>
        <span className='ph-animate ph-text ph-small mb-2'></span>
        <span className='ph-animate ph-text ph-small mb-2'></span>
        <span className='ph-animate ph-text ph-title mb-2'></span>
        <span className='ph-animate ph-text ph-small'></span>
        <div className='form-group mb-0 mt-4 text-center'>
          <div className='ph-animate ph-icon-large d-inline-block rounded-circle mb-2'></div>
        </div>
        <span className='ph-text ph-small'></span>
      </div>
    );
  }
  return (
    <>
      <form onSubmit={formik.handleSubmit} autoComplete='off'>
        <h1 className='text-center mb-4'><Trans>Create Account</Trans></h1>
        {!!error && error.errorCode === '-1' &&
          (
            <div className='error text-danger mb-3' role='alert'>
              <small className='mb-0'>
                <i className='fas fa-exclamation-triangle mr-2' aria-hidden='true' /> {error.message}
              </small>
            </div>
          )
        }
        <div className='form-group'>
          <PhoneInput
            name='phone'
            formik={formik}
            phoneonly
            placeholder={t('Phone number')}
            data-target='phone-input'
            autoComplete='new-phone'
            maxLength={13}
            invalid={error && error.errorCode === ErrorTypes.ERROR_PHONE_EXIST}
          />
          { error && error.errorCode === ErrorTypes.ERROR_PHONE_EXIST && <AlreadyExist message={t(error.message)}/> }
        </div>
        <div className='form-group'>
          <Input
            type='email'
            classes={classes.input}
            name='email'
            maxLength='150'
            formik={formik}
            placeholder={t('Email Address')}
            autoComplete='new-email'
            invalid={error && error.errorCode === ErrorTypes.ERROR_EMAIL_EXIST}
          />
          { error && error.errorCode === ErrorTypes.ERROR_EMAIL_EXIST && <AlreadyExist message={t(error.message)}/> }
        </div>
        <div className='form-group form-row'>
          <div className='col'>
            <Input
              classes={classes.input}
              name='firstName'
              formik={formik}
              maxLength='100'
              placeholder={t('First Name')}
              autoComplete='new-firstname'
            />
          </div>
          <div className='col'>
            <Input
              classes={classes.input}
              name='lastName'
              formik={formik}
              maxLength='100'
              placeholder={t('Last Name')}
              autoComplete='new-lastname'
            />
          </div>
        </div>
        <div className='form-group mb-0'>
          <label className='text-secondary mb-0' htmlFor='password'>Create Password</label>

          <small id='pwHelp' className='form-text text-muted mb-2'>
            You must include:
            <span className='d-block ml-2 mt-2'><i className={lengthValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> 8-15 characters</span>
            <span className='d-block ml-2 mt-2'><i className={lettersLowerCaseValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> lowercase letters (a-z)</span>
            <span className='d-block ml-2 mt-2'><i className={lettersUpperCaseValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> uppercase letters (A-Z)</span>

            <span className='d-block ml-2 mt-2'><i className={numbersValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> numbers (0-9)</span>
            <span className='d-block ml-2 my-2'><i className={specialValid ? 'fas fa-check-circle text-success fa-lg' : 'far fa-circle fa-lg'} aria-hidden='true'></i> at least one special character</span>
          </small>
          <div className='input-group' id='password-input'>
            <Input
              showError={false}
              type={showPassword ? 'text' : 'password'}
              classes={classes.password}
              name='password'
              formik={formik}
              maxLength='15'
              autoComplete='new-password'
              append={(
                <div className='input-group-append' onClick={togglePassword}>
                  <span className='input-group-text border-left-0 bg-white'>
                    <i className='fas fa-eye-slash' aria-hidden='true' />
                    <span className='sr-only'><Trans>Show Password</Trans></span>
                  </span>
                </div>
              )}
              placeholder={t('Password')}
            />
            {
              !formik.values.length && (
                <ErrorMessage
                  formik={formik}
                  name='password'
                  className='error-message'
                />
              )
            }
          </div>
        </div>
        <div className='form-group mb-0 mt-4 text-center'>
          <p className='mb-1 text-muted'>
            <Trans>Please take a picture for your profile</Trans>&nbsp;
            {!!profilePhoto && (
              <a href='#' onClick={handlePhotoClick}>
                <i className='far fa-pencil-alt' aria-hidden='true'></i> <span className='sr-only'><Trans>Change Picture</Trans></span>
              </a>
            )
            }
          </p>
          <input
            type='file'
            accept='image/*'
            capture='user'
            style={{ display: 'none' }}
            ref={fileEl}
            onChange={handlePhotoUpload}
            data-target='file-input'
          />
          <div
            onClick={handlePhotoClick}
            onDrop={handlePhotoDrop}
            onDragOver={handlePhotoDragOver}
            data-target='photo-upload-container'
          >
            <a
              className={classnames(['mx-auto mt-2 blue-border', (!!profilePhoto) && 'pic'])}
              id='profile-img'
            >
              <div className='overlay'>
                <i className='fad fa-3x text-primary fa-camera-alt' aria-hidden='true' />
              </div>
              <img src={profilePhoto ? imgUrl : placeholderUserImg} />
            </a>
          </div>
        </div>
        <div className='row justify-content-between mt-4'>
          <div className='col-12'>
            <p className='mb-4 text-center'>
              <small><Trans>By clicking <strong>Agree</strong>, you agree to the <a href='https://www.confidencesystems.com/terms-and-conditions/' target='_blank' rel='noreferrer'>Terms and Conditions</a> and <a href='https://www.confidencesystems.com/privacy/' target='_blank' rel='noreferrer'>Privacy Policy</a>.</Trans></small>
            </p>
          </div>
          <div className='col-12'>
            <Button
              type='submit'
              variant='primary'
              block
              disabled={formik.isSubmitting || !lengthValid || !numbersValid || !lettersUpperCaseValid || !lettersLowerCaseValid || !specialValid || (isMobile && !formik.values.profilePhoto) || !formik.values.email || !formik.values.lastName || !formik.values.firstName || !formik.values.phone || !formik.values._inputPhoneName}
              data-target='submit-next'
            >
              <Trans>Agree</Trans>
            </Button>
            <hr className='mt-4' />
            <p className='text-center'><Trans>Already have an account?</Trans></p>
            <Link to={URLS.LOGIN()} className='btn btn-outline-primary btn-block'><Trans>Log In</Trans></Link>
          </div>
        </div>
      </form>
      {
        !!tmpPhoto && !!showCropModal && (
          <CropModal
            onClose={handleCropCancel}
            onUpdate={handleCropUpdate}
            photo={tmpPhoto}
            square
          />
        )
      }
    </>
  );
};
Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};
Form.defaultProps = {
  error: null,
};
Form.displayName = 'SignupForm';
export default Form;
