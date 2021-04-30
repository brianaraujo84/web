import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';

import Comments from './comments';
import CommentInput from './comment-input';
import Layout from '../../shared/layout';
import { postConfidenceObject } from '../../../redux/actions/object';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { useActionDispatch, useTitle } from '../../../hooks';
import TaskDetailsComment from './task-details-comments';
import Tooltip from '../../shared/tooltip';

const OBJECT_TASK_STATUS = 'taskStatus';
const OBJECT_CONTACTS = 'contacts';

const LocationComments = () => {
  const { t } = useTranslation();
  useTitle(t('Task Comments'));
  const { taskId, templateId, locationId } = useParams();
  
  const scrollToRef = React.useRef(null);

  const [task, setTask] = React.useState({});
  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(false);
  const [fileArray, setFileArray] = React.useState([]);

  const getTaskStatus = useActionDispatch(postConfidenceObject(OBJECT_TASK_STATUS, undefined, 'task/details'));
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));

  const getTask = async () => {
    const data = {
      taskId: taskId,
      templateId: templateId,
    };
    const response = await getTaskStatus(data);
    if (response.taskDetails) {
      setTask(response.taskDetails);
    }
  };

  const scrollToBottom = () => {
    scrollIntoView(scrollToRef.current, {
      block: 'end',
      behavior: 'auto'
    });
  };

  React.useMemo(() => {
    getTask();
    getContacts(locationId);
  },[]);

  React.useEffect(() => {
    Tooltip.show('task_comment_task_details', 'bottom');
  }, []);

  if (Object.keys(task).length === 0) {
    return (
      <div className="skeleton container">
        <div className="pt-3 bg-white">
          <div className="row justify-content-center border-bottom">
            <div className="col-12">
              <span className="ph-animate ph-text ph-small mb-2"></span>
              <span className="ph-animate ph-text ph-text-half mb-2"></span>
              <div className="mt-2 mb-3">
                <span className="ph-animate ph-text ph-title mb-2"></span>
                <span className="ph-animate ph-text mb-2"></span>
                <span className="ph-animate ph-text mb-2"></span>
              </div>
              <span className="ph-animate ph-text ph-text-half ph-small mb-2"></span>
              <span className="ph-animate ph-text ph-text-half mb-2"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Layout>
      <div className="content-wrapper bg-white">
        <div className="d-flex flex-column">
          <div className='container'>
            <div id="workspace-comments-header" className="py-2 fixed-top bg-light border-bottom">
              {task?.task && <div className="container d-flex align-items-center w-100 justify-content-between">
                <h6 className="mb-0 truncate-1">
                  <Trans >{task.task}</Trans>
                </h6>
                <a className={isDetailsExpanded ? 'small ml-4 text-secondary' : 'small ml-4 text-secondary collapsed'}
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} id="task-details-toggle" data-toggle="collapse" data-target="#task-page-details" aria-expanded="false" aria-controls="task-page-details"><i aria-hidden="true" className={isDetailsExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down task_comment_task_details'}></i> <span className="sr-only">Show Task Details</span></a>
              </div>}
            </div>
          </div>
          <TaskDetailsComment task={task} isDetailsExpanded={isDetailsExpanded} updateTaskInNonGrpJobTasks={getTask} />
          <div className={isDetailsExpanded ? 'task-comments d-flex flex-column details-expanded' : 'task-comments d-flex flex-column'}>
            <Comments scrollToBottom={scrollToBottom} taskId={taskId} isDetailsExpanded={isDetailsExpanded} setFileArray={setFileArray} fileArray={fileArray} />
            <CommentInput task={task} scrollToBottom={scrollToBottom} setFileArray={setFileArray} fileArray={fileArray} locationId={locationId} />
            <div ref={scrollToRef} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

LocationComments.displayName = 'Location Comments';
export default LocationComments;
