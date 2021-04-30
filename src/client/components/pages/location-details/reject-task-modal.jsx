import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const RejectTaskModal = ({ show, onReassign, onReject, onCancel }) => {

  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <i className="fa-lg mr-1 far fa-times" aria-hidden="true" /> <Trans i18nKey="reject" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            <Trans>Do you want to request rework from the assignee or is this work no longer required?</Trans>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCancel}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button variant="danger" onClick={onReject}>
            <Trans i18nKey="not_required" />
          </Button>
          <Button variant="primary" onClick={onReassign}>
            <Trans i18nKey="rework" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

RejectTaskModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onReassign: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

RejectTaskModal.displayName = 'RejectTaskModal';
export default RejectTaskModal;
