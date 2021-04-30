import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useActionDispatch } from '../../../hooks';
import { updateUserProfile } from '../../../redux/actions/profile';


const CompleteModal = ({
  onCancel,
  onConfirm,
  show,
  title,
  messageText,
  cancelText,
  confirmText,
  postUserPref,
  quickCompleteTaskOption,
}) => {
  const { t } = useTranslation();
  cancelText = cancelText || t('cancel');
  confirmText = confirmText || t('confirm');
  const updateUserProfileInfo = useActionDispatch(updateUserProfile);

  const [isDontShowChecked, setIsDontShowChecked] = React.useState(quickCompleteTaskOption);

  const handleCheck = ({ target }) => {
    setIsDontShowChecked(!isDontShowChecked);
    if (target.value === 'true') {
      postUserPref({ quickCompleteTaskOption: true });
      updateUserProfileInfo({ quickCompleteTaskOption: true });
    } else if (target.value === 'false') {
      postUserPref({ quickCompleteTaskOption: false });
      updateUserProfileInfo({ quickCompleteTaskOption: false });
    }
  };

  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-primary fas fa-check"></i> {title}
          </Modal.Title>
        </Modal.Header>
        {
          !!messageText && (
            <Modal.Body>
              <p>
                {messageText}
              </p>
            </Modal.Body>
          )
        }

        <Modal.Footer>
          {/* COMMENTED OUT UNTIL WE GET API DETAILS FOR SAVING THIS PREFERENCE */}
          <div className="text-left w-100 mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value={!isDontShowChecked} id="dontshowcompletemodal" onChange={(event) => handleCheck(event)} />
              <label className="form-check-label" htmlFor="dontshowcompletemodal">
                Don't show this again.
              </label>
            </div>
          </div>
          <div className='col p-0'>
            <Button variant="outline-secondary" className='btn btn-block btn-outline-secondary' onClick={onCancel}>
              {cancelText}
            </Button>
          </div>
          <div className='col p-0'>
            <Button variant="primary" className='btn btn-block btn-primary' onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

    </>
  );
};


CompleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  messageText: PropTypes.string,
  cancelText: PropTypes.string,
  secondLineText: PropTypes.string,
  postUserPref: PropTypes.func,
  quickCompleteTaskOption: PropTypes.bool,
};

CompleteModal.defaultProps = {
  messageText: null,
  confirmText: null,
  cancelText: null,
};

CompleteModal.displayName = 'CompleteModal';
export default CompleteModal;
