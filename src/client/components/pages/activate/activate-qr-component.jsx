import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import QrReader from 'react-qr-reader';
import QRCode from 'qrcode.react';

const ActivateQR = ({ activateDevice }) => {
  const [activeQRData, setActiveQRData] = React.useState(false);
  const [camera, setCamera] = React.useState('environment');
  const [error, setError] = React.useState(false);

  const onSubmit = async (values = {}) => {
    activateDevice(values.deviceId).then((data) => {
      if (data.errorCode) {
        setError(data.message);
      }
    });
  };

  const retry = () => {
    setError(false);
    setActiveQRData(false);
  };

  const flipCamera = () => {
    setCamera(camera === 'environment' ? 'user' : 'environment');
  };

  const onScan = (data) => {
    if (data && !activeQRData) {
      setActiveQRData(data);
      onSubmit({deviceId: data});
    }
  };
  const onError = () => {

  };

  return (
    <>
      <div id="qr-scanner">
        {activeQRData === false && <>
          <QrReader
            delay={300}
            onError={onError}
            onScan={onScan}
            facingMode={camera}/>
          <i className="text-primary fas fa-sync-alt" onClick={flipCamera} aria-hidden="true"></i>
        </>}
      </div>
      <div>
        {activeQRData && <>
          <QRCode value={activeQRData} />
          <p>{activeQRData}</p>
          {error && <>
            <p className="error-message">{error}</p>
            <Button
              variant="primary"
              className="mt-3"
              role="button"
              aria-expanded="true"
              onClick={retry}>
              <i className="far fa-camera" aria-hidden="true"></i> <Trans i18nKey="scan_code" defaults="Scan Code Again"/>
            </Button>
          </>}
        </>}
      </div>
    </>
  );
};


ActivateQR.propTypes = {
  activateDevice: PropTypes.func,
};
ActivateQR.defaultProps = {
  activateDevice: () => {},
};
ActivateQR.displayName = 'ActivateQR';
export default ActivateQR;
