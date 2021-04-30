import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmDeleteImageModal = ({
  onCancel,
  onConfirm,
  show,
}) => {
  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <i className="fa-lg mr-1 far fa-trash-alt" aria-hidden="true" /> <Trans>Delete Image</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            <Trans i18nKey="sure_delete" />
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCancel}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            <Trans i18nKey="delete" />
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};


ConfirmDeleteImageModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

ConfirmDeleteImageModal.defaultProps = {
  show: false,
};

ConfirmDeleteImageModal.displayName = 'ConfirmDeleteImageModal';
export default ConfirmDeleteImageModal;
