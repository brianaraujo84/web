import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import ActivateManual from './activate-manual-component';
import ActivateQR from './activate-qr-component';
import DeviceFound from './device-found';
import DeviceHelpModal from './device-help-modal';


const ActivateQAScanning = ({ activateDevice, showDeviceFound }) => {
  const { t } = useTranslation();
  useTitle(t('ActivateQAScanning'));
  const [helpModal, setHelpModal] = React.useState(false);

  return (
    <Layout>
      <div className="container pb-4 bg-white content-wrapper">
        <div className="row row justify-content-center">
          <div className="col-11 col-md-6">
            <div className="text-center mt-4">
              <h1>Scan QR code</h1>
              <p className="my-3 lead">Make sure the code is steady and well lit. Hold your camera 12 inches away, and then <span data-toggle="modal" data-target="#device-already-registered">bring</span> it <span data-toggle="modal" data-target="#device-unauthorized">closer</span>.</p>
              <ActivateQR activateDevice={activateDevice}/>
            </div>
            <div className="text-center mt-3">
              <p className="mb-2"><Trans i18nKey="scanner_not_working" defaults="Scanner not working?"/></p>
              <ActivateManual activateDevice={activateDevice} hideText/>
              <hr />
              <a className="text-primary" onClick={() => setHelpModal(true)}>
                <i className="far fa-question-circle" aria-hidden="true"></i> Help me find the QR code
              </a>
            </div>
          </div>
        </div>
      </div>
      {showDeviceFound && <DeviceFound show={showDeviceFound} />}
      {helpModal && <DeviceHelpModal show={helpModal} onClose={() => setHelpModal(false)}/>}
    </Layout>
  );
};

ActivateQAScanning.propTypes = {
  activateDevice: PropTypes.func,
  showDeviceFound: PropTypes.bool,
};
ActivateQAScanning.defaultProps = {
  activateDevice: () => {},
  showDeviceFound: false,
};
ActivateQAScanning.displayName = 'ActivateQAScanning';
export default ActivateQAScanning;
