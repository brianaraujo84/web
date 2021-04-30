import React from 'react';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import Badge from './badge';
import { _postObject } from '../../../services/services';

const Header = ({ deviceId, setLastUpdate }) => {
  const [details, setDetails] = React.useState(null);

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

  return (
    <>
      <div className="text-center">
        <div className="row justify-content-center align-items-center" id="location-type-icon">
          <div className="tablet rounded">
            {details && <Badge details={details} setLastUpdate={setLastUpdate} />}
          </div>
        </div>
        <div className="d-inline-block text-white bg-primary rounded-pill py-1 px-3 mt-4">
          <Trans>Connected</Trans>
        </div>
        <h4 className="text-monospace my-3">{deviceId}</h4>
      </div>
    </>
  );
};

Header.propTypes = {
  deviceId: PropTypes.string.isRequired,
  setLastUpdate: PropTypes.func,
};

Header.displayName = 'DeviceDetailsHeader';

export default Header;
