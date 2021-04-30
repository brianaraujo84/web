import React from 'react';
import { useParams } from 'react-router-dom';
import Content from './content';

import { _postObject } from '../../../services/services';

import './tablet.css';

function SanitizeTablet() {
  const [details, setDetails] = React.useState(null);

  const { deviceId } = useParams();

  const getDetails = React.useCallback(async () => {
    const uri = 'confidenceiot/v2/device/jobactivity';
    const data = await _postObject(uri, {
      fwVersion: '01.00.01',
      deviceId,
      isVirtual: true,
      state: 'refresh',
      battVolt: 3.3,
      rssi: -80,
    });
    setDetails(data);
  }, []);

  React.useEffect(() => {
    getDetails();
  }, [getDetails]);

  return details ? (
    <div>
      <div className="d-flex flex-column justify-content-between text-center badgeContainer" id="tablet-container">
        <div className="bg-black">
          <div className="container p-3 middleSection">
            <h1 className="badgeHeader text-light text-uppercase display-1">{details.hdrTxt || 'READY'}</h1>
          </div>
        </div>
        <Content details={details} />
      </div>
    </div>
  ) : null;
}

SanitizeTablet.displayName = 'SanitizeTablet';

export default SanitizeTablet;
