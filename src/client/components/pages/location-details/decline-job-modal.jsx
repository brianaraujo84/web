import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const DeclineJobModal = ({ show, onCancel, onDecline, isJob }) => {
  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title as="h5">
            <i className="fa-lg mr-1 far fa-trash-alt" aria-hidden="true" />{isJob ? (<Trans i18nKey="decline_job" />) : (<Trans i18nKey="decline_task" />)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            {isJob ? (<Trans i18nKey="decline_prompt" />) : (<Trans i18nKey="decline_task_prompt" />)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCancel}>
            <Trans i18nKey="dont_decline" />
          </Button>
          <Button variant="danger" onClick={onDecline}>
            <Trans i18nKey="decline" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeclineJobModal.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  isJob: PropTypes.bool,
};

DeclineJobModal.defaultProps = {
  show: false,
};

DeclineJobModal.displayName = 'DeclineJobModal';

export default DeclineJobModal;
