import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import Content from './content';


const DeviceDetails = () => {
  const { t } = useTranslation();
  useTitle(t('Device Details'));

  return (
    <Layout>
      <div className="content-wrapper">
        <Content />
      </div>
    </Layout>
  );
};

DeviceDetails.displayName = 'DeviceDetails';

export default DeviceDetails;
