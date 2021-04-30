import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Trans } from 'react-i18next';

import { useActionDispatch } from '../../../hooks';
import { postObject } from '../../../redux/actions/object';

import Header from './header';

const OBJECT_DEVICE = 'device';

const DeviceDetailsContent = () => {
  const { deviceId } = useParams();
  const history = useHistory();

  const [locationId, setLocationId] = React.useState('');
  const [lastUpdate, setLastUpdate] = React.useState('');

  const { deviceList, location } = useSelector(state => state.device.data);

  const getDevices = useActionDispatch(postObject(OBJECT_DEVICE, 'confidenceiot/v1/locations/devices'));

  React.useEffect(() => {
    if (history?.location?.state?.locationId) {
      setLocationId(history.location.state.locationId);
    }
  },[history]);

  React.useEffect(() => {
    if (locationId) {
      getDevices({ locationId });
    }
  },[locationId]);

  const device = React.useMemo(() => {
    if (deviceList) {
      return deviceList.find((item) => item.deviceUId === deviceId);
    }
  }, [deviceList, deviceId]);

  const fullAddress = React.useMemo(() => {
    if (location) {
      return `${location?.address?.addressLine1}, ${location?.address?.city}, ${location?.address?.state} ${location?.address?.zip}`;
    }
  }, [location]);

  return (
    <div>
      <div className="container pt-3">
        <div className="row justify-content-center">
          <div className="col-11 col-md-6">
            <Header deviceId={deviceId} setLastUpdate={setLastUpdate} />
          </div>
        </div>

        <hr className="my-0" />

        <div className="row justify-content-center py-3">
          <div className="col-12">
            <div className="row pt-1">
              <div className="col col-auto">
                {lastUpdate && <small className="d-block text-secondary">Last updated: {lastUpdate}</small>}
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center pt-3 pb-4 bg-light border-top border-bottom">
          <div className="col-12">
            <div className="row mb-3 pt-1">
              <div className="col">
                <h4 className="mt-1">Display
                  {/* <a href="#" className="mt-2 ml-1" data-toggle="modal" data-target="#device-details-modal" onClick={handleEditDevice}>
                    <small><i className="far fa-pencil-alt" aria-hidden="true" /> <span className="sr-only">Edit Device Details</span></small>
                  </a> */}
                </h4>
              </div>
            </div>
            <dl className="row mb-0">
              <dt className="col-3"><small className="text-secondary"><Trans>Template</Trans></small></dt>
              {device && <dd className="col-9">
                <Trans>{device.templateName}</Trans>
              </dd>}
              <dt className="col-3"><small className="text-secondary"><Trans>Space</Trans></small></dt>
              {location && <dd className="col-9">
                <p className="mb-0">{location.locationName} <span className="small text-secondary">{location.locationDetails}</span></p>
                <p className="mb-0"><small><Trans>{fullAddress}</Trans></small></p>
              </dd>}
              {/* <dt className="col-3"><small className="text-secondary">Zone</small></dt>
              <dd className="col-9">&nbsp;</dd> */}
              {device && device.placement && <dt className="col-3"><small className="text-secondary"><Trans>Placement</Trans></small></dt>}
              {device && device.placement && (
                <dd className="col-9 mb-0">
                  <p className="mb-0"><Trans>{device.placement}</Trans></p>
                </dd>
              )}
            </dl>
          </div>
        </div>

        <div className="row justify-content-center pt-3 pb-4">
          <div className="col-12">
            <div className="row mb-3 pt-1">
              <div className="col">
                <h4 className="mt-1">Device Details</h4>
              </div>
            </div>
            <dl className="row mb-0">
              <dt className="col-3"><small className="text-secondary">Device</small></dt>
              <dd className="col-9">Virtual Smart Display</dd>
              <dt className="col-3"><small className="text-secondary">URL</small></dt>
              <dd className="col-9 small text-break">
                <a href={`${window.location.origin}/tablet/virtual/${deviceId}`} target="_blank" rel="noreferrer">
                  {`${window.location.origin}/tablet/virtual/${deviceId}`}
                </a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

DeviceDetailsContent.displayName = 'DeviceDetailsContent';

export default DeviceDetailsContent;
