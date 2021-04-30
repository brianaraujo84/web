import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import Content from './content';

const NewTemplate = () => {
  const { t } = useTranslation();
  useTitle(t('Template Details'));

  const breadcrumbs = [
    { name: t('Templates'), to: '/templates' },
    { name: t('Create Template'), to: '#' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="content-wrapper">
        <div className='container'>
          <Content />
        </div>
      </div>
    </Layout>
  );
};

NewTemplate.displayName = 'NewTemplate';

export default NewTemplate;
