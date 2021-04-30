import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ConfirmDeleteModal = ({
  onCancel,
  onConfirm,
  show,
  canDelete,
}) => {
  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h6">
            {canDelete ? (
              <>
                <i className="fa-lg mr-1 far fa-trash-alt" aria-hidden="true" /> <Trans i18nKey="del_zone" />
              </>
            ) : (
              <>
                <i className="fas fa-exclamation-triangle mr-1" aria-hidden="true" /> 
                <Trans i18nKey="zone_not_del" />
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {canDelete ? (
            <>
              <p>
                <Trans i18nKey="del_zone_prmt" />
              </p>
              <p className="mb-0">
                <small className="text-secondary">
                  <i className="fas fa-exclamation-triangle mr-1" aria-hidden="true" />
                  <strong><Trans i18nKey="warning" /> </strong>
                  <Trans i18nKey="del_zone_warn" />
                </small>
              </p>
            </>
          ) : (
            <>
              <p className="mb-0">
                <Trans i18nKey="del_zone_info" />
                <strong className="mx-1"><Trans i18nKey="del_zone_info_mid" /></strong>
                <Trans i18nKey="del_zone_info_post" />
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {canDelete ? (
            <>
              <Button variant="outline-secondary" onClick={onCancel}>
                <Trans i18nKey="cancel" />
              </Button>
              <Button variant="danger" onClick={onConfirm}>
                <Trans i18nKey="delete" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={onCancel} block>
                <Trans i18nKey="okay" />
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

    </>
  );
};


ConfirmDeleteModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string,
};

ConfirmDeleteModal.defaultProps = {
  show: false,
  title: '',
};

ConfirmDeleteModal.displayName = 'ConfirmDeleteModal';
export default ConfirmDeleteModal;
