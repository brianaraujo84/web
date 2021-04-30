import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const InviteToTeamModal = ({
  onClose,
  onUpdate,
  show,
}) => {

  return (
    <>
      <Modal show={show} onHide={onClose} centered scrollable={true}>
        <Modal.Body className="text-center">
          <div className="text-center py-2">
            <i className="fad fa-users text-secondary fa-4x" aria-hidden="true"></i>
          </div>
          <h4 className="mb-3">Add Your Team</h4>
          <p className="mb-0">Do you want to add people to collaborate with you in this Workspace?</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex w-100">
            <div className="col p-0 pr-3">
              <Button variant="outline-primary" onClick={onClose} block>
                <Trans i18nKey="not_now" defaults="Not Now"/>
              </Button>
            </div>
            <div className="col p-0">
              <Button variant="primary" type="submit" block onClick={onUpdate}>
                <Trans i18nKey="yes" defaults="Yes"/>
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

InviteToTeamModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

InviteToTeamModal.defaultProps = {
  onUpdate: () => {},
  onClose: () => {},
};

InviteToTeamModal.displayName = 'InviteToTeamModal';
export default InviteToTeamModal;
