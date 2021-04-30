import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { getIOTObject, postIOTObject } from '../../../redux/actions/object';
import { setItem } from '../../../utils/storage-utils';
const NOT_CONNECTED_IOT = 'notConnectedIOT';
const IOT_STORE = 'IOT_STORE';

const AddEquipmentModal = ({
  onClose,
  onUpdate,
  show,
  templateId,
  locationId,
}) => {

  const history = useHistory();

  const [devices, setDevices] = React.useState([]);
  const [currentHW, setCurrentHW] = React.useState(false);
  const [error, setError] = React.useState(false);

  const getNotConnectedHW = useActionDispatch(getIOTObject(NOT_CONNECTED_IOT, undefined, 'user/devices'));
  const associateHW = useActionDispatch(postIOTObject(NOT_CONNECTED_IOT, undefined, 'device/registration'));

  const onSubmit = () => {
    const data = { templateId, locationId, deviceId: currentHW, virtualDevice: false };
    onUpdate(data);
    setError(false);
    associateHW(data).then(() => {
      setItem(IOT_STORE, currentHW);
      history.push(URLS.ACTIVATE('gstep1'));
      onClose();
    }, (e = {}) => {
      const errorMsg = e.data && e.data.message || 'Unable to Associate the Device';
      setError(errorMsg);
    });
  };

  const handleSelect = (device) => {
    setCurrentHW(device.deviceId);
  };

  const handleOnClose = () => {
    onClose();
  };

  const filterDevices = (devices = []) => {
    return devices.filter(d => {
      const s = d.deviceStatus && d.deviceStatus.toLowerCase();
      return s === 'registered' || s === 'active';
    });
  };

  React.useEffect(() => {
    getNotConnectedHW().then((data = {}) => {
      const d = data.devices || [];
      setDevices(d);
    });
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleOnClose} centered scrollable={true}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-primary fa fa-tablet-android-alt" aria-hidden="true"/> <Trans i18nKey="associate_device_grp" defaults="Associate Device to Group"/>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="suggestions">
              {devices && filterDevices(devices).length > 0 && <h6 className="text-secondary">Available Devices</h6>}
              <div className="list-group">
                {devices && filterDevices(devices).map((device,idx) => {
                  return (<div key={idx} onClick={() => handleSelect(device)} className={`list-group-item suggestion list-group-item-action px-2 d-flex justify-content-between align-items-center ${currentHW === device.deviceId && '.bg-primary .text-white active'}`}>
                    <i className="text-secondary fa-2x fa fa-tablet-android-alt mr-2" aria-hidden="true"></i>
                    <div className="w-100">
                      <h6 className="mb-0 name">{device.deviceName}</h6>
                      <p className="mb-0 phone-number"><small>{device.deviceId}</small></p>
                    </div>
                  </div>);
                })}
              </div>
              {error && <p className="error-message">{error}</p>}

              <div>
                <h6 className="text-center my-3 text-secondary">Add new device</h6>
                <div className="row">
                  <div className="col pr-0">
                    <button className="btn-block btn btn-primary" onClick={() => history.push(URLS.ACTIVATE())}>I have a device</button>
                  </div>
                  <div className="col">
                    <button className="btn-block btn btn-outline-secondary" disabled>Buy a device</button>
                  </div>
                </div>
                <p className="text-center mt-3 mb-0">
                  <a role="button" className="text-primary" onClick={() => history.push(URLS.ADD_DEVICE, {locationId, templateId})}>Add a virtual smart display</a>
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleOnClose}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button variant="primary" onClick={onSubmit} disabled={!currentHW} style={{ minWidth: 72 }}>
              <Trans i18nKey="associate" defaults="Associate"/>
            </Button>

          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

AddEquipmentModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  templateId: PropTypes.string,
  locationId: PropTypes.string,
};

AddEquipmentModal.defaultProps = {
  onUpdate: () => {},
  onClose: () => {},
};

AddEquipmentModal.displayName = 'LocationDetailsAddEquipmentModal';
export default AddEquipmentModal;
