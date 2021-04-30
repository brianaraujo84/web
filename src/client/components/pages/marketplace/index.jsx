import React from 'react';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import Content from './content';
import { useActionDispatch } from '../../../hooks';
import { getPostStandardObjectsList, getStandardObjectsList } from '../../../redux/actions/objects';

const OBJECT_MY_TEMPLATES = 'myTemplates';

const Marketplace = () => {
  const { t } = useTranslation();
  useTitle(t('marketplace'));

  const getTemplates = useActionDispatch(getPostStandardObjectsList('templates', 'templates', undefined, 'marketplace/template'));
  const getMyTemplates = useActionDispatch(getStandardObjectsList(OBJECT_MY_TEMPLATES, 'templateList', undefined, 'templates/purchasedtemplates'));

  React.useEffect(()=> {
    getTemplates({'templateType':'Reference'});
    getMyTemplates();
  }, []);

  return (
    <Layout>
      <div className="content-wrapper">
        <Content />
      </div>
    </Layout>
  );
};

Marketplace.displayName = 'Marketplace';
export default Marketplace;
