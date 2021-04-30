import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import { useActionDispatch } from '../../../hooks';
import { getStandardObject, setObject } from '../../../redux/actions/object';

import Content from './content';

const OBJECT_TEMPLATE = 'template';

const TemplateDetails = () => {
  const { templateId } = useParams();
  const { t } = useTranslation();
  useTitle(t('Template Details'));

  const [resTaskCount, setResTaskCount] = React.useState('');
  const template = useSelector(state => state.template);

  const getReferenceTemplate = useActionDispatch(getStandardObject(undefined, undefined, 'template', '/reference'));
  const setTemplateData = useActionDispatch(setObject(OBJECT_TEMPLATE));

  const breadcrumbs = [
    { name: t('Templates'), to: '/templates' },
    { name: t(template?.data?.templateDetails?.templateName), to: '#' },
  ];

  const loadTemplate = async () => {
    if (templateId) {
      const data = await getReferenceTemplate(templateId);
      const taskCount = data.taskCount || '';
      setTemplateData(data);
      if (taskCount) {
        setResTaskCount(taskCount.toString());
      }
    }
  };

  React.useEffect(()=> {
    loadTemplate();
  }, [templateId]);

  if (!template || template.inprogress) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="content-wrapper bg-white breadcrumb-top">
          <div className='container pt-3'>
            <div className="row justify-content-center border-bottom">
              <div className="col-12 col-md-6">
                <div className="p-2 col">
                  <span className="ph-animate ph-text mb-1 mt-1"></span>
                  <span className="ph-animate ph-text ph-small mb-1"></span>
                  <span className="ph-animate ph-text ph-small mb-2"></span>
                  <span className="ph-animate ph-text mb-3"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="content-wrapper bg-white breadcrumb-top">
        <div className='container pt-3'>
          <Content template={template.data} getTemplates={loadTemplate} taskCount={resTaskCount} />
        </div>
      </div>
    </Layout>
  );
};

TemplateDetails.displayName = 'TemplateDetails';

export default TemplateDetails;
