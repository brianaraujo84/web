import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import { useActionDispatch } from '../../../hooks';
import { resetObject, getStandardObject } from '../../../redux/actions/object';

import Content from './content';

const OBJECT_LOCATION = 'location';

const OBJECT_TEMPLATE = 'template';

const TaskTemplate = () => {
  const { t } = useTranslation();
  useTitle(t('Templates'));

  const { templateId } = useParams();

  const [template, setTemplate] = React.useState({});

  const resetLocation = useActionDispatch(resetObject(OBJECT_LOCATION));

  const getReferenceTemplate = useActionDispatch(getStandardObject(OBJECT_TEMPLATE, undefined, 'template', '/reference'));

  React.useMemo( async () => {
    if (templateId) {
      const response = await getReferenceTemplate(templateId);
      setTemplate(response);
    }
  }, [templateId]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      resetLocation();
    };
  }, []);

  return (
    <Layout>
      <div className="content-wrapper">
        <Content template={template} />
      </div>
    </Layout>
  );
};

TaskTemplate.displayName = 'TaskTemplate';
export default TaskTemplate;
