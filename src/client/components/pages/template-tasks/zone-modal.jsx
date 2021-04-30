import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { classnames } from 'react-form-dynamic';

import ScrollableList from '../../shared/scrollable-list';

const ZoneModal = ({
  onClose,
  zoneTypeId,
  onAssociate,
  show,
  zoneTypes,
}) => {
  const [selectedZoneTypeId, setSelectedZoneTypeId] = React.useState(zoneTypeId);

  const handleAssociate = () => {
    onAssociate(selectedZoneTypeId);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered scrollable={true}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            <i className="text-info fad fa-clinic-medical" /> <Trans>Associate Zone</Trans>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div >
            <div className="list-group" id="zone-select">
              <ScrollableList>
                {
                  zoneTypes.map(({
                    zoneTypeId,
                    zoneType,
                  }) => {
                    return (
                      <div key={zoneTypeId}
                        className={classnames([
                          'zone list-group-item list-group-item-action px-2 d-flex justify-content-between align-items-center',
                          zoneTypeId === selectedZoneTypeId && 'active'
                        ])}
                        onClick={()=>setSelectedZoneTypeId(zoneTypeId)}
                      >
                        <div className="w-100 pl-2">
                          <h6 className="mb-0">{zoneType}</h6>
                        </div>
                      </div>
                    );
                  })
                }
              </ScrollableList>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            <Trans i18nKey="cancel" />
          </Button>
          <Button variant="primary" type="submit" style={{ minWidth: 72 }} onClick={handleAssociate}>
            <Trans i18nKey="Associate" />
          </Button>
        </Modal.Footer>
        {/* </form> */}
      </Modal>
    </>
  );
};

ZoneModal.propTypes = {
  // onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  // assignee: PropTypes.string,
  // assigneeUserName: PropTypes.string,
  show: PropTypes.bool,
  // isJob: PropTypes.bool,
  // isEdit: PropTypes.bool,
  zoneTypes: PropTypes.array,
  zoneTypeId: PropTypes.string,
  onAssociate: PropTypes.func
};

ZoneModal.defaultProps = {
  // isJob: false,
  show: false,
  // assignee: '',
  // assigneeUserName: '',
  zoneTypes: [],
};

ZoneModal.displayName = 'ZoneModal';
export default ZoneModal;
