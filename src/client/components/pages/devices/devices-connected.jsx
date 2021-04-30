import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Button from 'react-bootstrap/Button';
import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import { useActionDispatch } from '../../../hooks';
import { getIOTObject } from '../../../redux/actions/object';
import * as URLS from '../../../urls';
const NOT_CONNECTED_IOT = 'notConnectedIOT';

const DevicesOverview = () => {
  const { t } = useTranslation();
  useTitle(t('Devices Overview'));
  const history = useHistory();

  const [connectedCount, setConnectedCount] = React.useState(null);
  const [registeredCount, setRegisteredCount] = React.useState(null);

  const getNotConnectedHW = useActionDispatch(getIOTObject(NOT_CONNECTED_IOT, undefined, 'user/devices'));

  const navigateTo = (type, count) => {
    if (!count) {
      //return;
    }
    if (type === 'connected') {
      history.push(URLS.DEVICES_CONNECTED);
    } else if (type === 'registered') {
      history.push(URLS.ACTIVATE('notconnected'));
    }
  };

  React.useEffect(() => {
    getNotConnectedHW().then((data = {}) => {
      setConnectedCount(data.activeDevices || 0);
      setRegisteredCount(data.registeredDevices || 0);
    });
  }, []);

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container pt-3">

          <div className="row justify-content-center">
            <div className="col-12">
              <div className="row mb-1">
                <div className="col-12">
                  <h3>Devices</h3>
                </div>
              </div>

              <Button
                className="add-task btn btn-primary rounded-circle text-white position-fixed"
                role="button"
                title="Add Device"
                onClick={() => history.push(URLS.ACTIVATE())}
              >
                <i className="far fa-plus" aria-hidden="true"></i>
                <span className="sr-only">Add Device</span>
              </Button>

              <div className="card">
                <div className="card-body p-0 p-0 text-center text-primary">
                  <div className="row">
                    <div className="col ml-3 px-3 pt-3 pb-1" onClick={() => navigateTo('registered', registeredCount)}>
                      <img src="../assets/img/devices-available.png" width="80" />
                      <p className="mt-1 mb-0 text-uppercase text-secondary"><small>Available Devices</small></p>
                      {registeredCount === null && <h4 className="display-3 mb-0"><strong><i className="fad fa-spinner-third fa-spin" aria-hidden="true" /></strong></h4>}
                      {registeredCount !== null  && <h4 className="display-3 mb-0"><strong>{registeredCount}</strong></h4>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-3">
                <div className="card-body p-0 p-0 text-center text-primary">
                  <div className="row">
                    <div className="col ml-3 px-3 pt-3 pb-1" onClick={() => navigateTo('connected', connectedCount)}>
                      <img src="../assets/img/devices-associated.png" width="80" />
                      <p className="mt-1 mb-0 text-uppercase text-secondary"><small>Devices connected to workspaces</small></p>
                      {connectedCount === null && <h4 className="display-3 mb-0"><strong><i className="fad fa-spinner-third fa-spin" aria-hidden="true" /></strong></h4>}
                      {connectedCount !== null && <h4 className="display-3 mb-0"><strong>{connectedCount}</strong></h4>}
                    </div>
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

DevicesOverview.displayName = 'DevicesOverview';
export default DevicesOverview;
