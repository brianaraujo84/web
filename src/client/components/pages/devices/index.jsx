import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import Content from './content';

const Devices = () => {
  const { t } = useTranslation();
  useTitle(t('My Devices'));

  return (
    <Layout>
      <div className="content-wrapper">
        <Content />
      </div>
    </Layout>
  );
};

Devices.displayName = 'Devices';
export default Devices;
