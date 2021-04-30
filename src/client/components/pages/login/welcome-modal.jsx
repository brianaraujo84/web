import React from 'react';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const WelcomeModal = () => {
  const [show, setShow] = React.useState(true);

  const close = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={close} centered data-target="modal-container">
        <Modal.Body className="text-center">

          <div className="px-5 pt-3 mb-3">
            <img src="/assets/img/logo_confidence.png" width="220" />
          </div>
          <h3 className="mb-3"><Trans>Congrats and welcome to our community!</Trans></h3>
          <p className="lead mb-0"><Trans>Now sign in to get started.</Trans></p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            block
            onClick={close}
            data-target="button-signin"
          >
            <Trans>Sign In</Trans>
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
};


WelcomeModal.displayName = 'WelcomeModal';
export default WelcomeModal;
