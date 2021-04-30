import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { useForm, Input } from 'react-form-dynamic';

import { useActionDispatch } from '../../../hooks';
import { updateUser } from '../../../redux/actions/profile';
import { addToast } from '../../../redux/actions/toasts';
import { toBase64 } from '../../../utils';

import CropModal from '../../shared/crop-modal';

const classes = {
  input: {
    input: 'form-control',
    label: 'text-muted',
    error: 'invalid-feedback',
    inputError: 'error is-invalid',
    container: 'form-group',
  },
};

let imgUrl;

const Form = () => {
  const { t } = useTranslation();
  const [editable, setEditable] = React.useState(false);
  const [profilePhoto, setProfilePhoto] = React.useState(null);
  const [tmpPhoto, setTmpPhoto] = React.useState(null);
  const [showCropModal, setShowCropModal] = React.useState(false);

  const profile = useSelector(state => state.profile.data);
  const fileEl = React.useRef(null);

  const changeUser = useActionDispatch(updateUser);
  const toast = useActionDispatch(addToast);

  const {
    username,
    firstName,
    lastName,
    email,
    imgThumb,
  } = profile;

  const fields = [
    {
      name: 'firstName',
      label: t('First Name'),
      initialValue: firstName,
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
      initialValue: lastName,
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
      initialValue: email,
      validations: [
        {
          rule: 'required',
        },
        {
          rule: 'email',
        },
      ],
    },
  ];

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditable(true);
  };

  const handleDiscard = () => {
    formik.handleReset();
    setProfilePhoto(null);
    setEditable(false);
  };

  const onSubmit = async ({ firstName, lastName, email }) => {
    const img = profilePhoto && await toBase64(profilePhoto);
    const data = {
      userName: username,
      firstName,
      lastName,
      email,
      img,
    };

    try {
      await changeUser(data);
      window.location.reload();
      toast(t('Profile Updated!'));
    } catch (e) {
      toast(t('Profile Update Failed!'));
    }
    setEditable(false);
  };

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


  const handleCropUpdate = (blob) => {
    imgUrl = URL.createObjectURL(blob);
    setProfilePhoto(blob);
    setTmpPhoto(null);
    setShowCropModal(false);
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

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 pb-2">
          <p className="lead mb-3">
            <Trans>
              Profile
            </Trans>
            {' '}
            {
              !editable && (
                <a href="#" onClick={handleEdit} data-target="edit-link">
                  <i className="far fa-pencil-alt" aria-hidden="true" /> <span className="sr-only"><Trans>Edit Profile</Trans></span>
                </a>
              )
            }
          </p>
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <Input
              classes={classes.input}
              name="firstName"
              formik={formik}
              maxLength="100"
              label={t('First Name')}
              placeholder={t('First Name')}
              autoComplete="new-firstname"
              disabled={!editable}
            />

            <Input
              classes={classes.input}
              name="lastName"
              formik={formik}
              maxLength="100"
              label={t('Last Name')}
              placeholder={t('Last Name')}
              autoComplete="new-lastName"
              disabled={!editable}
            />

            <Input
              type="email"
              classes={classes.input}
              name="email"
              maxLength="150"
              formik={formik}
              label={t('Email Address')}
              placeholder={t('Email Address')}
              autoComplete="off"
              disabled={!editable}
            />

            {editable && (
              <div className="form-group mb-0 mt-4 text-center">
                <p className="mb-1 text-muted">
                  <Trans>Picture for your profile</Trans>&nbsp;
                  <a href="#" onClick={handlePhotoClick}>
                    <i className="far fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only"><Trans>Change Picture</Trans></span>
                  </a>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  // capture="user"
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
                    className="mx-auto mt-2 pic"
                    id="profile-img"
                  >
                    <img src={profilePhoto ? imgUrl : imgThumb} />
                  </a>
                </div>
              </div>
            )}

            {editable && (
              <div className="row justify-content-between pb-3 mt-4">
                <div className="col-6">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    data-target="discard-btn"
                    onClick={handleDiscard}
                    block
                  >
                    <Trans>Discard</Trans>
                  </Button>
                </div>
                <div className="col-6">
                  <Button
                    variant="primary"
                    type="submit"
                    block
                    data-target="submit-btn"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    <Trans>Save</Trans>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

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
Form.displayName = 'Form';
export default Form;
