import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import { classnames } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import ScrollableList from '../../shared/scrollable-list';

const AssociateZoneModal = ({ onClose, onAssociate, show, locationZoneId, isJob }) => {
  const [selectedZoneId, setSelectedZoneId] = React.useState(locationZoneId);

  const locationZones = useSelector(state => state.locationZones.items);

  const handleSelectZone = (selectedZone) => () => {
    setSelectedZoneId(selectedZone.id);
  };

  const handleAssociate = () => {
    onAssociate(selectedZoneId);
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-info fad fa-clinic-medical" /> <Trans i18nKey={isJob ? 'associate_zone_job' : 'associate_zone_to_task'} />  
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="list-group">
            <ScrollableList>
              {locationZones.map((locationZone) => (
                <div
                  key={locationZone.id}
                  className={classnames([
                    'list-group-item px-3',
                    locationZone.id === selectedZoneId && 'active'
                  ])}
                  onClick={handleSelectZone(locationZone)}
                >
                  <p
                    className={classnames([
                      'mb-2',
                      locationZone.id === selectedZoneId ? 'text-white' : 'text-primary'
                    ])}
                  >
                    <small><Trans i18nKey="zone" /> {locationZone.sequenceOrder}</small>
                  </p>
                  <h6 className="mb-1">{locationZone.type}</h6>
                  <h6 className="mb-0">{locationZone.label}</h6>
                </div>
              ))}
            </ScrollableList>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onClose}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button variant="primary" type="submit" disabled={selectedZoneId === locationZoneId} onClick={handleAssociate}>
            <Trans i18nKey="associate" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AssociateZoneModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAssociate: PropTypes.func.isRequired,
  show: PropTypes.bool,
  locationZoneId: PropTypes.number,
  isJob: PropTypes.bool
};

AssociateZoneModal.defaultProps = {
  show: false,
  locationZoneId: -1,
};

AssociateZoneModal.displayName = 'LocationDetailsAssociateZoneModal';
export default AssociateZoneModal;
