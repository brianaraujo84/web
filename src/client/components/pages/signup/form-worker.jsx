import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useForm, Input, ErrorMessage, classnames } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import { toBase64 } from '../../../utils';
import { placeholderUserImg } from '../../../constants';
import PinInput from '../../shared/pin-input';
import PhoneInput from '../../shared/phone-input';
import CropModal from '../../shared/crop-modal';

// const phoneMaskRegex = ['+', /\d/, ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

// const countryCode = 1;


const classes = {
  input: {
    input: 'form-control',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
};

let imgUrl;

const Form = ({ handleSubmit, error }) => {
  const { t } = useTranslation();
  const fileEl = React.useRef(null);

  // const [profilePhoto, setProfilePhoto] = React.useState(null);
  const [tmpPhoto, setTmpPhoto] = React.useState(null);
  const [showCropModal, setShowCropModal] = React.useState(false);

  const { phone = '' } = useParams();

  const fields = [
    {
      name: '_inputPhoneName',
      initialValue: phone,
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
          params: [/^[a-zA-Z0-9 ]+$/, t('Only alphanumeric characters are allowed')],
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
          params: [/^[a-zA-Z0-9 ]+$/, t('Only alphanumeric characters are allowed')],
        },
      ],
    },
    {
      name: 'email',
      label: t('Email'),
      validations: [
        {
          rule: 'email',
          params: [t('Incorrect E-mail format')]
        },
      ],
    },
    {
      name: 'pin',
      label: t('Pin'),
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'min',
          params: [6]
        },
        {
          rule: 'max',
          params: [6]
        },
      ],
    },
    {
      name: 'profilePhoto',
      validations: [
        {
          rule: 'required',
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

  // const handlePhoneChange = ({ target: { value } }) => {
  //   formik.setFieldValue('phone', value.length ? `+${value.replace(/(\D+)/g, '')}` : '');
  // };

  // const pipePhoneChange = (value, config) => {
  //   const { rawValue } = config;
  //   if (rawValue.length === 1) {
  //     if (rawValue === '+') {
  //       return rawValue;
  //     } else {
  //       return `+${countryCode}${rawValue}`;
  //     }
  //   } else {
  //     return value;
  //   }
  // };

  const onSubmit = async (values) => {
    const data = { ...values };
    data.userName = values.phone;
    const { profilePhoto } = values;

    const result = profilePhoto && await toBase64(profilePhoto);
    handleSubmit(data, result);
  };

  const handleCropUpdate = (blob) => {
    imgUrl = URL.createObjectURL(blob);
    formik.setFieldValue('profilePhoto', blob);
    setTmpPhoto(null);
    setShowCropModal(false);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setTmpPhoto(null);
    handlePhotoClick();
  };

  const handlePinChange = (value) => {
    formik.setFieldValue('pin', value);
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

  return (
    <>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <h1 className="text-center mb-4"><Trans>Create Account</Trans></h1>
        {!!error &&
          (
            <div className="error text-danger mb-3" role="alert">
              <small className="mb-0">
                <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true" /> {error}
              </small>
            </div>
          )
        }
        <PhoneInput
          name="phone"
          formik={formik}
          phoneonly
          placeholder={t('Phone number')}
          data-target="phone-input"
          autoComplete="new-phone"
          maxLength={13}
        />
        {/* <Input
          name="phone"
          formik={formik}
          classes={classes.input}
          type="tel"
          placeholder={t('Phone number')}
          // showMask={!!formik.values.phone}
          pipe={pipePhoneChange}
          onChange={handlePhoneChange}
          mask={phoneMaskRegex}
          data-target="phone-input"
          autoComplete="new-phone"
        /> */}
        <div className="form-row">
          <div className="col">
            <Input
              classes={classes.input}
              name="firstName"
              formik={formik}
              maxLength="100"
              placeholder={t('First Name')}
              autoComplete="new-firstname"
            />
          </div>
          <div className="col">
            <Input
              classes={classes.input}
              name="lastName"
              formik={formik}
              maxLength="100"
              placeholder={t('Last Name')}
              autoComplete="new-lastname"
            />
          </div>
        </div>
        <Input
          type="email"
          classes={classes.input}
          name="email"
          maxLength="150"
          formik={formik}
          placeholder={t('Email Address (optional)')}
          autoComplete="new-email"
        />
        <div className="form-group mb-0">
          <label className="text-secondary"><Trans>Create a 6-digit PIN</Trans></label>
          <p className="mb-2 text-muted">
            <small>
              <Trans>Your PIN must be 6 numeric digits. Only 1 digit can repeat.</Trans>
            </small>
          </p>
          <PinInput
            length={6}
            onChange={handlePinChange}
          />
          <ErrorMessage
            formik={formik}
            name="pin"
            className="error-message"
          />
        </div>

        <div className="form-group mb-0 mt-4 text-center">
          <p className="mb-1 text-muted">
            <Trans>Please take a picture for your profile</Trans>&nbsp;
            {!!profilePhoto && (
              <a href="#" onClick={handlePhotoClick}>
                <i className="far fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only"><Trans>Change Picture</Trans></span>
              </a>
            )
            }
          </p>
          <input
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: 'none' }}
            ref={fileEl}
            onChange={handlePhotoUpload}
            data-target="file-input"
          />
          <div
            onClick={handlePhotoClick}
            onDrop={handlePhotoDrop}
            onDragOver={handlePhotoDragOver}
            data-target="photo-upload-container"
          >
            <a
              className={classnames(['mx-auto mt-2 blue-border', (!!profilePhoto) && 'pic'])}
              id="profile-img"
            >
              <div className="overlay">
                <i className="fad fa-3x text-primary fa-camera-alt" aria-hidden="true" />
              </div>
              <img src={profilePhoto ? imgUrl : placeholderUserImg} />
            </a>
          </div>
        </div>
        <div className="row justify-content-between mt-4">
          <div className="col-12">
            <p className="mb-4 text-center">
              <small><Trans>By clicking <strong>Agree</strong>, you agree to the <a href="https://www.confidencesystems.com/terms-and-conditions/" target="_blank" rel="noreferrer">Terms and Conditions</a> and <a href="https://www.confidencesystems.com/privacy/" target="_blank" rel="noreferrer">Privacy Policy</a>.</Trans></small>
            </p>
          </div>
          <div className="col-12">
            <Button
              type="submit"
              block
              variant="primary"
              disabled={!formik.isValid || formik.isSubmitting}
              data-target="submit-next"
            >
              <Trans>Agree</Trans>
            </Button>
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
  error: PropTypes.string,
};
Form.defaultProps = {
  error: '',
};
Form.displayName = 'SignupFormWorker';
export default Form;
