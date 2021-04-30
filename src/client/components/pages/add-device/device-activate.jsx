import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useTitle } from '../../../hooks';
import Layout from '../../shared/layout';
import { getItem } from '../../../utils/storage-utils';
import { StorageKeys } from '../../../constants';

const DeviceActivate = () => {
  const { t } = useTranslation();
  useTitle(t('Device Activate'));

  const [passcode, setPasscode] = React.useState(0);

  const format = (s) => {
    return s.toString().padStart(9, '0').replace(/\d{3}(?=.)/g, '$& ');
  };

  React.useEffect(() => {
    setPasscode(getItem(StorageKeys.DEVICE_PASSCODE_KEY) || 0);
  }, []);

  return (
    <Layout>
      <div className="container pb-5 mt-5 pt-5">
        <div className="row text-center justify-content-center">
          <div className="col-12 col-md-6">
            <h1 className="mb-4">
              <Trans>Activation</Trans>
            </h1>
            <p className="lead">
              <Trans>Go to </Trans>
              <strong className="text-white py-1 px-2 bg-primary rounded">confidence.org/activate</strong>
              <Trans> on your device and enter the code below.</Trans>
            </p>
            <h2 className="my-4 d-block">
              <span className="rounded py-2 px-4 border text-monospace">
                {format(passcode)}
              </span>
            </h2>
          </div>
        </div>
      </div>
    </Layout>
  );
};

DeviceActivate.displayName = 'DeviceActivate';

export default DeviceActivate;
