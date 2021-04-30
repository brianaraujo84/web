import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DeleteModal = ({
  onCancel,
  onConfirm,
  show,
  title,
  messageText,
  cancelText,
  deleteText,
}) => {
  const { t } = useTranslation();
  cancelText = cancelText || t('cancel');
  deleteText = deleteText || t('delete');

  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <i className="fa-lg mr-1 far fa-trash-alt" aria-hidden="true" /> {title}
          </Modal.Title>
        </Modal.Header>
        {
          !!messageText && (
            <Modal.Body>
              <p className="mb-0">
                {messageText}
              </p>
            </Modal.Body>
          )
        }

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {deleteText}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};


DeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string.isRequired,
  deleteText: PropTypes.string,
  messageText: PropTypes.string,
  cancelText: PropTypes.string,
};

DeleteModal.defaultProps = {
  show: false,
  messageText: null,
  deleteText: null,
  cancelText: null,
};

DeleteModal.displayName = 'DeleteModal';
export default DeleteModal;
