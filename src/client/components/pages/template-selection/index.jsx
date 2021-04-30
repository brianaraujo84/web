import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Layout from '../../shared/layout';
import { useTitle, useActionDispatch } from '../../../hooks';
import Content from './content';
import { getPostStandardObjectsList } from '../../../redux/actions/objects';


const TemplateSelection = () => {
  const { t } = useTranslation();

  useTitle(t('select_template'));

  const locationType = useSelector(state => state.loc);
  const templatesList = useSelector(state => state.templates.items);


  const getTemplates = useActionDispatch(getPostStandardObjectsList('templates', 'templates', undefined, 'marketplace/template'));

  React.useEffect(() => {
    getTemplates({
      'templateType':'Reference',
      'locationType':locationType.data.locationType
    });
  }, []);

  return (
    <Layout nologin>
      <div className="content-wrapper">
        <div className="pb-4">
          <Content templatesList={templatesList} locationType={locationType} />
        </div>
      </div>
    </Layout>
  );
};

TemplateSelection.displayName = 'TemplateSelection';
export default TemplateSelection;
