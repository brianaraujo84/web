import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Layout from '../../shared/layout';
import DeviceCard from './device-card';
import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { postObject } from '../../../redux/actions/object';
import { typeIcon } from '../../../utils';

const OBJECT_DEVICE = 'device';

const DevicesList = () => {
  const { t } = useTranslation();
  const { locationId } = useParams();

  const { deviceList: devices = [], location } = useSelector(state => state.device.data);
  const { inprogress } = useSelector(state => state.device);

  const getDevices = useActionDispatch(postObject(OBJECT_DEVICE, 'confidenceiot/v1/locations/devices'));

  React.useEffect(() => {
    getDevices({ locationId });
  }, []);

  if (inprogress) {
    return (
      <div className="container mt-12 pb-4 w-75">
        <div style={{ textAlign: 'center', padding: 30 }}>
          <i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="bg-white pt-3">
          <div className="container pb-3">
            <div className="row justify-content-center">
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <div className="space-icon mr-2 border text-primary rounded-circle text-center bg-light">
                    <span aria-hidden="true"><i className={`fad ${typeIcon(location?.locationType)}`} aria-hidden="true"></i></span>
                  </div>
                  {location?.address && <div className="col px-0 w-100">
                    <h6 className="mb-0">{location.locationName} {location.locationDetails && <small className="text-secondary">({location.locationDetails})</small>}</h6>
                    <div className="pt-2">
                      <h4 className="mb-0">{location?.address?.addressLine1}</h4>
                      <small className="text-secondary d-block">{location?.address?.city}, {location?.address?.state}</small>
                    </div>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row py-3">
            <div className="col-12">
              <div className="row pt-1">
                <div className="col-6">
                  <h4 className="mt-1">
                    <Trans>Devices </Trans>
                    <small className="text-muted">({devices.length})</small>
                  </h4>
                </div>
                <div className="col-6 pl-0 text-right">
                  <Link to={() => URLS.ACTIVATE()} className="btn btn-primary" title={t('Add Device')}>
                    <i className="fas fa-plus" aria-hidden="true"></i> <span className="sr-only"><Trans>Add</Trans></span>
                  </Link>
                </div>
              </div>

              <div className="pb-4">
                <div className="row row justify-content-center">
                  <div className="col-12 col-md-6">
                    {devices.length > 0 ? (
                      <>
                        {devices.map((device) => (
                          <DeviceCard key={device.id} device={device} />
                        ))}
                      </>
                    ) : (
                      <>
                        <div className="text-center w-full mt-4">
                          <img className="mb-3" src="/assets/img/empty.png" alt={t('empty')} width="200" />
                          <p className="mb-0 text-secondary">
                            <em><Trans>You have no devices in this space.</Trans></em>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

DevicesList.displayName = 'DevicesList';

export default DevicesList;
