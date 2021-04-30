import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { Draggable } from 'react-beautiful-dnd';

import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { postConfidenceJobObject, postConfidenceObject, postTaskCommunicationObject } from '../../../redux/actions/object';
import { getPostStandardObjectsList, getStandardObjectsList, addToList, removeFromList } from '../../../redux/actions/objects';
import { getTaskImages, getJobActivityImages, uploadJobActivityImages, insertActivityImages, updateActivityImageStatus, uploadFileToDbxV2, getFilePathFromDbx, deleteFileFromDbx, deleteJobActivityImage } from '../../../redux/actions/files';
import TaskImages from '../location-details/task-images';
import AssignModal from '../location-details/assign-modal';
import AssignedModal from '../../shared/modal/assigned';
import AddImageModal from './add-image-modal';
import TaskStartModal from '../location-details/task-start-modal';
import { DateUtils, toBase64Array, dataUrlToFile } from '../../../utils';
import * as URLS from '../../../urls';
import { TaskStatus, StorageKeys, COMMENT_ADDED_EVENT, UserRole } from '../../../constants';
import { getItem } from '../../../utils/storage-utils';
import DeclineJobModal from '../location-details/decline-job-modal';
import { formatTaskRecurringType } from '../../../lib/task';
import SimpleWorkerTaskCardSkin from '../location-details/skins/simple-worker-task-card-skin';
import EllipsisMenuV3 from '../../shared/ellipsis-menu/ellipsis-menu-v3';
import LinkModal from '../location-details/link-modal';
import TaskImage from '../../shared/task-image';
import FileDeleteModal from '../location-details/file-delete-modal';
import { CommentsContext } from '../../../contexts';
import ScreenshotContent from '../location-details/screenshot-content';

const OBJECT_TASKS = 'tasks';
const OBJECT_ACCEPT = 'jobacceptance';
const OBJECT_START = 'task/start';
const OBJECT_COMPLETE = 'task/tracking';
const OBJECT_ASSIGN = 'assign';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_TASK_LINK = 'task';
const OBJECT_EXPANDED_TASK_LIST = 'expandedTaskList';

