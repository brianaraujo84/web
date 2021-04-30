import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';

import * as URLS from '../../../urls';

const DeviceCard = ({ device }) => {
  const history = useHistory();

  const handleGotoDetails = () => {
    history.push(URLS.ACTIVATE('display', device.deviceId));
  };

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

  return (
    <>
      <div className="card mt-3" onClick={handleGotoDetails}>
        <div className="d-flex border-bottom align-items-center justify-content-end pr-2 py-2">
          <i className={`fad fa-signal-${getSignalNum(device.signalStrength)} text-primary`} aria-hidden="true"></i>
          <small className="mr-1 ml-2 text-secondary">{(!device.battery || parseInt(device.battery) < 0) ? '0' : parseInt(device.battery)}%</small>
          <i className={`fad fa-lg fa-battery-${getBatteryNum(device.battery)} text-primary`} aria-hidden="true"></i>
        </div>
        <div className="d-flex align-items-center px-3 pt-3 pb-2">
          <i className="fad fa-3x fa-tablet-android-alt mr-2" aria-hidden="true"></i>
          <div className="w-100">
            <p className="text-secondary mb-2"><Trans>{device.deviceName}</Trans></p>
            <h6 className="text-monospace">{device.deviceId}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

DeviceCard.propTypes = {
  device: PropTypes.object.isRequired,
};

DeviceCard.displayName = 'DeviceCard';

export default DeviceCard;
