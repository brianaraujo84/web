import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { locationTypes, locationImageURLs } from '../../../constants';

const ZonePopupModal = ({ show, locationType, onViewZones, onCancel }) => {
  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <Modal.Header className="bg-primary text-white">
          <Modal.Title as="h5">
            <Trans i18nKey="enable_zones">Enable zones</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <Trans i18nKey="zone_popup_msg" />
          </p>
          <p className="mb-3 text-center">
            <img
              src={locationImageURLs[locationType] || locationImageURLs[locationTypes.HOME]}
              width="250"
              alt="floor plan image of an apartment"
            />
          </p>
          <hr />
          <p>
            <Trans i18nKey="do_you_want_to_enable_zones?">Do you want to enable zones?</Trans>
          </p>
          <Row>
            <Col className="pr-0">
              <Button variant="primary" block onClick={onCancel}>
                <Trans i18nKey="not_now" />
              </Button>
            </Col>
            <Col>
              <Button variant="outline-primary" block onClick={onViewZones}>
                <Trans i18nKey="yes_enable" >Yes, Enable</Trans>
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

ZonePopupModal.propTypes = {
  locationType: PropTypes.string.isRequired, 
  onViewZones: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

ZonePopupModal.defaultProps = {
  show: false,
};

ZonePopupModal.displayName = 'ZonePopupModal';

export default ZonePopupModal;
