import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import * as URLS from '../../../urls';
import ActivateManual from './activate-manual-component';
import DeviceFound from './device-found';


const ActivateScanning = ({ activateDevice, showDeviceFound }) => {
  const { t } = useTranslation();
  useTitle(t('ActivateScanning'));
  const history = useHistory();

  return (
    <Layout>
      <div className="container pb-4 bg-white content-wrapper">
        <div className="row row justify-content-center">
          <div className="col-11 col-md-6">
            <div className="text-center mt-4">
              <h1><Trans i18nKey="set_up_new_device" defaults="Set up new device"/></h1>
              <p className="my-3 lead">Turn to the back of your device to locate the QR code.</p>
              <img src="../assets/img/device-setup/01.png" height="260"/>
              <div className="clearfix"></div>
              <Button
                variant="primary"
                className="mt-3"
                role="button"
                aria-expanded="true"
                onClick={() => history.push(URLS.ACTIVATE('qrscan'))}>
                <i className="far fa-camera" aria-hidden="true"></i> Scan Code
              </Button>
            </div>

            <ActivateManual activateDevice={activateDevice}/>
            {showDeviceFound && <DeviceFound show={showDeviceFound} />}

          </div>
        </div>
      </div>
    </Layout>
  );
};

ActivateScanning.propTypes = {
  activateDevice: PropTypes.func,
  showDeviceFound: PropTypes.bool,
};
ActivateScanning.defaultProps = {
  activateDevice: () => {},
  showDeviceFound: false,
};
ActivateScanning.displayName = 'ActivateScanning';
export default ActivateScanning;
