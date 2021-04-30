import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmDeleteModal = ({
  onCancel,
  onConfirm,
  show,
}) => {
  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <i className="fa-lg mr-1 far fa-trash-alt" aria-hidden="true" /> <Trans>Delete Workspace</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            <Trans i18nKey="del_loc_tasks" />
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


ConfirmDeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string,
};

ConfirmDeleteModal.defaultProps = {
  show: false,
  title: '',
};

ConfirmDeleteModal.displayName = 'ConfirmDeleteModal';
export default ConfirmDeleteModal;
