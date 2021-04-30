import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';


const DeviceHelpModal = ({
  show, onClose
}) => {

  return (
    <>
      <Modal show={show} centered onHide={onClose}>
        <Modal.Header className="bg-primary text-white" closeButton>
          <Modal.Title as="h6">
            <Trans i18nKey="device_qr_code" defaults="Device QR code"/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="lead">The unique QR code is located on the back of your device.</p>
            <p className="mb-3 text-center">
              <img src="../../assets/img/device-setup/01.png" height="260"/>
            </p>
            <p className="mb-0">If you can't find the code or it is damaged, you can enter the device Serial Number manually.</p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

DeviceHelpModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

DeviceHelpModal.defaultProps = {
  onClose: () => {},
  show: false,
};

DeviceHelpModal.displayName = 'DeviceHelpModal';
export default DeviceHelpModal;
