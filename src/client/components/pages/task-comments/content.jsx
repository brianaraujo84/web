import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation, Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getStandardObject } from '../../../redux/actions/object';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { useActionDispatch } from '../../../hooks';
import * as URLS from '../../../urls';
import { DateUtils } from '../../../utils';
import { formatTaskRecurringType } from '../../../lib/task';
import { getTaskImages, getJobActivityImages, getFilePathFromDbx } from '../../../redux/actions/files';
import { TaskStatus } from '../../../constants';
import TaskImages from '../location-details/task-images';

const OBJECT_TASK_LINK = 'task';
const OBJECT_CONTACTS = 'contacts';

const Content = ({ task }) => {
  const { t } = useTranslation();
  const { taskId, locationId } = useParams();

  const [taskLinkData, setTaskLinkData] = React.useState({});
  const [taskFilePath, setTaskFilePath] = React.useState(false);
  const [imageRequired, setImageRequired] = React.useState(0);
  const [backUpImages, setbackUpImages] = React.useState({});


  const getLinks = useActionDispatch(getStandardObject(OBJECT_TASK_LINK, undefined, `task/${taskId}/links`));
  const getTaskImagesList = useActionDispatch(getTaskImages);
  const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));


  const taskType = 'adhoc';

  const activityList = useSelector(state => state?.files?.activityList);
  const taskImagesLoaded = useSelector(state => (
    !!state.files.list && !!state.files.list[taskType] && !!state.files.list[taskType][task.taskId]
  ));

  const getQualifiedLink = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };
  
  const getTaskFilePath = (task) => {
    const path = preparePaths(task.taskId);
    getFilePathFromDbx(path.folderName, path.fileName).then(file => {
      if (file.isFileExist) {
        setTaskFilePath(file.link);
      }
    });
  };

  const preparePaths = (fileType, fileNameStr) => {
    const folderName = `${task.taskId}-adhoc`;
    const fileName = `${fileNameStr || task.taskId}${fileType ? '.' + fileType : ''}`;
    return {folderName, fileName};
  };

  const formatFirstNameAndLastInitial = (name) => {
    const names = name.split(' ');
    return `${names[0]} ${names[1].slice(0,1)}`;
  };


  const getTaskLink = () => {
    getLinks().then(data => {
      if(data.taskLinks && data.taskLinks.length > 0) {
        const l = data.taskLinks[0];
        setTaskLinkData({ taskLink: l.link, taskLinkText: l.tag, taskLinkId: l.taskLinkId });
      }
    });
  };

  const taskImages = useSelector(state => {
    const taskId = task?.stage?.toLowerCase() === TaskStatus.copy ? task.orginalTaskId : task.taskId;
    return state.files.list && state.files.list[taskType] && state.files.list[taskType][taskId] ? state.files.list[taskType][taskId] : [];
  });

  const loadImages = React.useCallback(async () => {
    await getTaskImagesList(task.taskId, taskType);
    if (task.jobActivityId && task.taskActivityTrackerId) {
      await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
    }
  }, [task]);

  React.useEffect(() => {
    if (task && taskId) {
      getTaskFilePath(taskId);
      getTaskLink();
    }
  },[]);

  React.useEffect(() => {
    if (task) {
      setImageRequired(task.imageRequired || 0);
      getContacts(locationId);
    }
  },[task]);

  React.useEffect(() => {
    if (activityList && activityList[task.jobActivityId] && activityList[task.jobActivityId][task.taskActivityTrackerId]) {
      setbackUpImages(activityList[task.jobActivityId][task.taskActivityTrackerId]);
    }
  },[activityList]);

  React.useEffect(() => {
    if (!taskImagesLoaded) {
      loadImages();
    }
  }, [taskImagesLoaded]);

  if (!task || !taskImagesLoaded) {
    return <div />;
  }
  return (
    <>
      <div className="bg-white">
        <div className="container top-section mt-3">
          <div className="row justify-content-center">
            {/* <!-- Task --> */}
            <div className="col-12">
              <div className="task">
                <p className="mb-2">
                  {task.stage && <span className="badge border-primary border text-primary">{t(task.stage)}</span>}
                  {task.priority && <span className="badge badge-orange"><i className="fas fa-flag" aria-hidden="true"></i>{t(task.priority)}</span>}
                </p>
                <div>
                  {task.task && <h5 className="mb-1">{t(task.task)}</h5>}
                  {task.assignee && <div className="d-flex small mt-2 mb-2">
                    <span className="mr-1"><i className="fas fa-user mt-1 lineitem-icon" aria-hidden="true"></i>{t('Assigned to: ')}</span>
                    <a href="#"><img className="rounded-circle border border-primary" src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)} style={{ width: '25px' }} />{t(formatFirstNameAndLastInitial(task.assignee))}</a>
                  </div>}

                  {task && task.taskRecurring && task.taskRecurring.nextOccurrenceDate && <div className="d-flex small mt-2 mb-1">
                    <span><i className="far fa-calendar-alt lineitem-icon" aria-hidden="true"></i></span>
                    <a data-toggle="modal" data-target="#reschedule-modal" href="#">{'  '}{DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}<span>{formatTaskRecurringType(task) !== undefined && task.taskRecurring.nextOccurrenceDate !== 'OneTime' && (
                      <>{'  |  '}<i className="fas fa-repeat-alt" aria-hidden="true"></i>
                        {'  '}{t(formatTaskRecurringType(task))}</>)}</span></a>
                  </div>}

                  {!!task.dueDate && <div className="d-flex">
                    <div>
                      <div className="d-flex small mt-2 mb-1">
                        <span><i className="ci ci-due-f lineitem-icon-custom"></i></span>
                        <a data-toggle="modal" data-target="#set-duedate" href="#">{DateUtils.unicodeFormat(DateUtils.parseISO(task.dueDate), 'P')}</a>
                        {task.dueDate && DateUtils.isAfter(DateUtils.parseISO(DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd')), DateUtils.parseISO(task.dueDate)) && <span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i>{t('Overdue')}</span>}
                      </div>
                    </div>
                  </div>}

                  <div className="task-detail-overflow pt-1" id="taskDetai1">

                    {taskLinkData.taskLink && <div className="d-flex small mb-2 align-items-start">
                      <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">{t('External link')}</span></span>
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <a href={getQualifiedLink(taskLinkData.taskLink)} target="_blank" rel="noreferrer" className="truncate-1">{taskLinkData.taskLinkText}</a>
                        </div>
                      </div>
                    </div>}

                    {taskFilePath && <div className="d-flex small mt-2 align-items-start">
                      <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <a href={`/api/files/dbx/signed-read${taskFilePath}`} target="_blank" rel="noreferrer" className="truncate-1">{taskFilePath.split('/')[2]}</a>
                        </div>
                      </div>
                    </div>}

                    <div className="pt-1">

                      {task && task.taskDescription && <div className="d-flex small mb-1">
                        <i className="fas fa-align-left mt-1 lineitem-icon" aria-hidden="true"></i>
                        <div dangerouslySetInnerHTML={{__html: task.taskDescription}} className='task-description mb-0' />
                      </div>}

                      <div className="pb-2 text-right d-none actions">
                        <button type="button" className="task-c-button p-1 btn rounded-circle btn-outline-primary"><i className="far fa-times" aria-hidden="true"></i><span className="sr-only">Discard</span></button>
                        <button type="button" className="task-c-button p-1 ml-1 btn rounded-circle btn-primary"><i className="fas fa-check" aria-hidden="true"></i><span className="sr-only">Save</span></button>
                      </div>
                    </div>

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

                    {(taskImages.length > 0 || backUpImages.length > 0) && <TaskImages task={task} isJob={false} loadImages={loadImages} editable />}

                  </div>
                </div>
              </div>
            </div>
            {/* <!--./ Task --> */}
          </div>
        </div>
      </div>
    </>
  );
};

Content.propTypes = {
  task: PropTypes.object,
  locationId: PropTypes.string,
  onUpdate: PropTypes.func,
};

Content.displayName = 'Content';
export default Content;
