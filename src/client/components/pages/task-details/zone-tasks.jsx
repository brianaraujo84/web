import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { useActionDispatch } from '../../../hooks';
import JobTaskCard from './job-task-card';
import WorkerJobTaskCard from './worker-job-task-card';
import * as URLS from '../../../urls';
import { TaskStatus } from '../../../constants';
import NewTask from '../location-details/new-task';
import { addToast } from '../../../redux/actions/toasts';
import { toBase64Array, TextUtils } from '../../../utils';
import { postConfidenceObject, resetObject, setObject } from '../../../redux/actions/object';
import { uploadTaskImages } from '../../../redux/actions/files';
import { _getObject } from '../../../services/services';

const OBJECT_TEMPLATE_TASKS = 'templateTasks';
const OBJECT_TEMPLATE = 'template';

const ZoneTasks = ({ taskSummary, isLoading, updateTemplateData, isOwnerOrManager }) => {
  const { t } = useTranslation();
  const { locationId, taskTemplateId, tm } = useParams();
  const { data = {}, search = '' } = useLocation();
  const { jaId } = TextUtils.getQueryParams(search);
  const { isFirstTime = false } = data;

  const [showNewTask, setShowNewTask] = React.useState(false);
  const [templateImageObj, setTemplateImageObj] = React.useState(null);
  const [initLoading, setInitLoading] = React.useState(true);

  const getTaskTemplateInfo = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE_TASKS, undefined, `template/${taskTemplateId}`, '/details'));
  const toast = useActionDispatch(addToast);
  const cloneTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const uploadImages = useActionDispatch(uploadTaskImages);
  //const getCompletedTemplateGroupData = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE_TASKS, undefined, `template/${taskTemplateId}`, '/details'));

  const templateTasksInfo = useSelector(state => state.templateTasks.data);
  const resetTasksInfo = useActionDispatch(resetObject(OBJECT_TEMPLATE_TASKS));
  const setTasksInfo = useActionDispatch(setObject(OBJECT_TEMPLATE_TASKS));

  const updateTasksInfo = (targetTask, status) => {
    if (status === 'update_all') {
      setTasksInfo(targetTask);
    } else {
      templateTasksInfo.zones.map((zone) => {
        zone.tasks && zone.tasks.map((task) => {
          if (targetTask.taskId === task.taskId) {
            if (status) {
              task.stage = status;
            }
            if (targetTask.taskActivityTrackerId) {
              task.taskActivityTrackerId = targetTask.taskActivityTrackerId;
            }
          }
        });
      });
      setTasksInfo({ ...templateTasksInfo });
    }
  };

  const getTasksCount = (zones = []) => {
    const tasksCount = zones.reduce((count, zone) => {
      count += zone.tasks.length;
      return count;
    }, 0);
    return tasksCount;
  };

  const handleAddAndUpdateTask = async (task, type) => {
    setShowNewTask(false);

    const data = {
      locationId,
      templateId: taskTemplateId,
      templateName: templateTasksInfo.templateName,
      custom: false,
      task: {
        taskId: task.taskId,
        taskName: task.title,
        taskDescription: task.taskDescription,
        sequeceOrder: 1,
        zoneTypeId: task.locationZoneTypeId,
      }
    };

    try {
      const { taskId } = await cloneTemplate(data);
      const { photos } = task;
      if (photos && photos.length) {
        const values = await toBase64Array(photos);
        const files = values.reduce((acc, cur) => {
          acc.push(cur.value);
          return acc;
        }, []);

        await uploadImages(files, taskId, 'adhoc');
      }
      getTaskTemplateInfo();
      toast(type ? t(`Task ${type} updated`) : t('Task Added.'));
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  const handleDeleteTask = async (task) => {
    const data = {
      locationId,
      templateId: taskTemplateId,
      templateName: templateTasksInfo.templateName,
      custom: false,
      task: {
        taskId: task.taskId,
        action: 'Remove'
      }
    };

    try {
      await cloneTemplate(data);
      getTaskTemplateInfo();
      toast(t('Task Deleted.'));
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  const { workingOnTaskId, isLastTaskOfJob } = React.useMemo(() => {
    let workingOnTaskId = 0;
    const zones = templateTasksInfo.zones || [];
    const allZonesTasks = zones.reduce((acc, zone) => {
      const tasks = zone.tasks || [];
      return acc.concat(tasks);
    }, []);

    let completedTasksCount = 0, isLastTaskOfJob = false;

    allZonesTasks.forEach((task) => {
      if (task.stage && TaskStatus.inProgress === task.stage.toLowerCase()) {
        workingOnTaskId = task.taskId;
      }
      if (task.stage && [TaskStatus.review, TaskStatus.completed].indexOf(task.stage.toLowerCase()) > -1) {
        completedTasksCount++;
      }
    });

    if (completedTasksCount === allZonesTasks.length - 1) {
      isLastTaskOfJob = true;
    }

    return { workingOnTaskId, isLastTaskOfJob };
  }, [templateTasksInfo]);

  const loadTemplateImage = async () => {
    const response = await _getObject(`v1/confidence/template/${taskSummary.templateId}/reference`);
    setTemplateImageObj(response);
  };

  const numberOfTasks = React.useMemo(() => {
    return templateTasksInfo.zones && templateTasksInfo.zones.reduce((total, zone) => {
      return total + (zone.tasks || []).length;
    }, 0);
  }, [templateTasksInfo.zones]);

  React.useEffect(() => {
    getTaskTemplateInfo({ jobActivityId: taskSummary.jobActivityId || jaId }).then((data) => {
      updateTemplateData({
        ...data,
        // jobManager: ''
      });
      setInitLoading(false);
    });
    return resetTasksInfo;
  }, [taskTemplateId]);

  React.useEffect(() => {
    if (taskSummary.templateId && taskSummary.referenceTemplateName) {
      loadTemplateImage();
    }
  }, [taskSummary]);

  const loading = useSelector(state => {
    return !state.templateTasks || state.templateTasks.initialLoading
      || !state.locationZones || state.locationZones.initialLoading;
  }) || isLoading;

  if (initLoading || loading || !templateTasksInfo) {
    return (
      <div className="container bg-light border-top">
        <div className="row justify-content-center pt-3 pb-5 bg-light" id="tasks">
          <div className="col-12">

            <div className="mb-3">
              <div className="d-flex">
                <div className="px-0">
                  <h4 className="mt-1"><Trans>Tasks </Trans></h4>
                </div>
              </div>
            </div>

            <span className="ph-animate ph-small ph-text mb-2"></span>

            <div className="ph-animate ph-task rounded">
              <div className="p-2 col">
                <span className="ph-text ph-title mb-2"></span>
                <span className="ph-text ph-small"></span>
                <div className="text-right mt-2">
                  <span className="skeleton ph-button mb-0 d-inline-block rounded ml-2"></span>
                  <span className="skeleton ph-button mb-0 d-inline-block rounded ml-2"></span>
                  <span className="skeleton ph-button mb-0 d-inline-block rounded ml-2"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="">
        <div className="container">
          <div className="row justify-content-center pt-3 bg-light">
            <div className='col-12'>
              <div className='mb-3'>
                <div className='d-flex'>
                  <div className='px-0'>
                    <h4 className="mt-1"><Trans i18nKey="tasks" />{'  '}
                      {(templateTasksInfo && templateTasksInfo.zones !== undefined) && <small className="text-muted">({getTasksCount(templateTasksInfo.zones)})</small>}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showNewTask &&
        <NewTask
          onDelete={() => setShowNewTask(false)}
          onUpdate={handleAddAndUpdateTask}
          isCustomTaskOfJob={true}
        />
      }

      {!initLoading && !numberOfTasks && !showNewTask && (
        <div id="zero-tasks" data-target="no-task-description">
          <div className="row mb-3 pt-1">
            <div className="col text-center">
              <img className="mb-3" src="/assets/img/empty.png" alt={t('empty')} width="200" />
              <p className="mb-0 text-secondary">
                <em><Trans i18nKey="no_tasks_text" /></em>
              </p>
            </div>
          </div>
        </div>
      )}

      {templateTasksInfo.zones && templateTasksInfo.zones.map((zone, idx) => {
        return (
          <div key={idx} className='container pt-0'>
            <div className='row justify-content-center pb-2 bg-light'>
              <div className='col-12'>
                <h6><Trans>{zone.type} </Trans> {zone.label && <small className="text-muted">— {zone.label}</small>}</h6>
                {zone.tasks && zone.tasks.map((task, taskIdx) => (
                  <div key={taskIdx}>
                    {
                      isOwnerOrManager && !tm ?
                        <JobTaskCard
                          taskIdx={taskIdx}
                          task={task}
                          onDelete={handleDeleteTask}
                          taskSummary={taskSummary}
                          templateImageObj={templateImageObj}
                          showFirstTask={isFirstTime && taskIdx === 0 && idx === 0}
                        />
                        :
                        <WorkerJobTaskCard
                          taskIdx={taskIdx}
                          workingOnTaskId={workingOnTaskId}
                          task={{
                            ...task,
                            nextOccurrenceDate: templateTasksInfo.nextOccurrenceDate,
                          }}
                          previousTask={taskIdx > 0 ? zone.tasks[taskIdx - 1] : (idx > 0 ? templateTasksInfo.zones[idx - 1].tasks[templateTasksInfo.zones[idx - 1].tasks.length - 1] : undefined)}
                          locationZoneId={zone.locationZoneId}
                          isLastTaskOfJob={isLastTaskOfJob}
                          taskSummary={taskSummary}
                          templateImageObj={templateImageObj}
                          associatedZone={zone}
                          updateTasksInfo={updateTasksInfo}
                        />
                    }
                  </div>)
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

ZoneTasks.propTypes = {
  taskSummary: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  locationUserRole: PropTypes.string,
  updateTemplateData: PropTypes.func,
  isOwnerOrManager: PropTypes.bool,
  updateTaskInNonGrpJobTasks: PropTypes.func
};
ZoneTasks.defaultProps = {
  taskSummary: {},
  updateTemplateData: () => {},
};

ZoneTasks.displayName = 'ZoneTasks';
export default ZoneTasks;
