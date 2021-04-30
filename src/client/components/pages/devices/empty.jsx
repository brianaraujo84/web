import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import * as URLS from '../../../urls';

const Empty = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="container pb-4">
        <div className="row row justify-content-center">
          <div className="col-11 col-md-6">
            <h1 className="text-center mb-4 mt-5">
              <Trans i18nKey="devices" />
            </h1>
            <p className="lead text-center">
              <Trans>Devices make your space more connected and deliver peace of mind.</Trans>
            </p>
            <img src="../assets/img/device-outline.png" className="w-100"/>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="row justify-content-center pt-3 pb-2 border-top">
          <div className="col-12">
            <h4 className="text-center mb-4 mt-4">
              <Trans>Add new device</Trans>
            </h4>
            <div className="row">
              <div className="col pr-0">
                <Button className="py-3" variant="primary" block disabled>
                  <Trans>I have a device</Trans>
                </Button>
              </div>
              <div className="col">
                <Button className="py-3" variant="outline-secondary" block disabled>
                  <Trans>Buy a device</Trans>
                </Button>
              </div>
            </div>
            <p className="text-center mt-4">
              <Link
                className="pointer-events-none text-secondary disabled"
                to={{
                  pathname: URLS.DEVICE_CONFIGURE,
                  data: { virtualDevice: true },
                }}
                title={t('Add virtual device')}
              >
                <Trans>Add a virtual smart display</Trans>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

Empty.displayName = 'DeviceEmpty';

export default Empty;
