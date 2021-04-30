import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';


const RequireImageVerificationModal = ({
  show,
  onClose,
  onSelectItem,
  selectedItem,
}) => {
  const handleOnSelectItem = (value) => {
    onSelectItem(+value);
  };

  const handleOnClose = () => {
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-primary fas fa-check-square" /> <Trans i18nKey=" require_image_verification" defaults=" Require Image Verification"/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-secondary">
            <Trans i18nKey="require_image_verification_help_text" defaults="The assignee will be required to submit and image with the finished task." />
          </p>
          <ListGroup onSelect={handleOnSelectItem} defaultActiveKey={`${selectedItem}`} data-target="list">
            <ListGroup.Item eventKey="1" action className="suggestion">
              <i className="text-secondary fas fa-camera mr-1" aria-hidden="true"></i> Photo
            </ListGroup.Item>
            <ListGroup.Item eventKey="2" action className="suggestion">
              <i className="text-secondary fas fa-image mr-1" aria-hidden="true"></i> Screenshot
            </ListGroup.Item>
            <ListGroup.Item eventKey="0" action className="suggestion">
              <i className="text-secondary far fa-times-circle mr-1" aria-hidden="true"></i> No image required
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

RequireImageVerificationModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.number,
};

RequireImageVerificationModal.defaultProps = {
  show: false,
  selectedItem: 0,
};

RequireImageVerificationModal.displayName = 'LocationDetailsRequireImageVerificationModal';
export default RequireImageVerificationModal;
