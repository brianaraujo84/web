import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { classnames } from 'react-form-dynamic';

import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { setObject, postConfidenceJobObject, postConfidenceObject } from '../../../redux/actions/object';
import { deleteJobActivityImage, getJobActivityImages, uploadJobActivityImages } from '../../../redux/actions/files';
import { toBase64Array } from '../../../utils';

import AddImageModal from './add-image-modal';
import TaskImage from '../../shared/task-image';
import { preloadImage, dataUrlToFile } from '../../../utils';
import * as URLS from '../../../urls';
import AssignedModal from '../../shared/modal/assigned';
import { ALL_TASK_OPTIONS, ALL_TASK_OPTIONS_GRP} from '../location-details/tasks';

const OBJECT_START = 'task/start';
const OBJECT_COMPLETE = 'task/tracking';

const OBJECT_TEMPLATE_TASKS = 'templateTasks1';

const WorkerJobTaskCard = ({
  task,
  templateImageObj,
  previousTask,
  taskIdx,
  locationZoneId,
  workingOnTaskId,
  isLastTaskOfJob,
  taskSummary,
  updateTasksInfo,
}) => {
  const { t } = useTranslation();
  const { locationId, taskTemplateId } = useParams();
  const history = useHistory();

  const shouldCompleteTaskAfterUpload = React.useRef();

  const imageInputRef = React.useRef();
  const cardRef = React.useRef(null);

  const [showAddImage, setShowAddImage] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const [activityImages, setActivityImages] = React.useState([]);
  const [activityImagesLoaded, setActivityImagesLoaded] = React.useState(false);
  const [preloadTplUrl, setPreloadedTemplateImageObj] = React.useState(false);
  const [showTaskReviewModal, setShowTaskReviewModal] = React.useState(false);

  const getTaskTemplateInfo = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE_TASKS, undefined, `template/${taskTemplateId}`, '/details'));
  const startTask = useActionDispatch(postConfidenceJobObject(OBJECT_START));
  const completeTask = useActionDispatch(postConfidenceJobObject(OBJECT_COMPLETE));
  const toast = useActionDispatch(addToast);
  const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);
  const uploadImages = useActionDispatch(uploadJobActivityImages);
  const deleteTaskActivityImg = useActionDispatch(deleteJobActivityImage);

  const profile = useSelector(state => state.profile.data);
  const resetFilterData = useActionDispatch(setObject('taskGroupFilters'));
  const filterData = useSelector(state => state.taskGroupFilters && state.taskGroupFilters.data);

  const handleStartTask = async () => {
    if (workingOnTaskId || !canStartToday) {
      return;
    }
    const data = {
      taskId: task.taskId,
      templateId: taskTemplateId,
      locationZoneId: locationZoneId,
    };
    updateTasksInfo(task, 'in progress');
    await startTask(data);
    if (taskIdx === 0) {
      updateTasks();
    }
  };

  const updateFilterstoCompleted = () => {
    filterData.tab = 'groups';
    filterData.categoryGrp = 'Completed';
    filterData.filterGrp = [{ value: 'Completed', label: 'Completed', cat: 'Completed' }];
    filterData.sortGrp = {value: 'Created Newest First', label: 'Created', subLabel: 'Newest First', sortBy: 'createdDate', sortByOrder: 'desc'};

    filterData.category = filterData.categoryGrp;
    filterData.filter = filterData.filterGrp;
    filterData.sort = filterData.sortGrp;

    resetFilterData({ ...filterData });
  };

  const updateFiltersToActive = () => {
    filterData.tab = 'groups';
    filterData.categoryGrp = 'Active';
    filterData.filterGrp = ALL_TASK_OPTIONS_GRP;
    filterData.sortGrp = {value: 'Created Newest First', label: 'Created', subLabel: 'Newest First', sortBy: 'createdDate', sortByOrder: 'desc'};

    filterData.category = filterData.categoryGrp;
    filterData.filter = ALL_TASK_OPTIONS;
    filterData.sort = filterData.sortGrp;

    resetFilterData({ ...filterData });
  };

  const handleCompleteTask = async (skipUpdate = false) => {
    const data = {
      taskActivityTrackerId: task.taskActivityTrackerId,
      status: 'Review'
    };
    await completeTask(data);
    loadActivityImages();
    toast(t('Task Completed!'));
    if (isLastTaskOfJob) {
      if (profile.username === taskSummary.assignedByUserName) {
        setShowTaskReviewModal(true);
      } else {
        updateFilterstoCompleted();
        history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
      }
    } else if (!skipUpdate) {
      updateTasksInfo(task, 'Review');
    }
  };

  const addImageToList = (images) => {
    let imagesList = activityImages || [];
    imagesList = imagesList.concat(images);
    setActivityImages(imagesList);
    return imagesList;
  };

  const updateImageOnList = (imageName, imagesList) => {
    //const imagesList = imagesList;
    const imgData = imagesList.filter((img) => img.name === imageName);
    if (imgData.length) {
      imgData[0].inProgress = false;
      setActivityImages(imagesList.splice(0));
    }
  };

  const handleImageInputChange = React.useCallback(async ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    const imageFile = files[0];
    if (imageInputRef && imageInputRef.current && imageInputRef.current.value) {
      imageInputRef.current.value = null;
    }
    const values = await toBase64Array([imageFile]);
    const images = values.reduce((acc, cur) => {
      acc.push({ ...cur.value, imageName: `image_${Date.now()}.${cur.value && cur.value.extension}` });
      return acc;
    }, []);
    const insertImages = [];
    images.forEach((img) => {
      const imgContent = `data:image/${img.extension};base64,${img.content}`;
      const imgTempContent = `data:image/${img.extension};base64,${img.tempContent}`;
      insertImages.push({
        name: img.imageName,
        originUrl: imgContent,
        url: imgTempContent,
        inProgress: true
      });
    });
    const imagesList = addImageToList(insertImages);
    if (shouldCompleteTaskAfterUpload.current && !activityImages.length) {
      let stage = 'Review';
      if (taskSummary.templateType !== 'Main') {
        stage = taskSummary.assignedByUserName === taskSummary.assigneeUserName ? 'Completed' : 'Review';
      }
      updateTasksInfo(task, stage);
    }
    setShowMore(true);
    await uploadImages(images, task.jobActivityId, task.taskActivityTrackerId);
    updateImageOnList(images[0].imageName, imagesList);
    if (shouldCompleteTaskAfterUpload.current) {
      handleCompleteTask();
    }
    //await loadActivityImages();
  }, [task.jobActivityId, task.taskActivityTrackerId, uploadImages, loadActivityImages]);

  const handleAddImageButtonClick = (shouldCompleteTask) => {
    shouldCompleteTaskAfterUpload.current = shouldCompleteTask;
    if (task && task.imageRequired === 1 && activityImages.length === 0) {
      imageInputRef.current.click();
    } else if (task && task.imageRequired === 2 && activityImages.length === 0) {
      if (window.electron) {
        window.electron.send('take-full-screenshot', task.taskId);
      } else {
        imageInputRef.current.click();
      }
    } else {
      handleCompleteTask();
    }
    setShowMore(true);
  };

  const updateTasks = () => {
    getTaskTemplateInfo({jobActivityId: task.jobActivityId}).then((data) => {
      updateTasksInfo(data, 'update_all');
    });
  };

  const isPrevousTaskActive = React.useMemo(() => {
    return !!previousTask && previousTask.stage && ['review'].indexOf(previousTask.stage.toLowerCase()) === -1;
  }, [previousTask, previousTask?.stage]);

  const isOpenTask = React.useMemo(() => {
    return task.stage && ['open', 'accepted', 'not started'].indexOf(task.stage.toLowerCase()) !== -1;
  }, [task.stage]);

  const isInProgressTask = React.useMemo(() => {
    return task.stage && 'in progress' === task.stage.toLowerCase();
  }, [task.stage]);

  const isReviewTask = React.useMemo(() => {
    return task.stage && 'review' === task.stage.toLowerCase();
  }, [task.stage]);

  const isReworkTask = React.useMemo(() => {
    return task.stage && 'rework' === task.stage.toLowerCase();
  }, [task.stage]);

  const canStartToday = React.useMemo(() => {
    return task.nextOccurrenceDate && !moment(task.nextOccurrenceDate).isAfter(new Date(), 'day');
  }, [task.nextOccurrenceDate]);

  const buttonDisabled = React.useMemo(() => {
    return isPrevousTaskActive || workingOnTaskId || (!canStartToday);
  }, [isPrevousTaskActive, workingOnTaskId, canStartToday]);

  const [cardColor, buttonColor] = React.useMemo(() => {
    if (isReviewTask) {
      return ['success', 'success'];
    }
    if (isInProgressTask) {
      return ['primary', 'primary'];
    }
    if (isReworkTask) {
      return ['secondary', 'secondary'];
    }
    return ['secondary', buttonDisabled ? 'secondary' : 'primary'];
  }, [isInProgressTask, isReviewTask, isReworkTask, task]);

  const loadActivityImages = async () => {
    if (task.jobActivityId && task.taskActivityTrackerId) {
      const images = await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
      setActivityImages(images.list);
      setActivityImagesLoaded(true);
    } 
  };

  const deleteActivityImage = async (imageName) => {
    await deleteTaskActivityImg(task.jobActivityId, task.taskActivityTrackerId, imageName);
    loadActivityImages();
    shouldCompleteTaskAfterUpload.current = false;
  };

  const showMoreSection = () => {
    if (!activityImagesLoaded) {
      loadActivityImages();
    }
    setShowMore(show => !show);
  };

  const [templateImageUrl, templateOriginImageUrl] = React.useMemo(() => {
    if (templateImageObj) {
      const tplUrl = URLS.TEMPLATE_IMAGE_THUMB(templateImageObj.referenceTemplateId, templateImageObj.taskIdMapping[task.taskId]);
      const tplOriginUrl = URLS.TEMPLATE_IMAGE(templateImageObj.referenceTemplateId, templateImageObj.taskIdMapping[task.taskId]);
      preloadImage(tplUrl, () => setPreloadedTemplateImageObj(true));
      preloadImage(tplOriginUrl, ()=>{});
      return [
        tplUrl,
        tplOriginUrl,
      ];
    }
    return [];
  }, [templateImageObj]);

  React.useEffect(() => {
    if (
      (!buttonDisabled && (isOpenTask || isReworkTask)) ||
      (isInProgressTask && buttonDisabled === workingOnTaskId)
    ) {
      setShowMore(true);
    }
  }, [buttonDisabled]);

  React.useEffect(() => {
    if (isInProgressTask) {
      loadActivityImages();
    }
  }, []);

  React.useEffect(() => {
    if (task?.stage === 'Review') {
      showMoreSection();
    }
  },[]);

  const handleFilterChange = (type) => {
    if (type ==='Completed') {
      setShowTaskReviewModal(false);
      updateFilterstoCompleted();
      history.push(URLS.LOCATION(locationId));
    } else {
      setShowTaskReviewModal(false);
      updateFiltersToActive();
      history.push(URLS.LOCATION(locationId));
    }
  };
  
  React.useEffect(() => {
    const handleScreenshot = (taskId, base64Screenshot) => {
      if (task.taskId === taskId) {
        dataUrlToFile(base64Screenshot, `image_${Date.now()}.png`).then((file) => {
          handleImageInputChange({ target: { files: [file] } });
        });
      }
    };

    let unsubscribe;

    if (window.electron) {
      unsubscribe = window.electron.receive('full-screenshot-taken', handleScreenshot);
    }
    return () => {
      if (window.electron && unsubscribe) {
        unsubscribe();
      }
    };
  }, [task.jobActivityId, task.taskActivityTrackerId, uploadImages, loadActivityImages]);

  return (
    <>
      <div className={`task alert alert-${cardColor} p-0`} key={taskIdx} ref={cardRef}>
        <a className={'p-1 text-center task-status text-white rounded-left'} style={{ minHeight: '60px' }}>
          <Trans i18nKey="step" /> {taskIdx + 1}
        </a>
        <div className="p-2">
          <div className='d-flex'>
            {task.stage && <div className="col p-0 d-flex justify-content-end">
              <span className="badge border-primary border text-primary zone-badge">{t(task.stage.replace(/\s/g, ' '))}</span>
            </div>}
          </div>
          <h5 className="alert-heading mb-1" data-target="task-title">{task.task} </h5>
          {
            showMore && (
              <div className="task-detail-overflow pt-2">
                {
                  !!task.taskDescription && (
                    <div className="task-description">
                      <div className="task-subtitle">
                        <div dangerouslySetInnerHTML={{__html: task.taskDescription}} className='view task-description' />
                      </div>
                    </div>
                  )
                }
                {
                  !!templateImageUrl && !! preloadTplUrl &&(
                    <div className="task-images pt-3">
                      <h6><Trans i18nKey="task_imgs" /></h6>
                      <TaskImage
                        url={templateImageUrl}
                        task={task}
                        originUrl={templateOriginImageUrl}
                        data-target="task-image"
                      />
                    </div>
                  )
                }
                {
                  !!activityImages && !!activityImages.length && (
                    <div className="task-images pt-3">
                      {activityImages.length === 1 && <h6><Trans i18nKey="imgs_submitted_by_you" /></h6>}
                      {
                        activityImages.map((image, idx) => (
                          <TaskImage
                            key={idx}
                            task={task}
                            inProgress={image.inProgress}
                            url={image.url}
                            originUrl={image.originUrl}
                            data-target="task-image"
                            editable={isInProgressTask}
                            onDelete={() => deleteActivityImage(image.name)}
                            showImageScore={idx === 0}
                          />
                        ))
                      }
                    </div>
                  )
                }
                {activityImages.length === 0 && !!task.imageRequired && (
                  <div className="d-flex small mb-2 mt-2 align-items-center">
                    <span>
                      <i className="fas fa-check-square lineitem-icon" aria-hidden="true"></i>
                      <span className="sr-only">{`${task.imageRequired === 1 ? 'Image' : 'Screenshot'} Verification`}</span>
                    </span>
                    {
                      task.imageRequired === 1
                        ? <Trans i18nKey="photo_required_for_verification" defaults="Photo required for verification" />
                        : <Trans i18nKey="screenshot_required_for_verification" defaults="Screenshot required for verification" />
                    }
                  </div>
                )}
              </div>
            )
          }
          <hr className="my-2" />
          <div className="text-right">
            {
              (!isReviewTask) && (
                <div className="col" />
              )
            }

            {(isOpenTask || isReworkTask) && taskSummary.stage !== 'Assigned' &&
              <Button
                type="button"
                variant={buttonColor}
                className="py-1 px-3 ml-2 rounded-pill text-capitalize"
                data-target="start-task"
                disabled={buttonDisabled}
                onClick={handleStartTask}
              >
                <Trans i18nKey="start" />
              </Button>
            }
            {isInProgressTask && (
              <>
                {activityImages.length === 0 && task.imageRequired === 1 &&
                  <Button
                    variant="outline-primary"
                    className="task-c-button p-1 ml-1 rounded-circle"
                    data-target="add-image-btn"
                    onClick={() => handleAddImageButtonClick(false)}
                  >
                    <i className="fas fa-camera" aria-hidden="true"></i><span className="sr-only"><Trans>Add Pictures</Trans></span>
                  </Button>
                }
                {activityImages.length === 0 && task.imageRequired === 2 &&
                  <Button
                    variant="outline-primary"
                    className="task-c-button p-1 ml-1 rounded-circle"
                    data-target="add-screenshot-btn"
                    onClick={() => handleAddImageButtonClick(false)}
                  >
                    <i className="far fa-image" aria-hidden="true"></i><span className="sr-only"><Trans>Add Screenshot</Trans></span>
                  </Button>
                }
                <Button
                  className="py-1 px-3 ml-2 rounded-pill"
                  variant="primary"
                  data-target="complete-task"
                  onClick={() => handleAddImageButtonClick(true)}
                >
                  <Trans i18nKey="complete" />
                </Button>
              </>
            )}
            <Button
              variant="outline-primary"
              className="task-c-button p-1 ml-1 rounded-circle task-detail-toggle"
              data-target="show-more-btn"
              onClick={showMoreSection}
            >
              <i className={classnames(
                [
                  'fas',
                  showMore ? 'fa-chevron-up' : 'fa-chevron-down'
                ]
              )} aria-hidden="true"></i>
            </Button>
          </div>
        </div>
        <AddImageModal
          show={showAddImage}
          onClose={setShowAddImage}
          onUpload={handleCompleteTask}
          task={task}
        />
      </div>

      <input
        type="file"
        name="image"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={imageInputRef}
        onChange={handleImageInputChange}
      />

      {showTaskReviewModal && <AssignedModal
        onCancel={() => handleFilterChange('Completed')}
        onConfirm={() => handleFilterChange('Active')}
        show={showTaskReviewModal}
        title="Task Approved"
        messageText="You have just approved this task."
        secondLineText="Want to work on more tasks?"
        cancelText={t('no')}
        confirmText={t('yes')}
      />}
    </>
  );
};

WorkerJobTaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  templateImageObj: PropTypes.object,
  previousTask: PropTypes.object,
  taskSummary: PropTypes.object,
  taskIdx: PropTypes.number.isRequired,
  locationZoneId: PropTypes.number.isRequired,
  workingOnTaskId: PropTypes.number.isRequired,
  isLastTaskOfJob: PropTypes.bool.isRequired,
  updateTasksInfo: PropTypes.func,
};

WorkerJobTaskCard.defaultProps = {
  previousTask: null,
  templateImageObj: null,
  taskSummary: null,
  updateTasksInfo: () => {},
};
WorkerJobTaskCard.displayName = 'WorkerJobTaskCard';
export default WorkerJobTaskCard;
