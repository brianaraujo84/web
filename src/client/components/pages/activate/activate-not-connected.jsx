import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { useActionDispatch } from '../../../hooks';
import { getIOTObject } from '../../../redux/actions/object';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';
const NOT_CONNECTED_IOT = 'notConnectedIOT';


const ActivateNotConnected = ({ setDevice }) => {
  const { t } = useTranslation();
  useTitle(t('ActivateNotConnected'));
  const [devices, setDevices] = React.useState([]);
  const history = useHistory();
  const getNotConnectedHW = useActionDispatch(getIOTObject(NOT_CONNECTED_IOT, undefined, 'user/devices'));

  React.useEffect(() => {
    getNotConnectedHW().then((data = {}) => {
      const d = data.devices || [];
      setDevices(d);
    });
  }, []);

  const getNumInQuarters = (num) => {
    if (!num || (num && num < 0)) {
      return 0;
    }
    num = parseInt(num);
    if (num > 0 && num <= 25) {
      return 1;
    } else if (num > 25 && num <= 50) {
      return 2;
    } else if (num > 50 && num <= 75) {
      return 3;
    } else {
      return 4;
    }
  };
  const getBatteryNum = (num) => {
    const n = getNumInQuarters(num);
    return n === 4 ? 'full' : n === 3 ? 'three-quarters' : n === 2 ? 'half' : n === 1 ? 'quarter' : 'empty';
  };

  const getSignalNum = (num) => {
    const n = getNumInQuarters(num);
    return n === 4 ? 'alt' : n === 3 ? 'alt-3' : n === 2 ? 'alt-2' : n === 1 ? 'alt-1' : 'slash';
  };

  const onAssociateSpace = (deviceId) => {
    setDevice(deviceId);
    history.push(URLS.ACTIVATE('locations'));
  };

  return (
    <Layout>
      <div className="container pb-4 content-wrapper">
        <div className="row row justify-content-center mt-3">
          <div className="col-12 col-md-6">
            <div className="row mt-2 mb-1">
              <div className="col-10">
                <h3 className="mt-1"><Trans i18nKey="devices" defaults="Devices"/></h3>
              </div>
              <div className="col-2 text-right">
                <Button
                  className="text-white"
                  variant="primary"
                  role="button"
                  onClick={() => history.push(URLS.ACTIVATE())}
                  title="Add Device">
                  <i className="fas fa-plus" aria-hidden="true"></i> <span className="sr-only">Add Device</span>
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <p className="lead mb-0">Devices available (not connected to workspaces).</p>
              <div className="row row justify-content-center">
                <div className="col-12">
                  {devices && devices.map((device,idx) => {
                    return (<div className="card mt-3" key={idx}>
                      <div className="d-flex border-bottom align-items-center justify-content-end pr-2 py-2">
                        <i className={`fad fa-signal-${getSignalNum(device.signalStrength)} text-primary`} aria-hidden="true"></i>
                        <small className="mr-1 ml-2 text-secondary">{parseInt(device.battery) < 0 ? '0' : parseInt(device.battery)}%</small>
                        <i className={`fad fa-lg fa-battery-${getBatteryNum(device.battery)} text-primary`} aria-hidden="true"></i>
                      </div>
                      <div className="d-flex align-items-center px-3 pt-3 pb-2">
                        <i className="fad fa-3x fa-tablet-android-alt mr-2" aria-hidden="true"></i>
                        <div className="w-100">
                          <p className="text-secondary mb-2">{device.deviceName}</p>
                          <h6 className="text-monospace">{device.deviceId}</h6>
                        </div>
                      </div>
                      <div className="px-3 pb-3">
                        <Button
                          variant="outline-primary"
                          block
                          disabled={device.deviceStatus !== 'register' && device.deviceStatus !== 'active'}
                          onClick={() => onAssociateSpace(device.deviceId)}
                        >
                          Associate with Workspace
                        </Button>
                      </div>
                    </div>);
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateNotConnected.propTypes = {
  setDevice: PropTypes.func,
};

ActivateNotConnected.defaultProps = {
  setDevice: () => {},
};

ActivateNotConnected.displayName = 'ActivateNotConnected';
export default ActivateNotConnected;
