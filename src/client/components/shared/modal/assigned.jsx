import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AssignedModal = ({
  onCancel,
  onConfirm,
  show,
  title,
  messageText,
  secondLineText,
  cancelText,
  confirmText,
}) => {
  const { t } = useTranslation();
  cancelText = cancelText || t('cancel');
  confirmText = confirmText || t('confirm');

  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-primary fad fa-user"></i> {title}
          </Modal.Title>
        </Modal.Header>
        {
          !!messageText && (
            <Modal.Body>
              <p>
                {messageText}
              </p>
              <p className="mb-0">
                {secondLineText}
              </p>
            </Modal.Body>
          )
        }

        <Modal.Footer>
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


AssignedModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  messageText: PropTypes.string,
  cancelText: PropTypes.string,
  secondLineText: PropTypes.string,
};

AssignedModal.defaultProps = {
  show: false,
  messageText: null,
  confirmText: null,
  cancelText: null,
};

AssignedModal.displayName = 'AssignedModal';
export default AssignedModal;
