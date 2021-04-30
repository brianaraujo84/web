import React from 'react';
import { useTranslation } from 'react-i18next';

import Content from './content';
import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

const AddLocation = () => {
  const { t } = useTranslation();
  useTitle(t('add_workspace'));


  return (
    <Layout>
      <div className="content-wrapper bg-white">
        <div className="container pt-3">
          <Content />
        </div>
      </div>
    </Layout>
  );
};

AddLocation.displayName = 'AddLocation';
export default AddLocation;
