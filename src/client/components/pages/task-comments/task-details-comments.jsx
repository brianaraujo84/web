import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { DateUtils } from '../../../utils';
import { formatTaskRecurringType } from '../../../lib/task';

import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject } from '../../../redux/actions/object';
import * as URLS from '../../../urls';
import { getTaskImages, getJobActivityImages, getFilePathFromDbx } from '../../../redux/actions/files';
import TaskImages from '../location-details/task-images';
import { TaskStatus } from '../../../constants';
import TaskImage from '../../shared/task-image';

const OBJECT_TASK_LINK = 'task';

const TaskDetailsComment = ({ task, isDetailsExpanded, updateTaskInNonGrpJobTasks }) => {
  const { t } = useTranslation();
  const [taskLinkData, setTaskLinkData] = React.useState({});
  const [taskLinkJAData, setTaskLinkJAData] = React.useState({});
  const [taskFilePath, setTaskFilePath] = React.useState(false);
  const [taskFileJAPath, setTaskFileJAPath] = React.useState(false);
  const [isLinkChecked, setIsLinkChecked] = React.useState(false);
  const [isFilePathChecked, setIsFilePathChecked] = React.useState(false);
  const [imageRequired, setImageRequired] = React.useState(0);
  const [backUpImages, setbackUpImages] = React.useState({});

  const getTaskImagesList = useActionDispatch(getTaskImages);
  const getLinks = useActionDispatch(postConfidenceObject(OBJECT_TASK_LINK, undefined, 'task/links/list'));
  const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);
  const taskActivityImages = useSelector(state => (
    state.files.activityList && state.files.activityList[task.jobActivityId]
      && state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] ? state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] : []
  ));
  const profile = useSelector(state => state.profile.data);
  const activityList = useSelector(state => state?.files?.activityList);

  const taskType = isJob ? 'predefined' : 'adhoc';

  const isJob = React.useMemo(() => {
    return task.templateType && task.groupCard && ('main' === task.templateType.toLowerCase() || 'custom' === task.templateType.toLowerCase());
  }, [task.templateType]);

  const isInProgressTask = React.useMemo(() => {
    return task.stage && TaskStatus.inProgress === task.stage.toLowerCase();
  }, [task.stage]);

  const getQualifiedLink = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const loadOnExpandDetails = () => {
    !isLinkChecked && (getTaskLink().then(() => setIsLinkChecked(true)));
    !isFilePathChecked && (getTaskFilePath(task.taskId).then(() => setIsFilePathChecked(true)));
  };

  const checkFiles = () => {
    setIsLinkChecked(true);
    if (!isFilePathChecked) {
      getTaskFilePath(task.taskId, loadImages);
      setIsFilePathChecked(true);
    }
  };

  const getTaskFilePath = (taskId, next) => {
    const path = preparePaths(taskId);
    return getFilePathFromDbx(path.folderName, task.jobActivityId).then(file => {
      if (file.isFileExist || file.isFileActivityExist) {
        setTaskFilePath(file.link);
        setTaskFileJAPath(file.jobActivityLink);
      } else if (next) {
        next();
      }
    });
  };

  const taskImages = useSelector(state => {
    const taskId = task?.stage?.toLowerCase() === TaskStatus.copy ? task.orginalTaskId : task.taskId;
    return state.files.list && state.files.list[taskType] && state.files.list[taskType][taskId] ? state.files.list[taskType][taskId] : [];
  });

  const taskImagesLoaded = useSelector(state => (
    !!state.files.list && !!state.files.list[taskType] && !!state.files.list[taskType][task.taskId]
  ));

  const preparePaths = (taskId, fileType, fileNameStr, isActivity) => {
    const folderName = isActivity ? `${task.taskId}-adhoc-${task.jobActivityId}` : `${task.taskId}-adhoc`;
    const fileName = `${fileNameStr || task.taskId}${fileType ? '.' + fileType : ''}`;
    const fullPath = `task-files/${folderName}/${fileName}`;
    return {folderName, fileName, fullPath};
  };

  const getTaskLink = (next) => {
    const data = {
      taskId: task.taskId,
      jobActivityId: task.jobActivityId,
      taskActivityTrackerId: task.taskActivityTrackerId,
    };
    return getLinks(data).then(data => {
      if((data.taskLinks && data.taskLinks.length > 0) || (data.taskActivityLinks && data.taskActivityLinks.length > 0)) {
        const l = data.taskLinks[0] || {};
        setTaskLinkData({ taskLink: l.link, taskLinkText: l.tag, taskLinkId: l.taskLinkId });

        const al = data.taskActivityLinks[0] || {};
        setTaskLinkJAData({ taskLink: al.link, taskLinkText: al.tag, taskLinkId: al.taskLinkId });
      } else if (next) {
        next();
      }
    });
  };

  const loadImages = React.useCallback(async () => {
    await getTaskImagesList(task.taskId, taskType);
    if (task.jobActivityId && task.taskActivityTrackerId) {
      await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
    }
  }, [task, taskType]);

  React.useEffect(() => {
    if (activityList && activityList[task.jobActivityId] && activityList[task.jobActivityId][task.taskActivityTrackerId]) {
      setbackUpImages(activityList[task.jobActivityId][task.taskActivityTrackerId]);
    }
  },[activityList]);

  React.useEffect(() => {
    getTaskLink();
    checkFiles();
    if (!taskImagesLoaded) {
      loadImages();
    }
    loadOnExpandDetails();
    setImageRequired(task.imageRequired || 0);
  },[]);

  return (
    <div className={isDetailsExpanded ? 'task show' : 'task collapse'} id="task-page-details">
      <div className="container pt-3">
        <p className="mb-2">
          {task.stage && <span className="badge border-primary border text-primary">{t(`${task.stage}`)}</span>}&nbsp;
          {task.priority && <span className="badge text-orange"><i className="fas fa-flag" aria-hidden="true"></i>&nbsp;{task.priority}</span>}
        </p>
        {task.task && <h5 className="mb-1" >{t(task.task)}</h5>}
        {task.assignee && <div className="d-flex small mt-2 mb-2">
          <span className="mr-1"><i className="fas fa-user mt-1 lineitem-icon" aria-hidden="true"></i><Trans i18nKey="assigned_to" /></span>&nbsp;
          <a href="#"><img className="rounded-circle border border-primary" src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)} style={{ width: '25px' }} />&nbsp;{task.assignee}</a>
        </div>}

        {task?.taskRecurring?.nextOccurrenceDate && <div className="d-flex small mt-2 mb-1">
          <span><i className="far fa-calendar-alt lineitem-icon" aria-hidden="true"></i></span>
          <span>{'  '}{DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}</span>&nbsp;
          <span>{formatTaskRecurringType(task) !== undefined && task.taskRecurring.nextOccurrenceDate !== 'OneTime' && (
            <>{'  |  '}<i className="fas fa-repeat-alt" aria-hidden="true"></i>&nbsp;
              {t(formatTaskRecurringType(task))}</>)}</span>
        </div>}

        {task?.dueDate && <div className="d-flex mb-2">
          <div>
            <div className="d-flex small mt-2 mb-1">
              <span><i className="ci ci-due-f lineitem-icon-custom"></i></span>
              {DateUtils.unicodeFormat(DateUtils.parseISO(task.dueDate), 'P')}
              {task.dueDate && DateUtils.isAfter(DateUtils.parseISO(DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd')), DateUtils.parseISO(task.dueDate)) && <span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Overdue</span>}
            </div>
          </div>
        </div>}

        {taskLinkData.taskLink && <div className="d-flex small mt-1 mb-1 align-items-center">
          <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">External link</span></span>
          <a rel="noreferrer" href={getQualifiedLink(taskLinkData.taskLink)} target="_blank" className="truncate-1">{taskLinkData.taskLinkText}</a>
        </div>}
        {taskFilePath && <div className="d-flex small mb-2 mt-2 align-items-center">
          <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
          <a target="_blank" rel="noreferrer" className="truncate-1" href={`/api/files/dbx/signed-read${taskFilePath}`}>{taskFilePath.split('/')[2]}</a>
        </div>}

        {task.taskDescription && <div className="pt-1">
          <div className="d-flex small mb-1">
            <i className="fas fa-align-left mt-1 lineitem-icon" aria-hidden="true"></i>
            <p className="task-description mb-0" dangerouslySetInnerHTML={{__html: task.taskDescription}} />
          </div>
        </div>}

        {(taskImages.length > 0 || backUpImages.length > 0) && <TaskImages task={task} isJob={isJob || false} loadImages={loadImages} editable hideActivityImages={true} updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks} />}

        {(taskActivityImages.length !== 0 || taskFileJAPath || taskLinkJAData.taskLink) && <div className="team-member-uploads pt-3">
          <h6>Added by {task.assigneeUserName === profile.username ? 'you' : task.assignee ? task.assignee : 'Team Member'}</h6>
          {taskLinkJAData.taskLink && <div className="d-flex small align-items-start">
            <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">External link</span></span>
            <div>
              <div className="d-flex align-items-center mb-2">
                <a target="_blank" className="truncate-1" rel="noreferrer" href={getQualifiedLink(taskLinkJAData.taskLink)}>{taskLinkJAData.taskLinkText}</a>
                {/*<a className="ml-2" href="#" data-toggle="modal" data-target="#edit-external-link" onClick={() => setShowLinkModal(true)}><i className="far fa-lg fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only">Edit Link</span></a>*/}
              </div>
            </div>
          </div>}

          {taskFileJAPath && <div className="d-flex small align-items-start">
            <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
            <div>
              <div className="d-flex align-items-center mb-2">
                <a href={`/api/files/dbx/signed-read${taskFileJAPath}`} target="_blank" rel="noreferrer" className="truncate-1">{taskFileJAPath.split('/')[2]}</a>
              </div>
            </div>
          </div>}
          {!!taskActivityImages && !!taskActivityImages.length && <div className="task-images">
            <>
              {taskActivityImages && taskActivityImages.map((pic, idx) => (
                <TaskImage
                  key={idx}
                  url={pic.url}
                  task={task}
                  originUrl={pic.originUrl}
                  editable={isInProgressTask}
                  inProgress={pic.inProgress}
                  data-target="task-image-activity"
                  updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                />
              ))}
            </>
          </div>
          }
        </div>}
        {!!imageRequired && (
          <div className="d-flex small mb-2 mt-2 align-items-center">
            <span>
              <i className="fas fa-check-square lineitem-icon" aria-hidden="true"></i>
              <span className="sr-only">{`${imageRequired === 1 ? 'Image' : 'Screenshot'} Verification`}</span>
            </span>
            {
              imageRequired === 1
                ? <Trans i18nKey="photo_required_for_verification" defaults="Photo required for verification" />
                : <Trans i18nKey="screenshot_required_for_verification" defaults="Screenshot required for verification" />
            }
          </div>
        )}
      </div>
    </div>
  );
};
TaskDetailsComment.propTypes = {
  task: PropTypes.object,
  isDetailsExpanded: PropTypes.bool,
  updateTaskInNonGrpJobTasks: PropTypes.func,


};

TaskDetailsComment.defaultProps = {
  scrollToBottom: () => {},
};

TaskDetailsComment.displayName = 'TaskDetailsComment';
export default TaskDetailsComment;
