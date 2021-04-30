import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useActionDispatch } from '../../../hooks';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { getStandardObject } from '../../../redux/actions/object';
import Layout from '../../shared/layout';
import Content from './Content';

const OBJECT_TEMPLATE = 'template';

const TemplateTasks = () => {
  const { t } = useTranslation();
  const { templateId } = useParams();

  const getZones = useActionDispatch(getStandardObjectsList('zoneTypes', 'zoneTypes', undefined, 'zones', undefined));
  const getReferenceTemplate = useActionDispatch(getStandardObject(OBJECT_TEMPLATE, undefined, 'template', '/reference'));

  const [shouldScrollToNewTask, setShouldScrollToNewTask] = React.useState(false);

  const zoneTypes = useSelector(state => state.zoneTypes.items);
  const template = useSelector(state => state.template);

  const loadTemplate = async (scrollToNewTask) => {
    if (templateId) {
      await getReferenceTemplate(templateId);
      if (scrollToNewTask) { setShouldScrollToNewTask(true); }
    }
  };

  React.useEffect(() => {
    loadTemplate();
  },[templateId]);

  React.useMemo(() => {
    if (template && template.data && template.data.templateDetails && template.data.templateDetails.locationType) {
      getZones(template.data.templateDetails.locationType);
    }
  },[template.data]);

  const breadcrumbs = [
    { name: t('Templates'), to: '/templates' },
    { name: t(template.data.referenceTemplateName), to: `/templates/${templateId}` },
    { name: t('tasks')},
  ];

  if (!template || !template.data || !template.data.referenceTemplateName) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="content-wrapper">
          <div className="container mt-3">
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
        <Content
          template={template.data}
          templateId={templateId}
          data={template.data.zones}
          updateTasks={loadTemplate}
          zoneTypes={zoneTypes}
          shouldScrollToNewTask={shouldScrollToNewTask}
          setShouldScrollToNewTask={setShouldScrollToNewTask}
        />
      </div>
    </Layout>
  );
};

TemplateTasks.propTypes = {
};

TemplateTasks.displayName = 'TemplateTasks';

export default TemplateTasks;
