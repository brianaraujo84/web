import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';

const AIOffModal = ({
  onClose,
  show,
  onConfirm,
  aiEnabled
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton className="modal-header bg-primary text-white">
          <Modal.Title as="h6" className='modal-title'>
            <i className="fa-lg mr-1 far fa-cloud" aria-hidden="true" /> <Trans>Confidence Work Score</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <Trans>{`Confidence Work Score is currently ${aiEnabled ? 'enabled' : 'disabled'} on this task. Do you want to ${aiEnabled ? 'disable' : 'enable'} it?`}</Trans>
          </p>
          <a className={isExpanded ? 'mb-0' : 'mb-0 collapsed'} onClick={() => setIsExpanded(!isExpanded)} aria-controls="ai-info1" aria-expanded={isExpanded} data-toggle="collapse" href="#" role="button"><i className="far fa-info-circle" aria-hidden="true"></i> <Trans>About Confidence Work Score</Trans></a>
          <p className={isExpanded ? 'small mt-2 mb-0 show collapse' : 'small mt-2 mb-0 collapse'} id="ai-info1"><Trans>We help score how "well" the work was done with AI. To enable this, you have to take a picture of what you want the result to look like and that will become the expected state. This enables Confidence scoring the next time the work is assigned.</Trans></p>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex w-100">
            <div className="col p-0 pr-3">
              <button onClick={onClose} className="btn btn-block btn-outline-secondary" data-dismiss="modal" type="button">{`Don't ${aiEnabled ? 'Disable' : 'Enable'}`}</button>
            </div>
            <div className="col p-0">
              <button onClick={onConfirm} className="btn btn-block btn-primary" data-dismiss="modal" data-target="#choose-reference-image" data-toggle="modal" type="button">{aiEnabled ? 'Disable' : 'Enable'}</button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AIOffModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  onConfirm: PropTypes.func,
  aiEnabled: PropTypes.bool,
};

AIOffModal.defaultProps = {
  show: false,
};

AIOffModal.displayName = 'AIOffModal';
export default AIOffModal;
