import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const PasswordResetModal = ({ show, onClose }) => {

  return (
    <>
      <Modal show={show} centered>
        <Modal.Body className="text-center">
          <div className="px-5 pt-3 mb-3">
            <img src="/assets/img/logo_confidence.png" width="220" />
          </div>
          <h3 className="mb-3"><Trans>Your password was reset.</Trans></h3>
          <p className="lead mb-0"><Trans>You can sign in to your account using your new password.</Trans></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" block onClick={onClose}>
            <Trans>Sign In</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

PasswordResetModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

PasswordResetModal.defaultProps = {
  show: false,
};

PasswordResetModal.displayName = 'PasswordResetModal';
export default PasswordResetModal;