const WorkerTaskCardDragable = ({ task, getLocation, updateTaskInNonGrpJobTasks, isOnTaskDetailsPage, updateTaskGroup, isReadOnly, locationUserRole, index, updateFilters, cardSkin, sortingMode }) => {
  const { t } = useTranslation();
  const { locationId } = useParams();
  const history = useHistory();
  const { pathname } = history.location;

  const isJob = React.useMemo(() => {
    return task.templateType && task.groupCard && ('main' === task.templateType.toLowerCase() || 'custom' === task.templateType.toLowerCase());
  }, [task.templateType]);

  const taskType = isJob ? 'predefined' : 'adhoc';

  const expandedTaskList = useSelector(state => state.expandedTaskList?.items);
  const thisTaskInExpandedTaskList = expandedTaskList?.filter(i => i.taskId === task.taskId)[0];

  const profile = useSelector(state => state.profile.data);
  const locationZones = useSelector(state => state.locationZones?.items);

  const taskImagesLoaded = useSelector(state => (
    !!state.files.list && !!state.files.list[taskType] && !!state.files.list[taskType][task.taskId]
  ));
  const taskImages = useSelector(state => (
    state.files.list && state.files.list[taskType] && state.files.list[taskType][task.taskId] ? state.files.list[taskType][task.taskId] : []
  ));
  const taskActivityImages = useSelector(state => (
    state.files.activityList && state.files.activityList[task.jobActivityId]
      && state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] ? state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] : []
  ));

  const [showTaskDetails, setShowTaskDetails] = React.useState(!!thisTaskInExpandedTaskList);
  const [showAddImage, setShowAddImage] = React.useState(false);
  const [showTaskStart, setShowTaskStart] = React.useState(false);
  const [showDeclineJob, setShowDeclineJob] = React.useState(false);
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [assignData, setAssignData] = React.useState(false);
  const [showNavToAssignedTaskModal, setShowNavToAssignedTaskModal] = React.useState(false);
  const [openMenuPopup, setOpenMenuPopup] = React.useState(false);
  const [taskFileUploading, setTaskFileUploading] = React.useState(false);
  //const [taskFilePathError, setTaskFilePathError] = React.useState(false);
  const [taskFilePath, setTaskFilePath] = React.useState(false);
  const [taskFileJAPathError, setTaskFileJAPathError] = React.useState(false);
  const [taskFileJAPath, setTaskFileJAPath] = React.useState(false);
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [taskLinkData, setTaskLinkData] = React.useState({});
  const [taskLinkJAData, setTaskLinkJAData] = React.useState({});
  const [showFileDeleteModal, setShowFileDeleteModal] = React.useState(false);
  const [isLastActivityImgDelete, setLastActivityImgDelete] = React.useState(false);
  const [lastComment, setLastComment] = React.useState({});
  const [isFilePathChecked, setIsFilePathChecked] = React.useState(false);
  const [isLinkChecked, setIsLinkChecked] = React.useState(false);
  const [showScreenshotContent, setShowScreenshotContent] = React.useState(false);

  const shouldCompleteTaskAfterUpload = React.useRef();
  const imageInputRef = React.useRef();
  const taskFileInputRef = React.useRef();

  const { numberofTasks } = task;

  const acceptOrDeclineTask = useActionDispatch(postConfidenceJobObject(OBJECT_ACCEPT));
  const startTask = useActionDispatch(postConfidenceJobObject(OBJECT_START));
  const completeTask = useActionDispatch(postConfidenceJobObject(OBJECT_COMPLETE));
  const getTasks = useActionDispatch(getPostStandardObjectsList(OBJECT_TASKS, 'jobs'));
  const toast = useActionDispatch(addToast);
  const getTaskImagesList = useActionDispatch(getTaskImages);
  const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);
  const uploadImages = useActionDispatch(uploadJobActivityImages);
  const addImageToList = useActionDispatch(insertActivityImages);
  const updateImageOnList = useActionDispatch(updateActivityImageStatus);
  const assignTask = useActionDispatch(postConfidenceJobObject(OBJECT_ASSIGN));
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));
  const updateLinks = useActionDispatch(postConfidenceObject(OBJECT_TASK_LINK, undefined, 'task/links'));
  const getLinks = useActionDispatch(postConfidenceObject(OBJECT_TASK_LINK, undefined, 'task/links/list'));
  const deleteTaskActivityImg = useActionDispatch(deleteJobActivityImage);
  const getLastComment = useActionDispatch(postTaskCommunicationObject(`${task.taskId}/comment/list`));
  const addToExpandedTaskList = useActionDispatch(addToList(OBJECT_EXPANDED_TASK_LIST));
  const removeFromExpandedTaskList = useActionDispatch(removeFromList(OBJECT_EXPANDED_TASK_LIST));

  const { locationName } = useSelector(state => state.loc.data);
  const { openTaskComments } = React.useContext(CommentsContext);

  const handleAcceptanceTask = async (acceptance) => {
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
      stage: acceptance,
    };
    await acceptOrDeclineTask(data);
    updateTasks();
  };

  const handleStartTask = async () => {
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
    };
    await startTask(data);
    updateTasks();
  };

  const handleClickStartTask = () => {
    if (getItem(StorageKeys.TASK_START_SHOW_KEY)) {
      handleStartTask();
    } else {
      setShowTaskStart(true);
    }
  };

  const changeFiltersTo = (type) => {
    updateFilters(type);
  };

  const handleToastComplete = async () => {
    changeFiltersTo('Completed');
  };

  const handleCompleteTask = async () => {
    if (!canStartToday) {
      return;
    }
    const data = {
      taskActivityTrackerId: task.taskActivityTrackerId,
      status: 'Review'
    };
    loadImages();
    await completeTask(data);
    getLocation(locationId);
    if (task.assignedByUserName === task.assigneeUserName) {
      updateTaskInNonGrpJobTasks(task.taskId, task.templateId, 'complete');
      toast(t('Task completed.'), 3000, t('View completed tasks'), handleToastComplete);
    } else {
      updateTaskInNonGrpJobTasks(task.taskId, task.templateId);
      toast(t('Task completed.'));
    }
    updateTasks('complete');
    handleExpand(true);

    const isSubActive = profile.subscription && profile.subscription.subscriptionValid;
    if (profile.teamUpgradePrompt && !isSubActive) {
      history.push(URLS.TEAM_UPGRADE);
    }
  };

  const handleCloseTaskStart = () => {
    setShowTaskStart(false);
  };

  const handleStartConfirm = () => {
    handleStartTask();
    setShowTaskStart(false);
  };

  const handleAddImageButtonClick = (shouldCompleteTask) => {
    shouldCompleteTaskAfterUpload.current = shouldCompleteTask;
    if (task && task.imageRequired === 1 && taskActivityImages.length === 0) {
      imageInputRef.current.click();
    } else if (task && task.imageRequired === 2 && taskActivityImages.length === 0) {
      if (window.electron) {
        window.electron.send('take-full-screenshot', task.taskId);
      } else {
        handleAddScreenshotButtonClick();
      }
    } else {
      handleCompleteTask();
    }
    handleExpand(true);
  };

  const handleAssignTask = async (data) => {
    await assignTask(data);
    setAssignData(false);
    updateTasks();
  };

  React.useEffect(() => {
    if (!assignData) {
      return;
    }
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
      locationId,
      task: task.task,
      status: 'assigned',
      assignee: assignData.userName ? assignData.userName : assignData.assigneeMobile,
    };
    if (data.assignee === profile.username) {
      setShowNavToAssignedTaskModal(true);
    } else {
      handleAssignTask(data);
    }
  }, [assignData]);

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
    await _uploadImages(images);
  }, [task.jobActivityId, task.taskActivityTrackerId, _uploadImages]);

  const _uploadImages = async (images) => {
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
    handleExpand(true);
    addImageToList(task.jobActivityId, task.taskActivityTrackerId, insertImages);
    if (shouldCompleteTaskAfterUpload.current && !taskActivityImages.length) {
      task.stage = task.assignedByUserName === task.assigneeUserName ? 'Completed' : 'Review';
    }
    await uploadImages(images, task.jobActivityId, task.taskActivityTrackerId);
    updateImageOnList(task.jobActivityId, task.taskActivityTrackerId, images[0].imageName);
    if (shouldCompleteTaskAfterUpload.current) {
      handleCompleteTask();
    }
    //await loadImages();
  };


  const updateTasks = (actionType = false) => {
    const isTaskDetailsCustomCard = isOnTaskDetailsPage && task.taskType === 'CustomGroupTask' && !task.groupCard;
    const getTasksData = {
      locationId,
      activityDate: DateUtils.unicodeFormat(),
      selfAssigned: !profile.isWorker,
    };
    getTasks(getTasksData);
    if (!isOnTaskDetailsPage && !actionType) {
      updateTaskInNonGrpJobTasks(task.taskId, task.templateId);
    }
    if (isOnTaskDetailsPage && !isTaskDetailsCustomCard) {
      updateTaskGroup();
    } else if (isTaskDetailsCustomCard && actionType !== 'complete') {
      updateTaskInNonGrpJobTasks(task.taskId, task.templateId);
    }
  };

  const loadImages = React.useCallback(async () => {
    await getTaskImagesList(task.taskId, taskType);
    if (task.jobActivityId && task.taskActivityTrackerId) {
      await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
      shouldCompleteTaskAfterUpload.current = false;
    }
  }, [task.taskId, task.jobActivityId, task.taskActivityTrackerId, isJob, shouldCompleteTaskAfterUpload]);

  const checkFiles = () => {
    setIsLinkChecked(true);
    if (!isFilePathChecked) {
      getTaskFilePath(task.taskId, loadImages);
      setIsFilePathChecked(true);
    }
  };

  const loadOnExpandDetails = () => {
    if (showTaskDetails) {
      !isLinkChecked && (getTaskLink().then(() => setIsLinkChecked(true)));
      !isFilePathChecked && (getTaskFilePath(task.taskId).then(() => setIsFilePathChecked(true)));
    } else {
      if (!isLinkChecked && !task.taskDescription) {
        getTaskLink(checkFiles);
      }
    }
  };

  const handleShowTaskDetails = async () => {
    handleExpand(!showTaskDetails);
  };

  const handleCloseDeclineJob = () => {
    setShowDeclineJob(false);
  };

  const handleDeclineJobConfirm = async () => {
    setShowDeclineJob(false);
    await handleAcceptanceTask('Declined');
    await getLocation(locationId);
    updateFilters('Declined');
  };

  const handleTaskAssignedToYouClick = () => {
    const assignDataPayload = {
      taskId: task.taskId,
      templateId: task.templateId,
      locationId,
      task: task.task,
      status: 'assigned',
      assignee: assignData.userName ? assignData.userName : assignData.assigneeMobile,
    };
    handleAssignTask(assignDataPayload).then(async () => {
      const data = {
        taskId: task.taskId,
        templateId: task.templateId,
        stage: 'Accepted',
      };
      await acceptOrDeclineTask(data).then(handleStartTask);
      if (pathname.includes('/location-my')) {
        setShowNavToAssignedTaskModal(false);
      } else {
        history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
      }
    });
  };

  const formatFirstNameAndLastInitial = (name) => {
    const names = name.split(' ');
    return `${names[0]} ${names[1].slice(0, 1)}`;
  };

  const handleDeclinedSelfAssignStart = () => {
    setShowNavToAssignedTaskModal(false);
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
      locationId,
      task: task.task,
      status: 'assigned',
      assignee: assignData.userName ? assignData.userName : assignData.assigneeMobile,
    };
    handleAssignTask(data).then(async () => {
      const data = {
        taskId: task.taskId,
        templateId: task.templateId,
        stage: 'Accepted',
      };
      await acceptOrDeclineTask(data);
      updateTasks();
    });
  };

  const updateAssign = (data) => {
    setAssignData(data);
    setShowAssignModal(false);
  };

  const toggleAssignModal = (event) => {
    event.preventDefault();
    setShowAssignModal(show => !show);
    getContacts(locationId);
  };

  const handleTaskGroupRouting = () => {
    if ((locationUserRole === 'Owner' || locationUserRole === 'Manager') && (task.assigneeUserName !== profile.username || isReviewTask)) {
      history.push({ pathname: URLS.TASK_DETAILS(locationId, task.templateId), state: { templateType: 'Custom' } });
    } else {
      history.push({ pathname: URLS.TASK_DETAILS(locationId, task.templateId, 'tm'), state: { templateType: 'Custom' } });
    }
  };

  const preparePaths = (taskId, fileType, fileNameStr, isActivity) => {
    const folderName = isActivity ? `${task.taskId}-adhoc-${task.jobActivityId}` : `${task.taskId}-adhoc`;
    const fileName = `${fileNameStr || task.taskId}${fileType ? '.' + fileType : ''}`;
    const fullPath = `task-files/${folderName}/${fileName}`;
    return { folderName, fileName, fullPath };
  };

  const handleTaskFileClick = React.useCallback(() => {
    taskFileInputRef.current.click();
    handleExpand(true);
  }, []);

  const handleTaskFileInputChange = async ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    const MB_50 = 50000000;
    const taskFile = files[0];
    if (taskFile.size > MB_50) {
      setTaskFileJAPathError(true);
      return;
    } else {
      setTaskFileJAPathError(false);
    }
    taskFileInputRef.current.value = null;
    const fileType = taskFile.name.substr(taskFile.name.lastIndexOf('.') + 1) || taskFile.type.split('/')[1];
    const fileName = taskFile.name.substr(0, taskFile.name.lastIndexOf('.'));
    const path = preparePaths(task.taskId, fileType, fileName, true);
    setTaskFileJAPath(`/${path.folderName}/${path.fileName}`);
    setTaskFileUploading(true);
    //await uploadFileToDbx(path.folderName, path.fileName, taskFile);
    await uploadFileToDbxV2(path.fullPath, taskFile);
    setTaskFileUploading(false);
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

  const onTaskFileJADelete = () => {
    const path = preparePaths(task.taskId);
    const fileType = taskFileJAPath.split('/');
    setShowFileDeleteModal(false);
    setTaskFileJAPath(false);
    deleteFileFromDbx(path.folderName, fileType[2]);
  };

  const handleSetTaskLinkClick = () => {
    setShowLinkModal(true);
  };

  const updateTaskLink = async (values) => {
    setShowLinkModal(false);
    handleExpand(true);
    setTaskLinkJAData({ ...values });
    const data = {
      taskId: task.taskId,
      jobActivityId: task.jobActivityId,
      taskActivityTrackerId: task.taskActivityTrackerId,
      taskActivityLinks: [
        {
          link: values.taskLink,
          tag: values.taskLinkText,
          taskLinkId: values.taskLinkId,
        }
      ],
    };
    await updateLinks(data);
  };

  const getTaskLink = (next) => {
    const data = {
      taskId: task.taskId,
      jobActivityId: task.jobActivityId,
      taskActivityTrackerId: task.taskActivityTrackerId,
    };
    return getLinks(data).then(data => {
      if ((data.taskLinks && data.taskLinks.length > 0) || (data.taskActivityLinks && data.taskActivityLinks.length > 0)) {
        const l = data.taskLinks[0] || {};
        setTaskLinkData({ taskLink: l.link, taskLinkText: l.tag, taskLinkId: l.taskLinkId });

        const al = data.taskActivityLinks[0] || {};
        setTaskLinkJAData({ taskLink: al.link, taskLinkText: al.tag, taskLinkId: al.taskLinkId });
      } else if (next) {
        next();
      }
    });
  };

  const deleteTaskLink = async (values) => {
    setShowLinkModal(false);
    setTaskLinkJAData({});
    const data = {
      taskId: task.taskId,
      taskLinks: [
        {
          taskLinkId: values.taskLinkId,
          action: 'delete'
        }
      ],
    };
    await updateLinks(data);
  };

  const handleAddComment = () => {
    openTaskComments({
      locationId,
      locationName,
      task,
    });
  };

  const getQualifiedLink = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const deleteActivityImage = async (imageName) => {
    setLastActivityImgDelete(taskActivityImages.length === 1 ? true : false);
    await deleteTaskActivityImg(task.jobActivityId, task.taskActivityTrackerId, imageName);
    loadImages();
  };

  const handleAddScreenshotButtonClick = () => {
    if (window.electron) {
      window.electron.send('take-full-screenshot', task.taskId);
    } else {
      setShowScreenshotContent(true);
    }
  };

  const handleCloseScreenshot = () => {
    setShowScreenshotContent(false);
  };

  const handleScreenshotSubmit = React.useCallback(async (files) => {
    if (files.length === 0) {
      return;
    }

    const values = await toBase64Array(files, true);
    const images = values.reduce((acc, cur) => {
      acc.push({ ...cur.value, imageName: `image_${Date.now()}.${cur.value.extension}` });
      return acc;
    }, []);
    await _uploadImages(images);
    handleCloseScreenshot();
  }, [task.jobActivityId, task.taskActivityTrackerId, _uploadImages]);

  React.useEffect(() => {
    if (task && task.stage === 'Review') {
      handleExpand(true);
    }
    if (task && task.stage === 'Rework') {
      handleExpand(true);
    }
    if (task && task.stage === 'Completed' && index === 0) {
      handleExpand(true);
    }
  }, [task.stage]);

  const handleExpand = (value) => {
    const taskInListIndex = expandedTaskList?.findIndex(i => i.taskId === task.taskId);
    if (value && !thisTaskInExpandedTaskList) {
      setShowTaskDetails(true);
      addToExpandedTaskList(expandedTaskList?.length, { taskId: task.taskId });
    } else if (!value && thisTaskInExpandedTaskList) {
      setShowTaskDetails(false);
      removeFromExpandedTaskList(taskInListIndex);
    } else if (value && thisTaskInExpandedTaskList) {
      setShowTaskDetails(true);
    } else {
      setShowTaskDetails(false);
    }
  };

  const isOwnerOrManager = () => {
    return [UserRole.OWNER, UserRole.MANAGER].includes(locationUserRole);
  };

  const isSortableTask = React.useMemo(() => {
    return isOwnerOrManager() && pathname.includes('/task/') && task.templateType === 'Custom';
  }, [locationUserRole, pathname, task.templateType]);

  const isEditable = React.useMemo(() => {
    return task.stage && [TaskStatus.inProgress, TaskStatus.review].indexOf(task.stage.toLowerCase()) === -1;
  }, [task.stage]);

  const isAssignedTask = React.useMemo(() => {
    return task.stage && TaskStatus.assigned === task.stage.toLowerCase();
  }, [task.stage]);

  const isAcceptedTask = React.useMemo(() => {
    return !isJob && task.stage && TaskStatus.accepted === task.stage.toLowerCase();
  }, [task.stage, isJob]);

  const isInProgressTask = React.useMemo(() => {
    return !isJob && task.stage && TaskStatus.inProgress === task.stage.toLowerCase();
  }, [task.stage, isJob]);

  const isReviewTask = React.useMemo(() => {
    return task.stage && TaskStatus.review === task.stage.toLowerCase();
  }, [task.stage]);

  const isCompletedTask = React.useMemo(() => {
    return task.stage && TaskStatus.completed === task.stage.toLowerCase();
  }, [task.stage]);

  const isRejectedTask = React.useMemo(() => {
    return task.stage && TaskStatus.rejected === task.stage.toLowerCase();
  }, [task.stage]);

  const isReworkTask = React.useMemo(() => {
    return task.stage && TaskStatus.rework === task.stage.toLowerCase();
  }, [task.stage, isJob]);

  const isDeclinedTask = React.useMemo(() => {
    return task.stage && TaskStatus.declined === task.stage.toLowerCase();
  }, [task.stage]);

  const isIncompleteTask = React.useMemo(() => {
    return task.stage && TaskStatus.incomplete === task.stage.toLowerCase();
  }, [task.stage]);

  const canStartToday = React.useMemo(() => {
    return task?.taskRecurring?.nextOccurrenceDate && !moment(task?.taskRecurring?.nextOccurrenceDate).isAfter(new Date(), 'day');
  }, [task.taskRecurring]);

  const cardColor = React.useMemo(() => {
    return isAssignedTask ? 'info' : isDeclinedTask ? 'danger' : isReworkTask ? 'warning' : isReviewTask ? 'success' : (isCompletedTask || isRejectedTask || isIncompleteTask) ? 'dark' : 'primary';
  }, [isAssignedTask, isReworkTask, isReviewTask, isDeclinedTask, isIncompleteTask, isCompletedTask]);

  const associatedZone = React.useMemo(() => {
    return locationZones && locationZones.find((locationZone) => locationZone.id === task.locationZoneId);
  }, [locationZones, task.locationZoneId]);

  // const isCustomJob = React.useMemo(() => {
  //   return task.templateType && 'custom' === task.templateType.toLowerCase();
  // }, [task.templateType]);

  const isTemplateJob = React.useMemo(() => {
    return task.templateType && 'main' === task.templateType.toLowerCase();
  }, [task.templateType]);

  const isCustomJobGroupCard = React.useMemo(() => {
    return task.templateType && 'custom' === task.templateType.toLowerCase() && task.groupCard;
  }, [task.templateType]);

  const isTemplateJobGroupCard = React.useMemo(() => {
    return task.templateType && 'main' === task.templateType.toLowerCase() && task.groupCard;
  }, [task.templateType]);

  const isExpandable = React.useMemo(() => {
    return taskLinkData.taskLink || taskFilePath || taskFileJAPath || task.taskDescription || taskImages.length !== 0 || taskActivityImages.length !== 0 || task.imageRequired !== 0;
  }, [task.taskDescription, taskImages, taskActivityImages, task.imageRequired, taskFilePath, taskFileJAPath, taskLinkData, taskLinkJAData]);

  React.useEffect(() => {
    if (showTaskDetails && !taskImagesLoaded) {
      loadImages();
    }
    loadOnExpandDetails();
  }, [showTaskDetails]);

  React.useEffect(() => {
    if (history && history.location && history.location.state && history.location.state.accepted) {
      handleAcceptanceTask('Accepted');
      handleShowTaskDetails();
    }
  }, []);

  const loadLastComment = async () => {
    const response = await getLastComment({ start: 0, limit: 1 });
    setLastComment(response);
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

    if (window.electron && task.taskActivityTrackerId) {
      unsubscribe = window.electron.receive('full-screenshot-taken', handleScreenshot);
    }
    return () => {
      if (window.electron && unsubscribe) {
        unsubscribe();
      }
    };
  }, [task.taskId, task.jobActivityId, task.taskActivityTrackerId, uploadImages, loadImages]);

  const handleCommentAddEvent = ({ detail }) => {
    if (detail?.taskId === task.taskId) {
      loadLastComment();
    }
  };

  React.useEffect(() => {
    loadLastComment();
    document.addEventListener(COMMENT_ADDED_EVENT, handleCommentAddEvent);
    return () => {
      document.removeEventListener(COMMENT_ADDED_EVENT, handleCommentAddEvent);
    };
  }, []);

  React.useMemo(() => {
    if (!!thisTaskInExpandedTaskList !== showTaskDetails) {
      handleShowTaskDetails();
    }
  },[thisTaskInExpandedTaskList, showTaskDetails]);

  return (
    <>
      {cardSkin === 'simple' &&
        <SimpleWorkerTaskCardSkin
          task={task}
          methodRefs={{}}
        />}
      {!cardSkin && <Draggable draggableId={task.taskId.toString()} index={index} isDragDisabled={!isOwnerOrManager() || !sortingMode}>
        {(provided) => (
          <div
            ref={provided.innerRef} {...provided.draggableProps}
            className={classnames(['task alert p-0',
              `alert-${cardColor}`
            ])}
          >
            {
              (task.stage && !isJob) &&
              <a
                className={classnames(
                  [
                    'text-center task-status justify-content-center d-flex text-white rounded-left',
                    `${cardColor}`
                  ]
                )}
              >
                {sortingMode && (
                  <i {...provided.dragHandleProps} className={isSortableTask && sortingMode ? 'fas fa-lg fa-grip-vertical drag-handle align-self-center p-2 fade-75' : 'fas fa-lg fa-grip-vertical p-2 fade-0'} aria-hidden="true"></i>
                )}
                <span className='p-1 h-100'>{t(task.stage.replace(/\s/g, ' '))}</span>
                {sortingMode && (
                  <i {...provided.dragHandleProps} className="fas fa-lg fa-grip-vertical drag-handle align-self-center p-2 fade-0" aria-hidden="true"></i>
                )}
              </a>
            }
            {
              (task.stage && isJob) &&
              <span className="p-1 task-status align-self-stretch d-block rounded-left flex-grow-0"></span>
            }

            <div className="p-2 col">
              {!!task.priority && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') &&
                <div className={`priority-badge p${task.priority}`}>
                  <div className="priority-badge-number">{task.priority}</div>
                  <div className="triangle"></div>
                </div>}
              {
                task && task.stage && isJob && (task.stage !== 'Assigned') && (task.stage !== 'Open') && (
                  <p className="mb-2">
                    <span className={`badge border-${cardColor} border text-${cardColor}`}>
                      {t(task.stage.toLowerCase().replace(/\s/g, '_'))}
                    </span>
                  </p>
                )
              }
              {task.taskType === 'CustomGroupTask' && !isCustomJobGroupCard && !isTemplateJobGroupCard && task.templateName && (!pathname.includes('/task/') || pathname.includes('/details/')) &&
                <div className="d-flex">
                  <div className="col p-0">
                    <a className="badge badge-light border border-primary text-primary zone-badge" onClick={handleTaskGroupRouting}>{task.templateName}</a>
                  </div>
                </div>
              }
              {associatedZone && (
                <p className="mb-2">
                  <span className={classnames(
                    [
                      'zone-badge badge',
                      (!isCompletedTask || !isRejectedTask || !isIncompleteTask) ? 'badge-primary' : 'badge-secondary'
                    ]
                  )} >
                    {`${associatedZone.type}${associatedZone.label ? ` "${associatedZone.label}"` : ''}`}
                  </span>
                </p>
              )}
              <div className="row job-title">
                <h5 className={`col w-100 alert-heading mb-1 task-title ${!!task.priority && 'priority'}`} data-target="task-title">
                  {task.task ? task.task : task.templateName ? task.templateName : ''}
                </h5>
                {!!numberofTasks &&
                  <Link
                    to={{
                      pathname: URLS.TASK_DETAILS(locationId, task.templateId, 'tm'),
                      state: {
                        completedTask: task.stage === 'Completed' ? task : '',
                      }
                    }}
                    className="col col-auto text-right pl-0 text-primary"
                  >
                    {numberofTasks} <Trans i18nKey="tasks" />
                  </Link>
                }
              </div>
              {task.referenceTemplateName && !task.editable && (
                <div className="d-flex small mb-1">
                  <i className="fas fa-tasks mt-1 lineitem-icon mr-1" aria-hidden="true"></i>
                  <strong>{task.referenceTemplateName}</strong>
                </div>
              )}
              {isCompletedTask && <p className="mb-1">
                {task.assignee && <small>
                  <i className="fas fa-users" aria-hidden="true"></i>
                  <Trans i18nKey="assigned_to" />&nbsp;
                  <a href="#">
                    <img className="rounded-circle border border-primary avatar-small" src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)} style={{ width: '25px' }} />&nbsp;
                    {task.assignee}&nbsp;
                  </a>
                </small>}
              </p>}
              {((locationUserRole !== 'Owner' && locationUserRole !== 'Manager')) && !isCompletedTask && <p className="mb-1">
                {task.assignee && <small>
                  <i className="fas fa-users" aria-hidden="true"></i>
                  {isCustomJobGroupCard ? 'Group Manager' : <Trans i18nKey="assigned_by" />}&nbsp;
                  <a href="#">
                    <img className="rounded-circle border border-primary avatar-small" src={URLS.PROFILE_IMAGE_THUMB(task.assignedByUserName)} style={{ width: '25px' }} />&nbsp;
                    {task.assignedBy}&nbsp;
                  </a>
                </small>}
              </p>}
              {task.assignee && (locationUserRole === 'Owner' || locationUserRole === 'Manager') && !isCompletedTask && (
                <p className="mb-0">
                  <small>
                    <i className='fas fa-user mr-1' aria-hidden='true'></i>
                    <Trans i18nKey="assigned_to" />&nbsp;
                    <img
                      className="rounded-circle border border-primary avatar-small"
                      src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)}
                      style={{ width: '25px' }}
                    />&nbsp;
                    <a
                      className="ml-1"
                      href="#"
                      data-target="button-toggle-show-edit-assign"
                      onClick={toggleAssignModal}
                    >
                      <span>{task.assignee}</span>
                    </a>
                  </small>
                </p>
              )}
              {task?.taskRecurring?.nextOccurrenceDate && !isCustomJobGroupCard &&
                <p className="mb-0">
                  <small>
                    <i className="far fa-calendar-alt" aria-hidden="true"></i>
                    {' '}
                    {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}
                    {task.taskRecurring.recurringType && task.taskRecurring.recurringType !== 'OneTime' && <span> | {t(formatTaskRecurringType(task))}</span>}
                  </small>
                </p>
              }
              <p className="mb-0">
                {task.activityTime && <small>
                  <i className="far fa-lg fa-calendar-alt" aria-hidden="true"></i> {task.activityTime}
                </small>}
              </p>
              <div className="d-flex">
                {!!task.dueDate && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && <div>
                  <div className="d-flex small mt-2 mb-1">
                    <span><i className="ci ci-due-f lineitem-icon-custom ml-0"></i></span>
                    <a>{DateUtils.unicodeFormat(DateUtils.parseISO(task.dueDate), 'P')}
                      {task.dueDate && DateUtils.isAfter(DateUtils.parseISO(DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd')), DateUtils.parseISO(task.dueDate)) && <span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Overdue</span>}
                    </a>
                  </div>
                </div>}
              </div>
              {task.taskStartedTime && <div className="mb-1"><small><i className="far fa-calendar-alt lineitem-icon" aria-hidden="true"></i> Started: {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskStartedTime), 'P p')}</small></div>}
              {task.taskCompletedTime && <div className="mb-1"><small><i className="far fa-calendar-check lineitem-icon" aria-hidden="true"></i> Completed: {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskCompletedTime), 'P p')}</small></div>}
              {task.taskDurationTime && <div className="mb-1"><small><i className="far fa-clock lineitem-icon" aria-hidden="true"></i> Duration: {task.taskDurationTime}</small></div>}
              {task.taskApprovedTime && !isInProgressTask && <div className="mb-1"><small><i className="far fa-check lineitem-icon" aria-hidden="true"></i> Approved: {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskApprovedTime), 'P p')}</small></div>}
              {showScreenshotContent && <ScreenshotContent
                onClose={handleCloseScreenshot}
                onSubmit={handleScreenshotSubmit}
              />}
              {showTaskDetails && taskLinkData.taskLink && <div className="d-flex small align-items-start">
                <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">External link</span></span>
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <a target="_blank" className="truncate-1" rel="noreferrer" href={getQualifiedLink(taskLinkData.taskLink)}>{taskLinkData.taskLinkText}</a>
                    {/* <a className="ml-2 text-danger" href="" data-toggle="modal" data-target="#delete-link"><i className="far fa-trash-alt" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a> */}
                  </div>
                </div>
              </div>}

              {showTaskDetails && taskFilePath && <div className="d-flex small align-items-start">
                <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <a href={`/api/files/dbx/signed-read${taskFilePath}`} target="_blank" rel="noreferrer" className="truncate-1">{taskFilePath.split('/')[2]}</a>
                  </div>
                </div>
              </div>}
              {showTaskDetails &&
                <>
                  {task.taskDescription && <div className="task-detail-overflow pt-2 collapse show" id="taskDetai2">
                    <div className="d-flex small mb-1">
                      <i className="fas fa-align-left mt-1 lineitem-icon" aria-hidden="true"></i>{'  '}
                      <div dangerouslySetInnerHTML={{ __html: task.taskDescription }} className='mb-0 text-break task-description' />
                    </div>
                  </div>}
                  <div className='pt-2'>
                    <TaskImages task={task} isJob={isJob} loadImages={loadImages} editableActivityImages={isInProgressTask} hideActivityImages={true} updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks} />
                  </div>
                  {taskActivityImages.length === 0 && !!task.imageRequired && (
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
                </>
              }
              {showTaskDetails && (taskActivityImages.length !== 0 || taskFileJAPath || taskLinkJAData.taskLink) && <div className="team-member-uploads pt-3">
                <h6>Added by {task.assigneeUserName === profile.username ? 'you' : task.assignee ? task.assignee : 'Team Member'}</h6>

                {showTaskDetails && taskLinkJAData.taskLink && <div className="d-flex small align-items-start">
                  <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">External link</span></span>
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <a target="_blank" className="truncate-1" rel="noreferrer" href={getQualifiedLink(taskLinkJAData.taskLink)}>{taskLinkJAData.taskLinkText}</a>
                      {isInProgressTask && !isReadOnly && <a className="ml-2" href="#" data-toggle="modal" data-target="#edit-external-link" onClick={() => setShowLinkModal(true)}><i className="far fa-lg fa-pencil-alt" aria-hidden="true"></i> <span className="sr-only">Edit Link</span></a>}
                    </div>
                  </div>
                </div>}

                {showTaskDetails && taskFileJAPath && <div className="d-flex small align-items-start">
                  <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <a href={`/api/files/dbx/signed-read${taskFileJAPath}`} target="_blank" rel="noreferrer" className="truncate-1">{taskFileJAPath.split('/')[2]}</a>
                      {!taskFileUploading && !isReadOnly && isInProgressTask && <a className="ml-2 text-danger" href="#" data-toggle="modal" data-target="#delete-file" onClick={() => setShowFileDeleteModal(true)}><i className="far fa-trash-alt" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a>}
                      {taskFileUploading && <a className="ml-2 text-danger"><i className="far fa-spinner fa-spin" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a>}
                    </div>
                    {taskFileJAPathError && <div className="d-flex small mt-2 mb-1"><span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> File size exceeds maximum limit 50 MB.</span></div>}
                  </div>
                </div>}

                <div className="task-images pt-2">
                  {
                    !!taskActivityImages && !!taskActivityImages.length && !isLastActivityImgDelete && (
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
                            onDelete={() => deleteActivityImage(pic.name)}
                            showImageScore={idx === 0}
                            updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                          />
                        ))}
                      </>
                    )
                  }
                </div>
              </div>}
              {(isCompletedTask || isRejectedTask || isIncompleteTask) && task.modifiedDate && <p className="mb-1">
                <small>
                  <i className="fas fa-check" aria-hidden="true"></i> Last Updated: {DateUtils.unicodeFormat(DateUtils.parseISO(task.modifiedDate), 'P p')}
                </small>
              </p>}
              {lastComment?.comments?.length > 0 && lastComment?.totalCount && <p className="mb-0">
                <small>
                  <i className="far fa-comment-alt" aria-hidden="true"></i>
                  <Link onClick={handleAddComment} to='#'>{t(`${lastComment.totalCount} comment${lastComment.totalCount > 1 ? 's' : ''}`)}</Link>
                  <em className="ml-4 truncate-2"><strong>{formatFirstNameAndLastInitial(lastComment.comments[0].user)}</strong>{t(` ${lastComment.comments[0].comment}`)}</em>
                </small>
              </p>}
              <hr className="my-2" />
              <div className="text-right">
                {!isCustomJobGroupCard && !isTemplateJobGroupCard && <button
                  onClick={handleAddComment}
                  type="button"
                  data-target="button-remove"
                  className="task-c-button p-1 ml-1 btn rounded btn-outline-primary"
                >
                  <i className="far fa-comment-alt" aria-hidden="true"></i><span className="sr-only"><Trans>Add Comment</Trans></span>
                </button>}
                {isAssignedTask && !isCustomJobGroupCard && !isReadOnly &&
                  <button
                    type="button"
                    className="py-1 px-3 ml-1 btn rounded btn-outline-primary"
                    data-target="decline-task"
                    onClick={() => setShowDeclineJob(true)}
                  >
                    <Trans i18nKey="decline" />
                  </button>
                }
                {isAssignedTask && !isCustomJobGroupCard && !isReadOnly &&
                  <button
                    type="button"
                    className="py-1 px-3 ml-1 btn rounded btn-primary"
                    data-target="accept-task"
                    onClick={() => handleAcceptanceTask('Accepted')}
                  >
                    <Trans i18nKey="accept" />
                  </button>
                }
                {(isAcceptedTask || isReworkTask) && !isJob && !isReadOnly &&
                  <Button
                    className="py-1 px-3 ml-2 rounded"
                    variant="primary"
                    data-target="start-task"
                    disabled={!canStartToday}
                    onClick={handleClickStartTask}
                  >
                    <Trans i18nKey="start" />
                  </Button>
                }
                {
                  isInProgressTask && !isReadOnly && (
                    <>
                      {taskActivityImages.length === 0 && task.imageRequired === 1 &&
                        <Button
                          variant="outline-primary"
                          className="task-c-button p-1 ml-1 rounded"
                          data-target="add-image-btn"
                          onClick={() => handleAddImageButtonClick(false)}
                        >
                          <i className="fas fa-camera" aria-hidden="true"></i><span className="sr-only"><Trans>Add Pictures</Trans></span>
                        </Button>
                      }
                      {taskActivityImages.length === 0 && task.imageRequired === 2 &&
                        <Button
                          variant="outline-primary"
                          className="task-c-button p-1 ml-1 rounded"
                          data-target="add-screenshot-btn"
                          onClick={() => handleAddImageButtonClick(false)}
                        >
                          <i className="far fa-image" aria-hidden="true"></i><span className="sr-only"><Trans>Add Screenshot</Trans></span>
                        </Button>
                      }
                      <Button
                        className="py-1 px-3 ml-1 rounded"
                        variant="primary"
                        data-target="complete-task"
                        onClick={() => handleAddImageButtonClick(true)}
                      >
                        <Trans i18nKey="complete" />
                      </Button>
                    </>
                  )
                }
                {isJob &&
                  <Link
                    to={{
                      pathname: URLS.TASK_DETAILS(locationId, task.templateId, 'tm'),
                      state: {
                        completedTask: task.stage === 'Completed' ? task : '',
                        templateType: task.templateType,
                      }
                    }}
                  >
                    <Button className="py-1 px-3 ml-1 rounded" variant="outline-primary">
                      <Trans i18nKey="view_tasks" />
                    </Button>
                  </Link>
                }
                {isInProgressTask && <Button
                  type="button"
                  variant="outline-primary"
                  className="task-c-button p-1 ml-2 btn rounded"
                  data-target="button-toggle-menu"
                  onClick={() => setOpenMenuPopup(!openMenuPopup)}
                >
                  <i className="fas fa-ellipsis-v" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="menu" /></span>
                </Button>}
                {openMenuPopup && <EllipsisMenuV3
                  handler={setOpenMenuPopup}
                  isAddFileActive={!isReadOnly && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  addFile={() => handleTaskFileClick()}
                  isSetTaskLinkActive={!isReadOnly && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  setTaskLink={() => handleSetTaskLinkClick()}
                  isMember={locationUserRole === 'Member'}
                  isAddScreenshotsActive={!isReadOnly && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  handleAddScreenshotButtonClick={handleAddScreenshotButtonClick}

                  isCopyActive={false}
                  isDescriptionActive={false}
                  isAssociateActive={false}
                />}

                {!isTemplateJob && !isCustomJobGroupCard && isExpandable && <Button
                  className="task-c-button p-1 ml-1 rounded"
                  variant='outline-primary'
                  data-target="toggle-task-details"
                  onClick={handleShowTaskDetails}
                >
                  <i
                    aria-hidden="true"
                    className={classnames(
                      [
                        'fas',
                        showTaskDetails ? 'fa-chevron-up' : 'fa-chevron-down'
                      ]
                    )}
                  >
                  </i>
                  <span className="sr-only"><Trans>View Tasks</Trans></span>
                </Button>}
              </div>
            </div>

            {showAssignModal && <AssignModal
              onClose={() => setShowAssignModal(false)}
              onUpdate={updateAssign}
              show={showAssignModal}
              assignee={task.assignee}
              assigneeUserName={task.assigneeUserName}
              isJob={isJob}
              isEdit={task.assignee && (isEditable || locationUserRole === 'Owner' || locationUserRole === 'Manager')}
              task={task}
            />}

            {showNavToAssignedTaskModal && <AssignedModal
              onCancel={handleDeclinedSelfAssignStart}
              onConfirm={handleTaskAssignedToYouClick}
              show={showNavToAssignedTaskModal}
              title={isJob ? t('job_asigned_to_you') : t('task_asigned_to_you')}
              messageText={isJob ? t('job_asigned_notification') : t('task_asigned_notification')}
              secondLineText={t('work_it_now_question')}
              cancelText={t('no')}
              confirmText={t('yes')}
            />}

            {showAddImage && <AddImageModal
              show={showAddImage}
              onClose={setShowAddImage}
              onUpload={handleCompleteTask}
              task={task}
              updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
            />}
            {showTaskStart && <TaskStartModal
              show={showTaskStart}
              onClose={handleCloseTaskStart}
              onConfirm={handleStartConfirm}
            />}
            {showDeclineJob && <DeclineJobModal
              show={showDeclineJob}
              onCancel={handleCloseDeclineJob}
              onDecline={handleDeclineJobConfirm}
              isJob={isJob}
            />}
          </div>)}
      </Draggable>}
      {showLinkModal && <LinkModal
        show={showLinkModal}
        onUpdate={updateTaskLink}
        onClose={() => setShowLinkModal(false)}
        onDelete={deleteTaskLink}
        linkData={taskLinkJAData}
      />}
      {showFileDeleteModal && <FileDeleteModal
        show={showFileDeleteModal}
        onConfirm={onTaskFileJADelete}
        onCancel={() => setShowFileDeleteModal(false)}
      />}
      <input
        type="file"
        name="image"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={imageInputRef}
        onChange={handleImageInputChange}
      />

      <input
        type="file"
        name="taskFile"
        accept="image/*, application/pdf"
        style={{ display: 'none' }}
        ref={taskFileInputRef}
        onChange={handleTaskFileInputChange}
      />
    </>
  );
};
WorkerTaskCardDragable.propTypes = {
  task: PropTypes.object.isRequired,
  getLocation: PropTypes.func.isRequired,
  setFilter: PropTypes.func,
  nonGrpJobTasks: PropTypes.array,
  setNonGrpJobTasks: PropTypes.func,
  updateTaskInNonGrpJobTasks: PropTypes.func,
  isOnTaskDetailsPage: PropTypes.bool,
  updateTaskGroup: PropTypes.func,
  isReadOnly: PropTypes.bool,
  locationUserRole: PropTypes.string,
  index: PropTypes.number.isRequired,
  updateFilters: PropTypes.func,
  cardSkin: PropTypes.string,
  sortingMode: PropTypes.bool,
};

WorkerTaskCardDragable.defaultProps = {
  isReadOnly: false,
  updateFilters: () => { },
  cardSkin: '',
  sortingMode: false,

};

WorkerTaskCardDragable.displayName = 'WorkerTaskCardDragable';
export default WorkerTaskCardDragable;

