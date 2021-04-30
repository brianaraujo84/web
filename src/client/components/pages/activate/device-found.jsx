import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import * as URLS from '../../../urls';


const DeviceFound = ({
  show,
}) => {
  const history = useHistory();

  return (
    <>
      <Modal show={show} centered>
        <Modal.Header className="bg-primary text-white">
          <Modal.Title as="h6">
            <Trans i18nKey="device_found" defaults="Device found!"/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p className="lead">Good news!</p>
            <p>We have identified your device.</p>
            <p className="mb-0">Now we will guide you through the activation process.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" block onClick={() => history.push(URLS.ACTIVATE('step1'))}>
            <Trans i18nKey="continue" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

DeviceFound.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  dueDate: PropTypes.string,
  minDate: PropTypes.any,
};

DeviceFound.defaultProps = {
  onUpdate: () => {},
  onClose: () => {},
};

DeviceFound.displayName = 'DeviceFound';
export default DeviceFound;
