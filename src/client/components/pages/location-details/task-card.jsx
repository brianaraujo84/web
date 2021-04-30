import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import moment from 'moment';

import { useActionDispatch } from '../../../hooks';
import { postConfidenceManageObject, postConfidenceJobObject, getStandardObject, setObject, postConfidenceObject, postTaskCommunicationObject } from '../../../redux/actions/object';
import { getStandardObjectsList, removeFromList, addToList } from '../../../redux/actions/objects';
import { uploadTaskImages, copyTaskImages, insertImages, updateImageStatus, deleteFileFromDbx, uploadJobActivityImages, insertActivityImages, updateActivityImageStatus } from '../../../redux/actions/files';
import { descriptionFocused } from '../../../redux/actions/tasks-actions';
import { addToast } from '../../../redux/actions/toasts';
import { DeleteModal } from '../../shared/modal';
import * as URLS from '../../../urls';
import AssignModal from './assign-modal';
import ScheduleModal from './schedule-modal';
import RejectTaskModal from './reject-task-modal';
import RejectJobModal from './reject-job-modal';
import AssignTaskModal from './assign-task-modal';
import PriorityModal from './priority-modal';
import ScreenshotContent from './screenshot-content';
import LinkModal from './link-modal';
import RequireImageVerificationModal from './require-image-verification-modal';
import DueDateModal from './due-date-modal';
import AssignedModal from '../../shared/modal/assigned';
import TaskImages from './task-images';
import AssociateZoneModal from './associate-zone-modal';
import { getTaskImages, getJobActivityImages, uploadFileToDbxV2, getFilePathFromDbx, copyFileFromDbx } from '../../../redux/actions/files';
import { DateUtils, toBase64Array, smoothScrollToRef, dataUrlToFile, TextUtils } from '../../../utils';
import { TaskStatus, MAX_ALLOWED_IMAGES, StorageKeys, COMMENT_ADDED_EVENT, UserRole } from '../../../constants';
import { formatTaskRecurringType } from '../../../lib/task';
import EllipsisMenuV3 from '../../shared/ellipsis-menu/ellipsis-menu-v3';
import Tooltip from '../../shared/tooltip';
import { getItem } from '../../../utils/storage-utils';
import TaskStartModal from './task-start-modal';
import FileDeleteModal from './file-delete-modal';
import SimpleTaskCardSkin from './simple-task-card-skin';
import AddEquipmentModal from './add-equipment-modal';
import CompleteModal from '../../shared/modal/complete';
import TaskImage from '../../shared/task-image';
import useDebounce from '../../../hooks/useDebounce';
import RemoveModal from '../../shared/modal/remove';
import { CommentsContext } from '../../../contexts';
import DescriptionEditor from '../../shared/description-editor';

const OBJECT_TASKS = 'tasks';
const OBJECT_TASK = 'task';
const OBJECT_ASSIGN = 'assign';
const OBJECT_TRACKING = 'task/tracking';
const OBJECT_CUSTOM_JOB = 'custom';
const OBJECT_CUSTOM_JOBS = 'customJobs';
const OBJECT_CUSTOM_JOB_TASKS = 'templateTasks';
const OBJECT_TEMPLATE = 'template';
const OBJECT_COPY_CUSTOM_GROUP = 'group';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_ACCEPT = 'jobacceptance';
const OBJECT_START = 'task/start';
const OBJECT_GROUP_MANAGE = 'group/manage';
const OBJECT_TASK_LINK = 'task';
const OBJECT_DONT_SHOW_AGAIN = 'dontShowAgain';
const OBJECT_USER_PREFERENCES = 'userpreferences';
const OBJECT_GROUP = 'group';
const OBJECT_ASSIGNEE_DELETE = 'user/delete';
const OBJECT_EXPANDED_TASK_LIST = 'expandedTaskList';

let background_save = false;
let original_description = '';

const TaskCard = ({
  task,
  onRemove,
  index,
  getLocation,
  taskSummary,
  setAllCustomeJobReviewsInListCompleted,
  setNumberofCustomTasksReviewed,
  numberofCustomTasksReviewed,
  numberofCustomTasksToReview,
  customJobCompleted,
  totalTasks,
  updateTaskInNonGrpJobTasks,
  isOnTaskDetailsPage,
  disableWorkerActions,
  locationUserRole,
  isNotifyPage,
  insertCopiedTask,
  updateFilters,
  cardSkin,
  bulkSelectTaskArray,
  setBulkSelectTaskArray,
  setShowCreateBtn,
}) => {
  const { locationId, taskTemplateId, taskId, cardType } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = history.location;

  const isCustomJob = React.useMemo(() => {
    return task.templateType && 'custom' === task.templateType.toLowerCase();
  }, [task.templateType]);

  const isCustomJobGroupCard = React.useMemo(() => {
    return task.templateType && 'custom' === task.templateType.toLowerCase() && task.groupCard;
  }, [task.templateType]);

  const isTemplateJobGroupCard = React.useMemo(() => {
    return task.templateType && 'main' === task.templateType.toLowerCase() && task.groupCard;
  }, [task.templateType]);

  /*const isTemplateJob = React.useMemo(() => {
    return task.templateType && 'main' === task.templateType.toLowerCase();
  }, [task.templateType]);*/

  const isJob = React.useMemo(() => {
    return task.templateType && task.groupCard && ('main' === task.templateType.toLowerCase() || 'custom' === task.templateType.toLowerCase());
  }, [task.templateType]);

  const expandedTaskList = useSelector(state => state.expandedTaskList?.items);
  const thisTaskInExpandedTaskList = expandedTaskList?.filter(i => i.taskId === task.taskId)[0];

  const profile = useSelector(state => state.profile.data);
  const activityList = useSelector(state => state?.files?.activityList);
  const { locationName } = useSelector(state => state.loc.data);
  const taskType = isJob ? 'predefined' : 'adhoc';

  const taskImages = useSelector(state => {
    const taskId = task?.stage?.toLowerCase() === TaskStatus.copy ? task.orginalTaskId : task.taskId;
    return state.files.list && state.files.list[taskType] && state.files.list[taskType][taskId] ? state.files.list[taskType][taskId] : [];
  });
  const taskImagesLoaded = useSelector(state => (
    !!state.files.list && !!state.files.list[taskType] && !!state.files.list[taskType][task.taskId]
  ));

  const filesLoadingInprogress = useSelector(state => state.files.inprogress);

  const [taskDescription, setTaskDescription] = React.useState(task.taskDescription);
  const [lastComment, setLastComment] = React.useState(undefined);
  const [selectedForBulk, setSelectedForBulk] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState(false);
  const [showTaskDetails, setShowTaskDetails] = React.useState(!!thisTaskInExpandedTaskList);
  const [showEditTaskDescription, setShowEditTaskDescription] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [assignData, setAssignData] = React.useState(false);
  const [showEditTitle, setShowEditTitle] = React.useState(false);
  const [values, setValues] = React.useState({ task: '' });
  const [showZoneModal, setShowZoneModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [showReassignModal, setShowReassignModal] = React.useState(false);
  const [showRejectJobModal, setShowRejectJobModal] = React.useState(false);
  const [openMenuPopup, setOpenMenuPopup] = React.useState(false);
  const [showNavToAssignedTaskModal, setShowNavToAssignedTaskModal] = React.useState(false);
  const [expandReviewTask, setExpandReviewTask] = React.useState(false);
  const [customReview, setCustomReview] = React.useState(false);
  const [customJobReviewCompleted, setCustomJobReviewCompleted] = React.useState(false);
  const [customReviewCompleted, setCustomReviewCompleted] = React.useState(false);
  const [backUpImages, setbackUpImages] = React.useState({});
  const [showTaskStart, setShowTaskStart] = React.useState(false);
  const [showTaskReviewModal, setShowTaskReviewModal] = React.useState(false);
  const [showPriority, setShowPriority] = React.useState(false);
  const [showDueDate, setShowDueDate] = React.useState(false);
  const [taskFilePath, setTaskFilePath] = React.useState(false);
  const [showFileDeleteModal, setShowFileDeleteModal] = React.useState(false);
  const [taskFileUploading, setTaskFileUploading] = React.useState(false);
  const [taskFilePathError, setTaskFilePathError] = React.useState(false);
  const [showLinkModal, setShowLinkModal] = React.useState(false);
  const [taskLinkData, setTaskLinkData] = React.useState({});
  const [showRequireImageVerificationModal, setShowRequireImageVerificationModal] = React.useState(false);
  const [imageRequired, setImageRequired] = React.useState(0);
  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [openSelectHW, setOpenSelectHW] = React.useState(false);
  const [isFilePathChecked, setIsFilePathChecked] = React.useState(false);
  const [isLinkChecked, setIsLinkChecked] = React.useState(false);
  //const [taskFileJAPathError, setTaskFileJAPathError] = React.useState(false);
  const [taskFileJAPath, setTaskFileJAPath] = React.useState(false);
  const [taskLinkJAData, setTaskLinkJAData] = React.useState({});
  const [showRemoveModal, setShowRemoveModal] = React.useState(false);
  const [showScreenshotContent, setShowScreenshotContent] = React.useState(false);
  
  const { numberofTasks } = task;
  const cardRef = React.useRef(null);
  const inputTaskRef = React.useRef();
  const inputDescRef = React.useRef();
  const imageInputRef = React.useRef();
  const taskFileInputRef = React.useRef();

  const manageTask = useActionDispatch(postConfidenceManageObject(OBJECT_TASK));
  const assignTask = useActionDispatch(postConfidenceJobObject(OBJECT_ASSIGN));
  const trackingTask = useActionDispatch(postConfidenceJobObject(OBJECT_TRACKING));
  const toast = useActionDispatch(addToast);
  const getTaskImagesList = useActionDispatch(getTaskImages);
  const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);
  const cloneTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const manageCustomJob = useActionDispatch(postConfidenceJobObject(OBJECT_CUSTOM_JOB));
  const uploadImages = useActionDispatch(uploadTaskImages);
  const uploadActivityImages = useActionDispatch(uploadJobActivityImages);
  const addActivityImageToList = useActionDispatch(insertActivityImages);
  const updateActivityImageOnList = useActionDispatch(updateActivityImageStatus);
  const copyImages = useActionDispatch(copyTaskImages);
  const customTemplate = useActionDispatch(postConfidenceJobObject(OBJECT_CUSTOM_JOB));
  const getCustomJobs = useActionDispatch(getStandardObjectsList(OBJECT_CUSTOM_JOBS, 'tasks', undefined, 'location', '/cards/custom'));
  const getCustomJobTasks = useActionDispatch(getStandardObject(OBJECT_CUSTOM_JOB_TASKS, undefined, 'job/custom', '/tasks'));
  const setTemplateTasksInfo = useActionDispatch(setObject(OBJECT_CUSTOM_JOB_TASKS));
  const removeTaskFromList = useActionDispatch(removeFromList(OBJECT_TASKS));
  const addImageToList = useActionDispatch(insertImages);
  const updateImageOnList = useActionDispatch(updateImageStatus);
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));
  const acceptOrDeclineTask = useActionDispatch(postConfidenceJobObject(OBJECT_ACCEPT));
  const startTask = useActionDispatch(postConfidenceJobObject(OBJECT_START));
  const groupManage = useActionDispatch(postConfidenceObject(OBJECT_GROUP_MANAGE, undefined, 'group/manage'));
  const updateLinks = useActionDispatch(postConfidenceObject(OBJECT_TASK_LINK, undefined, 'task/links'));
  const getLinks = useActionDispatch(postConfidenceObject(OBJECT_TASK_LINK, undefined, 'task/links/list'));
  const copyTaskGroup = useActionDispatch(postConfidenceObject(OBJECT_COPY_CUSTOM_GROUP));
  const quickComplete = useActionDispatch(postConfidenceObject(OBJECT_TASK_LINK, undefined, 'task/lazycomplete'));
  const getUserPref = useActionDispatch(getStandardObject(OBJECT_USER_PREFERENCES, undefined, 'userpreferences'));
  const postUserPref = useActionDispatch(postConfidenceObject(OBJECT_DONT_SHOW_AGAIN, undefined, 'userpreferences'));
  const getLastComment = useActionDispatch(postTaskCommunicationObject(`${task.taskId}/comment/list`));
  const desFocused = useActionDispatch(descriptionFocused);
  const groupMenuUpdate = useActionDispatch(setObject('groupMenuUpdate'));
  const createGroup = useActionDispatch(postConfidenceObject(OBJECT_GROUP));
  const moveToTaskGroup = useActionDispatch(postConfidenceObject(OBJECT_GROUP));
  const removedAsignee = useActionDispatch(postConfidenceObject(OBJECT_ASSIGNEE_DELETE));
  const addToExpandedTaskList = useActionDispatch(addToList(OBJECT_EXPANDED_TASK_LIST));
  const removeFromExpandedTaskList = useActionDispatch(removeFromList(OBJECT_EXPANDED_TASK_LIST));

  const locationZones = useSelector(state => state.locationZones?.items);
  const templateTasksInfo = useSelector(state => state.templateTasks.data);
  const taskActivityImages = useSelector(state => (
    state.files.activityList && state.files.activityList[task.jobActivityId]
      && state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] ? state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] : []
  ));

  const debouncedTaskDescription = useDebounce(taskDescription, 5000);

  const { openTaskComments } = React.useContext(CommentsContext);

  const updateSideGroupList = () => {
    groupMenuUpdate({ update: true });
    setTimeout(() => {
      groupMenuUpdate({ update: undefined });
    }, 500);
  };

  const handleRemove = async () => {
    task.isDeleted = true;
    setShowDeleteModal(false);
    setTaskFilePath(false);
    setTaskLinkData({});
    if (task.templateType === 'Custom' && task.groupCard) {
      const data = {
        locationId,
        templateId: task.templateId,
        action: 'delete',
      };
      await customTemplate(data);
      await updateTaskInNonGrpJobTasks(task.taskId, task.templateId, true);
      onRemove();
    } else if (!isCloneTask) {
      const data = {
        locationId,
        action: 'delete',
        taskId: task.taskId,
      };
      if (task.taskType === 'CustomGroupTask' && !task.groupCard) {
        onRemove(task);
      }
      await manageTask(data);
      await updateTaskInNonGrpJobTasks(task.taskId, task.templateId, true);
      if (task.taskType !== 'CustomGroupTask') {
        onRemove();
      }
      //getCustomJobsOrTasks();
      //getLocation(locationId);
    } else if (isCloneTask) {
      onRemove();
      if (!taskSummary.templateId) {
        removeTaskFromList(index);
      } else {
        const copyTemplateTasksInfo = { ...templateTasksInfo };
        copyTemplateTasksInfo.tasks.splice(index, 1);
        setTemplateTasksInfo(copyTemplateTasksInfo);
      }
      return;
    }
    toast(task.groupCard ? t('Group deleted.') : t('Task deleted.'));
  };

  const updateTasks = (isRemove = false) => {
    if (!isRemove) {
      updateTaskInNonGrpJobTasks(task.taskId, task.templateId);
    }
    getCustomJobsOrTasks();
    getLocation(locationId);
  };

  const getCustomJobsOrTasks = () => {
    if (taskTemplateId) {
      getCustomJobTasks(taskTemplateId);
    } else {
      getCustomJobs(locationId);
    }
  };

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const updateSchedule = (data) => {
    if (isCloneTask) {
      updateCloneTask(data);
    } else {
      setScheduleData(data);
    }
    setShowScheduleModal(false);
  };

  const handleUpdateTask = async (data) => {
    if (task.groupCard && (task.templateType === 'Custom' || task.templateType === 'Main')) {
      await groupManage(data);
    } else {
      await manageTask(data);
    }
    setScheduleData(false);
    updateTasks();
  };

  const updateAssign = (data) => {
    if (isCloneTask) {
      updateCloneTask(data);
    } else {
      setAssignData(data);
    }
    setShowAssignModal(false);
  };

  const handleStartTask = async () => {
    task.stage = 'In Progress';
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
    };
    await startTask(data);
    updateTasks();
  };

  const updateCloneTask = (data) => {
    if (data.userName) {
      task.assignee = data.assigneeName;
      task.assigneeMobile = data.assigneeMobile;
      task.assigneeName = data.assigneeName;
      task.assigneeUserName = data.userName;
    } else if (data.date) {
      task.taskRecurring.nextOccurrenceDate = DateUtils.unicodeFormat(data.date, `yyyy-MM-dd ${data.startTime}`);
      task.startTime = data.startTime;
      task.endTime = data.endTime;
      task.recurringType = data.repeat;
    }
  };

  const handleAssignTask = async (data, skipUpdate = false) => {
    if (isCustomJobGroupCard) {
      task.jobManager = data.assigneeName;
      task.jobManagerUserName = data.userName;
      await updateCustomJob(data);
    } else {
      await assignTask(data);
      if (!skipUpdate) {
        updateTasks();
      }
    }
    setAssignData(false);
  };

  const updateCustomJob = async (data) => {
    const payload = {
      locationId,
      templateId: task.templateId,
      jobManager: data.assignee,
      templateName: task.templateName,
    };
    await customTemplate(payload);
    updateTasks();
  };

  const handleConvertGroup = async () => {
    const customJobData = {
      templateName: task.task,
      locationId,
      jobManager: profile.username,
    };
    try {
      const res = await createGroup(customJobData);
      const data = {
        locationId,
        targetTemplateId: res.templateId,
        templateType: 'Custom',
        taskIds: [task.taskId],
      };
      moveToTaskGroup(data);
      history.push(URLS.TASK_DETAILS(locationId, res.templateId), { search: TextUtils.generateQS(task) });
    } catch (e) {
      toast(t('error'));
    }
  };

  const handleCopy = () => {
    const copyTask = { ...task, assigneeUserName: '', assignee: '' };
    copyTask.task = t('copy') + ' - ' + task.task;
    copyTask.stage = 'Copy';
    copyTask.taskId = new Date().getTime();
    copyTask.orginalTaskId = task.taskId;
    copyTask.linkData = taskLinkData;
    copyTask.fileData = taskFilePath;

    if (copyTask.taskRecurring) {
      const taskRecurring = { ...copyTask.taskRecurring };
      const date = new Date();
      const copyTR = {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: taskRecurring.repeat || 'OneTime',
        startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
        startTime: DateUtils.roundToNextMinutes(date),
        endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(date, 30)),
        dayofWeek: taskRecurring.repeat === 'Weekly' ? DateUtils.getDayOfWeek(date) : undefined,
        dayofMonth: ['Monthly', 'Yearly'].indexOf(taskRecurring.repeat) > -1 ? DateUtils.getDayOfMonth(date) : undefined,
        monthofYear: taskRecurring.repeat === 'Yearly' ? DateUtils.getMonthOfYear(date) : undefined,
        nextOccurrenceDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd') + ' ' + DateUtils.roundToNextMinutes(date),
      };
      copyTask.taskRecurring = { ...taskRecurring, ...copyTR };
    }

    if (isJob) {
      copyTask.templateName = t('copy') + ' - ' + task.templateName;
      copyTask.task = copyTask.templateName;
    }
    if (!taskSummary.templateId) {
      insertCopiedTask(copyTask, index);
    } else {
      const copyTemplateTasksInfo = { ...templateTasksInfo };
      copyTemplateTasksInfo.tasks.splice(index + 1, 0, copyTask);
      setTemplateTasksInfo(copyTemplateTasksInfo);
    }
  };

  const addDevice = () => {
    setOpenSelectHW(true);
    /*history.push(URLS.ADD_DEVICE, {
      locationId,
      templateId
    });*/
  };

  const onEqSelected = () => {

  };

  const saveClonedTask = async () => {
    if (taskSummary.templateId || !isJob) {
      let data = {};
      if (taskSummary.templateId) {
        const date = DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate);
        const taskRecurring = {
          timeZone: DateUtils.getCurrentTZName(),
          recurringType: task.taskRecurring.recurringType || 'OneTime',
          startDate: task.taskRecurring.nextOccurrenceDate,
          startTime: task.taskRecurring.startTime,
          endTime: task.taskRecurring.endTime,
          dayofWeek: task.taskRecurring.recurringType === 'Weekly' ? DateUtils.getDayOfWeek(date) : undefined,
          dayofMonth: ['Monthly', 'Yearly'].indexOf(task.taskRecurring.recurringType) > -1 ? DateUtils.getDayOfMonth(date) : undefined,
          monthofYear: task.recurringType === 'Yearly' ? DateUtils.getMonthOfYear(date) : undefined,
          everyMinute: task.taskRecurring?.everyMinute,
          everyHour: task.taskRecurring?.everyHour,
        };

        data = {
          locationId,
          templateId: taskSummary.templateId,
          task: values.task || task.task,
          taskDescription: taskDescription || task.taskDescription,
          locationZoneId: task.locationZoneId,
          taskRecurring,
        };
      } else {
        const date = DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate);

        const taskRecurring = {
          timeZone: DateUtils.getCurrentTZName(),
          recurringType: task.recurringType || 'OneTime',
          startDate: task.taskRecurring.nextOccurrenceDate,
          startTime: task.taskRecurring.startTime,
          endTime: task.taskRecurring.endTime,
          dayofWeek: task.taskRecurring.recurringType === 'Weekly' ? DateUtils.getDayOfWeek(date) : undefined,
          dayofMonth: ['Monthly', 'Yearly'].indexOf(task.taskRecurring.recurringType) > -1 ? DateUtils.getDayOfMonth(date) : undefined,
          monthofYear: task.recurringType === 'Yearly' ? DateUtils.getMonthOfYear(date) : undefined,
          everyMinute: task.taskRecurring?.everyMinute,
          everyHour: task.taskRecurring?.everyHour,
        };

        data = {
          locationId,
          task: values.task || task.task,
          taskDescription: taskDescription || task.taskDescription,
          locationZoneId: task.locationZoneId,
          taskRecurring,
          imageRequired,
        };
        if (task.taskType === 'CustomGroupTask') {
          data.templateId = task.templateId;
        }
      }

      const { taskId } = await manageTask(data);
      task.taskId = taskId;

      setShowEditTitle(false);
      task.stage = task.assigneeUserName ? 'Assigned' : 'Open';
      if (task.assigneeUserName) {
        const assignData = {
          taskId: taskId,
          locationId,
          status: 'assigned',
          assignee: task.assigneeUserName,
        };
        await assignTask(assignData);
      }
      toast(t('task_created'));
      try {
        if (taskFilePath) {
          copyFileFromDbx(`${task.orginalTaskId}-adhoc`, `${taskId}-adhoc`);
        }
        if (taskLinkData.taskLink) {
          updateTaskLink({ ...taskLinkData, taskLinkId: undefined });
        }
        setIsLinkChecked(false);
        setIsFilePathChecked(false);
        await copyImages(task.orginalTaskId, taskType, taskId);
      } catch (e) {
        // nothing to copy
      }
      loadImages();
    } else {
      const cloneTemplateData = {
        templateId: task.templateId,
        templateName: values.task || task.templateName,
        locationId
      };

      await cloneTemplate(cloneTemplateData);
      toast(t('job_created'));
    }
    setShowEditTitle(false);
    updateTaskInNonGrpJobTasks(task.taskId, task.templateId, false, false, false, true);
    window.scrollTo(0, 0);
  };

  const loadImages = React.useCallback(async () => {
    await getTaskImagesList(task.taskId, taskType);
    if (task.jobActivityId && task.taskActivityTrackerId) {
      await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
    }
  }, [task, taskType]);

  const checkFiles = () => {
    setIsLinkChecked(true);
    if (!isFilePathChecked) {
      getTaskFilePath(task.taskId, loadImages);
      setIsFilePathChecked(true);
    }
  };

  const loadOnExpandDetails = () => {
    if (task.groupCard) {
      return;
    }
    if (showTaskDetails) {
      !isLinkChecked && (getTaskLink().then(() => setIsLinkChecked(true)));
      !isFilePathChecked && (getTaskFilePath(task.taskId).then(() => setIsFilePathChecked(true)));
    } else {
      if (!isLinkChecked && !task.taskDescription) {
        getTaskLink(checkFiles);
      }
    }
  };

  const handleAddImageButtonClick = React.useCallback(() => {
    imageInputRef.current.click();
    //scrollToVisibility();
    handleExpand(true);
  }, []);

  const handleAddScreenshotButtonClick = React.useCallback(() => {
    if (window.electron) {
      window.electron.send('take-partial-screenshot', task.taskId);
    } else {
      setShowScreenshotContent(true);
    }
  }, []);

  const handleImageInputChange = React.useCallback(async ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    const imageFile = files[0];
    imageInputRef.current.value = null;
    const values = await toBase64Array([imageFile]);
    const images = values.reduce((acc, cur) => {
      acc.push({ ...cur.value, imageName: `image_${Date.now()}.${cur?.value?.extension}` });
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

    addImageToList(task.taskId, 'adhoc', insertImages);
    await uploadImages(images, task.taskId, 'adhoc');
    updateImageOnList(task.taskId, 'adhoc', images[0].imageName);
  }, [task.taskId, uploadImages, loadImages]);

  const handleTaskFileClick = React.useCallback(() => {
    taskFileInputRef.current.click();
    handleExpand(true);
  }, []);

  const preparePaths = (taskId, fileType, fileNameStr, isActivity) => {
    const folderName = isActivity ? `${task.taskId}-adhoc-${task.jobActivityId}` : `${task.taskId}-adhoc`;
    const fileName = `${fileNameStr || task.taskId}${fileType ? '.' + fileType : ''}`;
    const fullPath = `task-files/${folderName}/${fileName}`;
    return { folderName, fileName, fullPath };
  };

  const handleTaskFileInputChange = async ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    const MB_50 = 50000000;
    const taskFile = files[0];
    if (taskFile.size > MB_50) {
      setTaskFilePathError(true);
      return;
    } else {
      setTaskFilePathError(false);
    }
    taskFileInputRef.current.value = null;
    const fileType = taskFile.name.substr(taskFile.name.lastIndexOf('.') + 1) || taskFile.type.split('/')[1];
    const fileName = taskFile.name.substr(0, taskFile.name.lastIndexOf('.'));
    const path = preparePaths(task.taskId, fileType, fileName);
    setTaskFilePath(`/${path.folderName}/${path.fileName}`);
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

  const onTaskFileDelete = () => {
    const path = preparePaths(task.taskId);
    const fileType = taskFilePath.split('/');
    setShowFileDeleteModal(false);
    setTaskFilePath(false);
    deleteFileFromDbx(path.folderName, fileType[2]);
  };

  const onAssign = () => {
    getContacts(locationId);
    setShowAssignModal(show => !show);
  };

  const handleShowEditTask = () => {
    handleDescriptionEdit(false);
    setShowEditTitle(true);
    window.setTimeout(() => {
      inputTaskRef.current.focus();
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    setValues(v => ({ ...v, [name]: value }));
  };

  const onTitleKeyDown = (e) => {
    if (e.key === 'Enter' && values.task) {
      handleSaveTitle();
    }
  };

  const handleSaveTitle = async () => {
    const { task: taskTitle = '' } = values;
    const { templateType } = task;
    setShowEditTitle(false);
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
      task: taskTitle,
    };
    if (task.groupCard && (task.templateType === 'Custom' || task.templateType === 'Main')) {
      task.templateName = taskTitle;
      const customJobData = {
        templateId: task.templateId,
        templateType: task.templateType,
        templateName: taskTitle,
        templateDescription: task.templateDescription,
        jobManagerUserName: task.assigneeUserName,
        taskRecurring: task.taskRecurring,
      };
      await groupManage(customJobData);
    }
    if (('Todo' === templateType || taskTemplateId || !task.groupCard) && !task.custom) {
      task.task = taskTitle;
      await manageTask(data);
      if (task.taskType === 'CustomGroupTask') {
        updateTasks();
      }
      toast(t('title_upd'));
    } else {
      task.templateName = taskTitle;
      toast(t('title_upd'));
    }
    updateSideGroupList();
  };

  const handleCancelTitle = () => {
    setShowEditTitle(false);
  };

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

  const handleShowEditDescription = () => {
    setShowEditTitle(false);
    handleExpand(true);
    handleDescriptionEdit(true);
  };

  const handleSaveDescription = async () => {
    if (!taskDescription) {
      handleDescriptionEdit(false);
      return;
    }
    const date = task.nextOccurrenceDate ? DateUtils.parseISO(task.nextOccurrenceDate) : new Date();
    const data = {
      ...task,
      taskDescription,
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: task.recurringType,
        startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
        startTime: task.startTime,
        endTime: task.endTime,
        dayofWeek: task.recurringType === 'Weekly' ? DateUtils.getDayOfWeek(date) : undefined,
        dayofMonth: ['Monthly', 'Yearly'].indexOf(task.recurringType) > -1 ? DateUtils.getDayOfMonth(date) : undefined,
        monthofYear: task.recurringType === 'Yearly' ? DateUtils.getMonthOfYear(date) : undefined,
        everyMinute: task.taskRecurring?.everyMinute,
        everyHour: task.taskRecurring?.everyHour,
      }
    };
    await manageTask(data);
    if (!background_save) {
      handleDescriptionEdit(false);
      updateTasks();
      toast(t('desc_updated'));
    }
    background_save = false;
  };

  const handleTaskTaking = async (type) => {
    const data = {
      taskActivityTrackerId: task.taskActivityTrackerId,
      jobActivityId: task.jobActivityId,
      status: type,
    };
    await trackingTask(data);
    if (type === 'Completed' && task.assignedByUserName === task.assigneeUserName) {
      toast(t('Task completed.'), 3000, t('View completed tasks'), handleToastComplete);
    } else if (type === 'Completed') {
      // toast(t('Task completed.'), 3000);
      setShowTaskReviewModal(true);
    } else {
      updateTasks();
    }
  };

  const changeFiltersTo = (type) => {
    updateFilters(type);
    setShowTaskReviewModal(false);
  };

  const openRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleRejectTask = async () => {
    await handleTaskTaking('Rejected');
    updateTasks();
    setShowRejectModal(false);
  };

  const handleJobAcceptance = async (type) => {
    await handleTaskTaking(type);
    setShowRejectJobModal(false);
    toast(type === 'Rejected' ? t('job_marked_not_required') : t('job_assigned'));
  };

  const openReassignModal = () => {
    setShowReassignModal(true);
  };

  const handleReassignTaking = async (values) => {
    const { taskRecurring = {} } = task;
    const date = taskRecurring && taskRecurring.date ? DateUtils.parseISO(taskRecurring.date) : new Date();
    let recurringData = [];
    if (taskRecurring?.repeat?.indexOf('-') > -1) {
      recurringData = taskRecurring.repeat.split('-');
      taskRecurring.repeat = recurringData[0] === 'everyMinute' ? recurringData[0] : 'Hourly';
    }
    const data = {
      locationId,
      task: values.task,
      taskDescription: values.taskDescription,
      assignee: task.assigneeUserName,
      status: 'Rework',
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: taskRecurring.repeat || 'OneTime',
        startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
        startTime: DateUtils.roundToNextMinutes(new Date()),
        endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
        dayofWeek:
          taskRecurring.repeat === 'Weekly'
            ? DateUtils.getDayOfWeek(date)
            : undefined,
        dayofMonth:
          ['Monthly', 'Yearly'].indexOf(taskRecurring.repeat) > -1
            ? DateUtils.getDayOfMonth(date)
            : undefined,
        monthofYear:
          taskRecurring.repeat === 'Yearly'
            ? DateUtils.getMonthOfYear(date)
            : undefined,
        [recurringData[0]]: recurringData[1],
      },
    };
    if (taskSummary.templateType === 'Todo') {
      data.templateId = taskSummary.templateId;
      data.taskRecurring = {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: 'OneTime',
        startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
        startTime: DateUtils.roundToNextMinutes(new Date()),
        endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
        dayofWeek: task.taskRecurring.recurringType === 'Weekly' ? DateUtils.getDayOfWeek(date) : undefined,
        dayofMonth: ['Monthly', 'Yearly'].indexOf(task.taskRecurring.recurringType) > -1 ? DateUtils.getDayOfMonth(date) : undefined,
        monthofYear: task.taskRecurring.recurringType === 'Yearly' ? DateUtils.getMonthOfYear(date) : undefined,
      };
    }
    const { taskId, templateId } = await manageTask(data);
    copyImages(task.taskId, taskType, taskId);
    if (taskId && templateId) {
      const data = {
        status: 'Rework',
        reworkTaskId: taskId,
        taskActivityTrackerId: task.taskActivityTrackerId,
      };
      await trackingTask(data);
      const { photos } = values;
      if (photos && photos.length) {
        const values = await toBase64Array(photos);
        const files = values.reduce((acc, cur) => {
          acc.push(cur.value);
          return acc;
        }, []);

        await uploadImages(files, taskId, 'adhoc');
      }
      if (isOnTaskDetailsPage) {
        setShowReassignModal(false);
        setShowRejectModal(false);
      } else if (pathname.includes('/location/')) {
        updateTaskInNonGrpJobTasks(taskId, task.templateId, false, false, task.taskId);
      } else if (pathname.includes('/location-notify')) {
        history.push(URLS.NOTIFY_OWNER_TASK_GRP(locationId, cardType, taskId, templateId));
        window.location.reload();
      } else {
        history.push(URLS.LOCATION(locationId));
      }
      setShowReassignModal(false);
      setShowRejectModal(false);
    }
  };

  const handleCustomeJobReview = async () => {
    toast(t('Task marked as done.'));
    setNumberofCustomTasksReviewed(numberofCustomTasksReviewed + 1);
    handleExpand(false);
    setCustomJobReviewCompleted(true);
  };

  const handleExpandTaskForReview = () => {
    setExpandReviewTask(true);
    handleExpand(true);
  };

  const handleShowTaskDetails = async () => {
    handleExpand(!showTaskDetails);
  };

  const handleAddZoneClick = () => {
    setShowZoneModal(true);
  };

  const associateZoneToTask = async (selectedZoneId) => {
    const date = task.nextOccurrenceDate ? DateUtils.parseISO(task.nextOccurrenceDate) : new Date();
    const data = {
      templateId: task.templateId,
      templateType: task.templateType,
      taskId: task.taskId,
      task: task.task,
      taskDescription: task.taskDescription,
      locationZoneId: selectedZoneId,
      stage: task.stage,
      priority: task.priority,
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: task.recurringType,
        startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
        startTime: task.startTime,
        endTime: task.endTime,
      }
    };
    if (task.custom) {
      const customJobData = {
        templateId: task.templateId,
        templateName: task.templateName,
        locationId,
        createdBy: profile.username,
        jobManager: task.jobManager,
        locationZoneId: selectedZoneId,
      };
      await manageCustomJob(customJobData);
    } else {
      await manageTask(data);
    }
    updateTasks();
    setShowZoneModal(false);
    toast(t('task_assoc'));
  };

  const isCompletedTask = React.useMemo(() => {
    return task.stage && TaskStatus.completed === task.stage.toLowerCase();
  }, [task.stage]);

  const isIncompleteTask = React.useMemo(() => {
    return task.stage && TaskStatus.incomplete === task.stage.toLowerCase();
  }, [task.stage]);

  const handleCloseTaskStart = () => {
    setShowTaskStart(false);
  };

  const handleStartConfirm = () => {
    setShowTaskStart(false);
    handleStartTask();
  };

  const handleReviewJob = () => {
    if (task.custom === true) {
      history.push(URLS.TASK_DETAILS(locationId, task.templateId), {
        customReview: true,
        search: TextUtils.generateQS(task),
        state: { templateType: task.templateType }
      });
    } else {
      if (!cardType) {
        history.push(URLS.TASK_DETAILS(locationId, task.templateId), {
          reviewing: true,
          search: TextUtils.generateQS(task),
          state: { templateType: task.templateType }
        });
      }
      setExpandReviewTask(true);
    }
  };

  const toggleAssignModal = (event) => {
    event.preventDefault();
    setShowAssignModal(show => !show);
    getContacts(locationId);
  };

  const toggleScheduleModal = (event) => {
    event.preventDefault();
    setShowScheduleModal(show => !show);
  };

  const handleTaskAssignedToYouClick = () => {
    task.stage = 'In Progress';
    setShowNavToAssignedTaskModal(false);
    handleStartTask();
    if (pathname.includes('/location-my')) {
      setShowNavToAssignedTaskModal(false);
    } else if (pathname.includes('/location-notify')) {
      history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
    } else {
      history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
    }
  };

  const handleAcceptanceTask = async (acceptance) => {
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
      stage: acceptance,
    };
    await acceptOrDeclineTask(data);
    updateTasks();
  };

  const handleJobAssignedToYouClick = async () => {
    task.stage = 'In Progress';
    setShowNavToAssignedTaskModal(false);
    handleStartTask();
    if (isTemplateJobGroupCard) {
      history.push(URLS.TASK_DETAILS(locationId, task.templateId, 'tm'), {
        search: TextUtils.generateQS(task),
        state: { templateType: task.templateType }
      });
    }
  };

  const updatePriority = async (values) => {
    setShowPriority(false);
    if (values.selectedPriority === 0) {
      task.priority = null;
    } else {
      task.priority = values.selectedPriority;
    }
    await manageTask(task);
    updateTasks();
  };

  const updateDueDate = async (values) => {
    setShowDueDate(false);
    task.dueDate = DateUtils.unicodeFormat(values.dueDate, 'yyyy-MM-dd');
    await manageTask(task);
    updateTasks();
  };

  const updateTaskLink = async (values) => {
    setShowLinkModal(false);
    handleExpand(true);
    setTaskLinkData({ ...values });
    const data = {
      taskId: task.taskId,
      jobActivityId: task.jobActivityId,
      taskActivityTrackerId: task.taskActivityTrackerId,
      taskLinks: [
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
    setTaskLinkData({});
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

  const handleSetTaskLinkClick = () => {
    setShowLinkModal(true);
  };

  const handleRequireVerificationClick = () => {
    setShowRequireImageVerificationModal(true);
  };

  const handleRequireVerificationSelectItem = async (value) => {
    setImageRequired(value);
    const data = {
      taskId: task.taskId,
      imageRequired: value,
    };
    setShowRequireImageVerificationModal(false);
    await manageTask(data);
    updateTasks();
  };

  const getQualifiedLink = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const handleClickStartTask = () => {
    if (getItem(StorageKeys.TASK_START_SHOW_KEY)) {
      handleStartTask();
    } else {
      setShowTaskStart(true);
    }
  };

  const canStartToday = React.useMemo(() => {
    return task?.taskRecurring?.nextOccurrenceDate && !moment(task?.taskRecurring?.nextOccurrenceDate).isAfter(new Date(), 'day');
  }, [task.taskRecurring]);

  const isAcceptedTask = React.useMemo(() => {
    return !isJob && task.stage && TaskStatus.accepted === task.stage.toLowerCase();
  }, [task.stage, isJob]);

  const isOpenTask = React.useMemo(() => {
    return task.stage && TaskStatus.open === task.stage.toLowerCase();
  }, [task.stage]);

  const isReviewTask = React.useMemo(() => {
    return task.stage && TaskStatus.review === task.stage.toLowerCase();
  }, [task.stage]);

  const isInProgressTask = React.useMemo(() => {
    return task.stage && TaskStatus.inProgress === task.stage.toLowerCase();
  }, [task.stage]);

  const isReworkTask = React.useMemo(() => {
    return task.stage && TaskStatus.rework === task.stage.toLowerCase();
  }, [task.stage]);

  const isCloneTask = React.useMemo(() => {
    return task.stage && TaskStatus.copy === task.stage.toLowerCase();
  }, [task.stage]);

  const isDeclined = React.useMemo(() => {
    return task.stage && TaskStatus.declined === task.stage.toLowerCase();
  });

  const isRejectedTask = React.useMemo(() => {
    return task.stage && TaskStatus.rejected === task.stage.toLowerCase();
  }, [task.stage]);

  const isAssignedTask = React.useMemo(() => {
    return task.stage && TaskStatus.assigned === task.stage.toLowerCase();
  }, [task.stage]);

  const cardColor = React.useMemo(() => {
    return isReviewTask ? 'success' : isOpenTask ? 'secondary' : isCloneTask ? 'info' : isReworkTask ? 'warning' : isDeclined ? 'danger' : (isCompletedTask || isRejectedTask || isIncompleteTask) ? 'dark' : 'primary';
  }, [isOpenTask, isReviewTask, isReworkTask, isCloneTask, task.stage]);

  const isEditable = React.useMemo(() => {
    return task.stage && [TaskStatus.inProgress, TaskStatus.review].indexOf(task.stage.toLowerCase()) === -1;
  }, [task.stage]);

  const associatedZone = React.useMemo(() => {
    return locationZones && locationZones.find((locationZone) => locationZone.id === task.locationZoneId);
  }, [locationZones, task.locationZoneId]);

  const isExpandable = React.useMemo(() => {
    return taskLinkData.taskLink || taskLinkJAData.taskLink || taskFilePath || taskFileJAPath || task.taskDescription || (taskImages.length > 0 || backUpImages.length > 0);
  }, [taskLinkData, taskLinkJAData, taskFilePath, taskFileJAPath, task.taskDescription, taskImages, backUpImages]);

  React.useEffect(() => {
    if (task) {
      const { task: taskTitle = '', templateName } = task;
      setValues({ task: (taskTitle || templateName) });
    }
    if (taskId && task && taskId === task.taskId.toString()) {
      if (isJob) {
        handleReviewJob();
      } else {
        handleExpandTaskForReview();
      }
    }
  }, [task]);

  React.useEffect(() => {
    if (!scheduleData) {
      return;
    }
    let recurringData = [];
    if (scheduleData.repeat?.indexOf('-') > -1) {
      recurringData = scheduleData.repeat.split('-');
      scheduleData.repeat = recurringData[0] === 'everyMinute' ? recurringData[0] : 'Hourly';
    }
    const data = {
      taskId: task.taskId, //required in case of Task
      templateId: task.templateId || taskTemplateId, //required in case of Job
      locationId, //required in case of Job
      task: task.task,
      taskDescription: task.taskDescription,
      priority: task.priority,
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: scheduleData.repeat || 'OneTime',
        startDate: DateUtils.unicodeFormat(scheduleData.date, 'yyyy-MM-dd'),
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        dayofWeek: scheduleData.repeat === 'Weekly' ? DateUtils.getDayOfWeek(scheduleData.date) : undefined,
        dayofMonth: ['Monthly', 'Yearly'].indexOf(scheduleData.repeat) > -1 ? DateUtils.getDayOfMonth(scheduleData.date) : undefined,
        monthofYear: scheduleData.repeat === 'Yearly' ? DateUtils.getMonthOfYear(scheduleData.date) : undefined,
        [recurringData[0]]: recurringData[1],
      }
    };
    if (task.groupCard && (task.templateType === 'Custom' || task.templateType === 'Main')) {
      const groupData = {
        templateId: task.templateId,
        templateType: task.templateType,
        templateName: task.templateName,
        templateDescription: task.templateDescription,
        jobManagerUserName: task.assigneeUserName,
        taskRecurring: { ...data.taskRecurring }
      };
      handleUpdateTask(groupData);
    } else {
      handleUpdateTask(data);
    }
  }, [scheduleData]);

  const handleTaskGroupRouting = () => {
    if ((isOwnerOrManager()) && (task.assigneeUserName !== profile.username || isReviewTask)) {
      history.push(URLS.TASK_DETAILS(locationId, task.templateId), {
        search: TextUtils.generateQS(task),
        state: { templateType: task.templateType }
      });
    } else {
      history.push(URLS.TASK_DETAILS(locationId, task.templateId, 'tm'), {
        search: TextUtils.generateQS(task),
        state: { templateType: task.templateType }
      });
    }
  };

  const handleCopyGroupClick = async () => {
    const data = {
      sourceTemplateId: task.templateId,
      templateName: `Copy - ${task.templateName}`,
      locationId,
      templateType: task.templateType,
    };
    const { tasks: originalTasks } = await getCustomJobTasks(task.templateId);
    const { templateId: CopiedTemplateId } = await copyTaskGroup(data);
    const { tasks } = await getCustomJobTasks(CopiedTemplateId);
    tasks.sort((i1, i2) => i1.sequenceOrder - i2.sequenceOrder);
    originalTasks.sort((i1, i2) => i1.sequenceOrder - i2.sequenceOrder);
    originalTasks.forEach(async (item, index) => {
      copyImages(item.taskId, 'adhoc', tasks[index].taskId);
      copyFileFromDbx(`${item.taskId}-adhoc`, `${tasks[index].taskId}-adhoc`);
    });
    history.push(URLS.TASK_DETAILS(locationId, CopiedTemplateId), {
      search: TextUtils.generateQS(task),
      state: { templateType: 'Custom' }
    });
  };

  const handleToastComplete = async () => {
    changeFiltersTo('Completed');
  };
  
  const handleQuickComplete = async () => {
    setShowCompleteModal(false);
    task.stage = 'Completed';
    updateTaskInNonGrpJobTasks(task.taskId, task.templateId, 'complete');
    await quickComplete({ taskId: task.taskId });
    getUserPref();
    updateTasks('complete');
    toast(t('Task completed.'), 3000, t('View completed tasks'), handleToastComplete);
  };

  const handleQuickCompleteClick = () => {
    if (profile.quickCompleteTaskOption === false) {
      task.stage = 'Completed';
      handleQuickComplete();
    } else if (profile.quickCompleteTaskOption === true) {
      setShowCompleteModal(true);
    } else if (profile.quickCompleteTaskOption === undefined) {
      setShowCompleteModal(true);
      getUserPref();
    }
  };

  const formatFirstNameAndLastInitial = (name) => {
    const names = name.split(' ');
    return `${names[0]} ${names[1].slice(0, 1)}`;
  };

  const handleAddComment = () => {
    openTaskComments({
      locationId,
      locationName,
      task,
    });
    // history.push(URLS.TASK_COMMENTS(locationId, task.templateId, task.taskId));
  };

  const handleDiscardDescription = () => {
    background_save = true;
    setTaskDescription(original_description);
    handleExpand(false);
    handleDescriptionEdit(false);
    handleSaveDescription();
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
      assigneeName: assignData.assigneeName,
      userName: assignData.userName,
    };
    task.stage = 'Assigned';
    task.assigneeUserName = assignData.userName;
    task.assignee = assignData.assigneeName;
    handleAssignTask(data);
    if (data.assignee === profile.username && !isCustomJobGroupCard) {
      task.stage = 'Accepted';
      task.assigneeUserName = assignData.userName;
      task.assignee = assignData.assigneeName;
      setShowNavToAssignedTaskModal(true);
    }
  }, [assignData]);

  React.useEffect(() => {
    if (isCloneTask) {
      setShowEditTitle(true);
      if (task.linkData) {
        setTaskLinkData(task.linkData);
      }
      if (task.fileData) {
        setTaskFilePath(task.fileData);
      }
      // Wait till "expand" animation is finished
      setTimeout(() => {
        // Scroll into view if needed
        scrollIntoView(cardRef.current, {
          block: 'end',
          scrollMode: 'if-needed',
        });
      }, 50);
    }
  }, [isCloneTask]);

  React.useEffect(() => {
    if (showTaskDetails && !taskImagesLoaded) {
      loadImages();
    }
    loadOnExpandDetails();
  }, [showTaskDetails]);

  React.useEffect(() => {
    if (totalTasks === 1) {
      Tooltip.show('task_update_startdate', 'bottom').then(() => {
        if (isOpenTask) {
          Tooltip.show('task_add_assignee', 'bottom');
        }
      });
    }
    //loadImages();
  }, []);

  React.useEffect(() => {
    if (showEditTaskDescription) {
      inputDescRef.current && inputDescRef.current.focus();
      original_description = task.taskDescription;
    }
  }, [showEditTaskDescription]);

  React.useEffect(() => {
    if (activityList && activityList[task.jobActivityId] && activityList[task.jobActivityId][task.taskActivityTrackerId]) {
      setbackUpImages(activityList[task.jobActivityId][task.taskActivityTrackerId]);
    }
  }, [activityList]);

  React.useEffect(() => {
    if (history?.location?.state?.reviewing && history?.location.state?.reviewing === true) {
      setExpandReviewTask(true);
    } if (history?.location?.state?.customReview && history?.location.state?.customReview === true) {
      setCustomReview(true);
    } if (history?.location?.state?.allCustomeJobReviewsInListCompleted) {
      setCustomReviewCompleted(true);
    }
  }, [history?.location?.state]);

  React.useEffect(() => {
    if ((numberofCustomTasksReviewed === numberofCustomTasksToReview) && numberofCustomTasksReviewed !== 0 && setAllCustomeJobReviewsInListCompleted) {
      setAllCustomeJobReviewsInListCompleted(true);
    }
  }, [numberofCustomTasksReviewed]);

  React.useEffect(() => {
    if (customJobCompleted) {
      handleTaskTaking('Completed');
    }
  }, [customJobCompleted]);

  React.useEffect(() => {
    if (task) {
      setImageRequired(task.imageRequired || 0);
    }
  }, [task]);

  const loadLastComment = async () => {
    const response = await getLastComment({ start: 0, limit: 1 });
    setLastComment(response);
  };

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

  React.useEffect(() => {
    const handleScreenshot = (taskId, base64Screenshot) => {
      if (task.taskId === taskId) {
        dataUrlToFile(base64Screenshot, `image_${Date.now()}.png`).then((file) => {
          handleImageInputChange({ target: { files: [file] } });
          //scrollToVisibility();
          handleExpand(true);
        });
      }
    };

    let unsubscribe;

    if (window.electron) {
      unsubscribe = window.electron.receive('partial-screenshot-taken', handleScreenshot);
    }
    return () => {
      if (window.electron && unsubscribe) {
        unsubscribe();
      }
    };
  }, [task.taskId, uploadImages, loadImages]);

  const handleBulkSelect = () => {
    if (bulkSelectTaskArray.length >= 50) {
      return;
    }
    if (!selectedForBulk) {
      setBulkSelectTaskArray([...bulkSelectTaskArray, task]);
    } else {
      const filteredArray = bulkSelectTaskArray.filter(item => item.taskId !== task.taskId);
      setBulkSelectTaskArray([...filteredArray]);
    }
  };

  const handleEditorChange = (value) => {
    setTaskDescription(value);
  };

  const handleDescriptionEdit = (value) => {
    setShowEditTaskDescription(value);
    setShowCreateBtn(!value);
  };

  const handleRemoveAssignee = async () => {
    setShowRemoveModal(false);
    await removedAsignee({ userName: task.assigneeUserName });
    updateTaskInNonGrpJobTasks(task.taskId, task.templateId, undefined, undefined, undefined, undefined, true);
  };

  React.useEffect(() => {
    if ((debouncedTaskDescription !== task.taskDescription) && values.task) {
      background_save = true;
      handleSaveDescription();
    }
  }, [debouncedTaskDescription]);

  React.useMemo(() => {
    if (bulkSelectTaskArray && bulkSelectTaskArray.filter(item => item.taskId === task.taskId).length !== 0) {
      setSelectedForBulk(true);
    } else {
      setSelectedForBulk(false);
    }
  }, [bulkSelectTaskArray]);

  const taskStageCaseChecker = () => {
    if (task.stage === 'Review' && !customJobReviewCompleted && !customReview) {
      return t('in_review');
    }
    if (task.stage === 'Review' && !customJobReviewCompleted && customReview && !expandReviewTask) {
      return t('submitted');
    }
    if (task.stage === 'Review' && !customJobReviewCompleted && customReview && expandReviewTask) {
      return t('in_review');
    }
    if (task.stage === 'Review' && customJobReviewCompleted) {
      return t('completed');
    } else {
      return t(task.stage.replace(/\s/g, ' '));
    }
  };

  const handleCloseScreenshot = () => {
    setShowScreenshotContent(false);
  };

  const isOwnerOrManager = () => {
    return [UserRole.OWNER, UserRole.MANAGER].includes(locationUserRole);
  };

  const isAcceptableTask = () => {
    return ['Assigned', 'Accepted', 'Open'].includes(task.stage);
  };

  const isScreenshotForOwner = () => {
    return isOwnerOrManager() && isAcceptableTask();
  };

  const handleScreenshotSubmit = async (files) => {
    if (files.length === 0) {
      return;
    }

    const values = await toBase64Array(files, true);
    const images = values.reduce((acc, cur) => {
      acc.push({ ...cur.value, imageName: `image_${Date.now()}.${cur.value.extension}` });
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
    handleCloseScreenshot();
    handleExpand(true);
    
    if (isScreenshotForOwner()) {
      addImageToList(task.taskId, 'adhoc', insertImages);
      await uploadImages(images, task.taskId, 'adhoc');
      updateImageOnList(task.taskId, 'adhoc', images[0].imageName);
    } else {
      addActivityImageToList(task.jobActivityId, task.taskActivityTrackerId, insertImages);
      await uploadActivityImages(images, task.jobActivityId, task.taskActivityTrackerId);
      updateActivityImageOnList(task.jobActivityId, task.taskActivityTrackerId, images[0].imageName);
    }
    
  };

  React.useEffect(() => {
    if (taskDescription && taskDescription.length > 3000) {
      const trimmedDescription = taskDescription.slice(0,3000);
      setTaskDescription(trimmedDescription);
    }
  },[taskDescription]);

  React.useMemo(() => {
    if (!!thisTaskInExpandedTaskList !== showTaskDetails) {
      handleShowTaskDetails();
    }
  },[thisTaskInExpandedTaskList, showTaskDetails]);

  React.useMemo(() => {
    setShowCreateBtn(!showEditTitle);
  },[showEditTitle]);
  
  React.useMemo(() => {
    if (isNotifyPage && isExpandable) {
      handleShowTaskDetails(true);
    }
  },[isNotifyPage, isExpandable]);

  if (isNotifyPage && task.stage === 'Review' && !expandReviewTask && !showTaskDetails && !taskImagesLoaded && filesLoadingInprogress) {
    return <div />;
  }
  return (
    <div ref={cardRef}>
      {cardSkin === 'simple' &&
        <SimpleTaskCardSkin
          task={task}
          methodRefs={{
            handleChange, handleSaveTitle, handleShowEditTask, showEditTitle, setShowEditTitle, values, inputTaskRef,
            onAssign, updateAssign, updateDueDate, updatePriority, handleRemoveClick, setShowDueDate, setShowPriority, setOpenMenuPopup,
            openMenuPopup, handleBulkSelect, selectedForBulk, isOpenTask, isCustomJobGroupCard, isTemplateJobGroupCard, profile,
            handleQuickCompleteClick
          }}
        />}
      {!cardSkin && !task.isDeleted && <div
        className={`alert-${task.stage === 'Review' && customJobReviewCompleted ? 'dark' : cardColor} ${selectedForBulk ? 'selected' : undefined} task alert p-0 ${task.groupCard ? 'group' : ''}`}
      >
        {
          (task.stage && !isJob) &&
          <a
            onClick={handleBulkSelect}
            className={classnames(
              [
                'text-center task-status justify-content-center d-flex text-white rounded-left',
                `${task.stage === 'Review' && customJobReviewCompleted ? 'dark' : cardColor}`
              ]
            )}
          >
            <span className='p-1 h-100'>{taskStageCaseChecker()}</span>
          </a>
        }
        {
          (task.stage && isJob) &&
          <span className="p-1 task-status align-self-stretch d-block rounded-left flex-grow-0"></span>
        }
        <div className="p-2">
          {!!task.priority && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') &&
            <div className={`priority-badge p${task.priority}`} onClick={() => setShowPriority(true)}>
              <div className="priority-badge-number">{task.priority}</div>
              <div className="triangle"></div>
            </div>}
          {task.taskType === 'CustomGroupTask' && !isCustomJobGroupCard && !isTemplateJobGroupCard && task.templateName && (!pathname.includes('/task/') || pathname.includes('/details/')) &&
            <div className="d-flex">
              <div className="col p-0">
                <a className="badge badge-light border border-primary text-primary zone-badge" onClick={handleTaskGroupRouting}>{task.templateName}</a>
              </div>
            </div>
          }
          {
            associatedZone && (
              <p className="mb-2">
                <span
                  className={classnames(
                    [
                      'zone-badge badge',
                      (!isCompletedTask && !isRejectedTask && !isIncompleteTask) ? 'badge-primary' : 'badge-secondary'
                    ]
                  )}
                  onClick={handleAddZoneClick}
                  data-target="associate-task-modal"
                >
                  {`${associatedZone.type}${associatedZone.label ? ` "${associatedZone.label}"` : ''}`}
                </span>
              </p>
            )
          }
          {
            isJob && (task.stage !== 'Assigned') && (task.stage !== 'Accepted') && (task.stage !== 'Open') && (
              <p className="mb-2">
                <span className={`badge border-${cardColor} border text-${cardColor}`}>
                  {taskStageCaseChecker()}
                </span>
              </p>
            )
          }
          {
            !showEditTitle && (
              <div className="row job-title">
                <h5
                  className={classnames(['col w-100 alert-heading mb-1', task.priority && 'priority', !showTaskDetails && 'task-title'])}
                  data-target="task-title"
                  onClick={handleShowEditTask}
                >
                  {task.task || task.templateName}
                </h5>
                {(!!numberofTasks || isCustomJobGroupCard) &&
                  <Link
                    to={{
                      pathname: (profile.username === task.assigneeUserName) ? (URLS.TASK_DETAILS(locationId, task.templateId, 'tm')) : (URLS.TASK_DETAILS(locationId, task.templateId)),
                      search: TextUtils.generateQS(task),
                      state: { templateType: task.templateType }
                    }}
                    className="col col-auto text-right pl-0 text-primary"
                  >
                    {numberofTasks || '0'} <Trans i18nKey="tasks" />
                  </Link>
                }
              </div>
            )
          }
          {
            showEditTitle && (
              <div className={classnames(['task-title-edit', task.priority && 'priority'])}>
                <label className="sr-only">Title</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder={t('title')}
                  value={values.task}
                  name="task"
                  onChange={handleChange}
                  ref={inputTaskRef}
                  maxLength="255"
                  onFocus={() => smoothScrollToRef(inputTaskRef, 72)}
                  onKeyDown={onTitleKeyDown}
                />
                {!isCloneTask &&
                  <div className="text-right actions">
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="task-c-button p-1 btn rounded"
                      data-target="discard-title-button"
                      onClick={handleCancelTitle}
                    >
                      <i className="fas fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="discard" /></span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="task-c-button p-1 btn rounded"
                      data-target="save-title-button"
                      onClick={handleSaveTitle}
                      disabled={!values.task}
                    >
                      <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="save" /></span>
                    </Button>
                  </div>
                }
              </div>
            )
          }
          {task.jobManager && (task.taskType !== 'CustomGroupTask' || isCustomJobGroupCard) &&
            <p className="mb-1">
              <small>
                <i className="fas fa-users" aria-hidden="true"></i>
                {isCustomJobGroupCard ? 'Group Manager' : <Trans i18nKey="job_manager" />}:&nbsp;
                <a href="#">
                  <img
                    className="rounded-circle border border-primary avatar-small"
                    src={URLS.PROFILE_IMAGE_THUMB(task.jobManagerUserName)}
                    style={{ width: '25px' }}
                  />
                    &nbsp;
                </a>
                <a
                  className="ml-1"
                  href="#"
                  data-target="button-toggle-show-edit-assign"
                  onClick={toggleAssignModal}
                >
                  {task.jobManager ? task.jobManager : task.jobManagerUserName}
                </a>
              </small>
            </p>
          }
          {task.referenceTemplateName && !task.editable && (
            <div className="d-flex small mb-1">
              <i className="fas fa-tasks mt-1 lineitem-icon mr-1" aria-hidden="true"></i>
              <strong> {task.referenceTemplateName}</strong>
            </div>
          )}
          {task.deviceName && !task.editable && (
            <>
              <p className="mb-1">
                <small>
                  <i className="fas fa-tablet-alt" aria-hidden="true"></i>
                  <Link className='ml-1'
                    to={URLS.ACTIVATE('display', task.deviceName)}
                  ><strong>Confidence Smart Display *{task.deviceName.slice(-4)}</strong></Link>
                </small>
              </p>
            </>
          )}

          {task.assignee && !isCustomJobGroupCard && task.assignee?.slice(0, 1) !== '+' && (
            <p className="mb-0">
              <small>
                <i className='fas fa-user mr-1' aria-hidden='true'></i>
                <Trans i18nKey="assigned_to" />&nbsp;
                <img
                  className="rounded-circle border border-primary avatar-small"
                  src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)}
                  style={{ width: '25px' }}
                />
                &nbsp;
                {((isEditable || isOwnerOrManager()) && !isCompletedTask && !isIncompleteTask && !isRejectedTask)
                  ? <a
                    className="ml-1"
                    href="#"
                    data-target="button-toggle-show-edit-assign"
                    onClick={toggleAssignModal}
                  >
                    {task.assignee}
                  </a>
                  : <span>{task.assignee}</span>
                }
              </small>
            </p>
          )}

          {task.assignee && !isCustomJobGroupCard && task.assignee?.slice(0, 1) === '+' && (
            <p className="mb-0">
              <small>
                <i className='fas fa-user mr-1' aria-hidden='true'></i>
                <Trans i18nKey="assigned_to" />
                {((isEditable || isOwnerOrManager()) && !isCompletedTask && !isIncompleteTask && !isRejectedTask)
                  ? (
                    <>
                      <a
                        className="ml-1"
                        href="#"
                        data-target="button-toggle-show-edit-assign"
                        onClick={toggleAssignModal}
                      >
                        {task.assignee}
                      </a>
                      <a className="ml-1" onClick={() => setShowRemoveModal(true)} href="#" data-toggle="modal" data-target="#assignee-remove"><i className="far fa-lg fa-times-circle" aria-hidden="true"></i> <span className="sr-only"><Trans>Remove Assignee</Trans></span></a>
                    </>)
                  : <span>{task.assignee}</span>
                }
              </small>
            </p>
          )}

          {task && task.taskRecurring && task.taskRecurring.nextOccurrenceDate && !isCustomJobGroupCard && !isReviewTask && !isCompletedTask && !isIncompleteTask && !isCloneTask &&
            <p className='mb-0'>
              <small>
                <i className="far fa-calendar-alt" aria-hidden="true"></i>
                {(isEditable || isOwnerOrManager())
                  ? <a
                    className={classnames([isOpenTask && 'task_update_startdate'])}
                    href="#"
                    data-target="button-toggle-show-schedule-date"
                    onClick={toggleScheduleModal}
                  >
                    <span>{'  '}{DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}</span>
                    <span>{formatTaskRecurringType(task) !== undefined && task.taskRecurring.nextOccurrenceDate !== 'OneTime' && (
                      <>{'  |  '}<i className="fas fa-repeat-alt" aria-hidden="true"></i>
                        {t(formatTaskRecurringType(task))}</>)}</span>
                  </a>
                  : <>
                    <span>{'  '}{DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}</span>
                    <span>{formatTaskRecurringType(task) !== undefined && task.taskRecurring.nextOccurrenceDate !== 'OneTime' && (
                      <>{'  |  '}<i className="fas fa-repeat-alt" aria-hidden="true"></i>
                        {t(formatTaskRecurringType(task))}</>)}</span>
                  </>
                }
              </small>
            </p>
          }
          <div className="d-flex">
            {!!task.dueDate && (task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && <div>
              <div className="d-flex small mt-2 mb-1">
                <span><i className="ci ci-due-f lineitem-icon-custom ml-0"></i></span>
                <a onClick={() => setShowDueDate(true)}>{DateUtils.unicodeFormat(DateUtils.parseISO(task.dueDate), 'P')}
                  {task.dueDate && DateUtils.isAfter(DateUtils.parseISO(DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd')), DateUtils.parseISO(task.dueDate)) && <span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Overdue</span>}
                </a>
              </div>
            </div>}
          </div>
          {!!imageRequired && !showTaskDetails && (
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
          {showScreenshotContent && (
            <ScreenshotContent 
              onSubmit={handleScreenshotSubmit}
              onClose={handleCloseScreenshot}
            />
          )}
          {showTaskDetails && taskLinkData.taskLink && <div className="d-flex small mt-1 mb-1 align-items-center">
            <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">External link</span></span>
            <a rel="noreferrer" href={getQualifiedLink(taskLinkData.taskLink)} target="_blank" className="truncate-1">{taskLinkData.taskLinkText}</a>
            <a className="ml-2" onClick={() => setShowLinkModal(true)}><i className="far fa-lg fa-pencil-alt primary-color" aria-hidden="true"></i> <span className="sr-only">Edit Link</span></a>
          </div>}
          {taskFilePathError && <div className="d-flex small mt-2 mb-1"><span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> File size exceeds maximum limit 50 MB.</span></div>}
          {taskFilePath && showTaskDetails && <div className="d-flex small mb-2 mt-2 align-items-center">
            <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
            {!taskFileUploading && <a target="_blank" rel="noreferrer" className="truncate-1" href={`/api/files/dbx/signed-read${taskFilePath}`}>{taskFilePath.split('/')[2]}</a>}
            {taskFileUploading && <a target="_blank" rel="noreferrer" className="truncate-1">{taskFilePath.split('/')[2]}</a>}
            {!taskFileUploading && <a className="ml-2 text-danger" onClick={() => setShowFileDeleteModal(true)}><i className="far fa-trash-alt" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a>}
            {taskFileUploading && <a className="ml-2 text-danger"><i className="far fa-spinner fa-spin" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a>}
          </div>}
          {showTaskDetails &&
            <div className="task-detail-overflow pt-2 collapse show" id="taskDescription3">
              {(task.taskDescription || showEditTaskDescription) && (
                <div className="task-description">
                  <div className="task-subtitle">
                    {!showEditTaskDescription ?
                      <div className='d-flex small mb-1' onClick={() => handleDescriptionEdit(true)}>
                        <i className="fas fa-align-left mt-1 lineitem-icon" aria-hidden="true"></i>{'  '}
                        <div dangerouslySetInnerHTML={{ __html: taskDescription }} className='mb-0 text-break task-description' />
                      </div>
                      : <DescriptionEditor
                        onDiscard={handleDiscardDescription}
                        onSave={handleSaveDescription}
                        onChange={handleEditorChange}
                        editedDescription={taskDescription}
                        desFocused={desFocused}
                        inputDescRef={inputDescRef}
                      />
                    }
                  </div>
                </div>
              )}
              {(taskImages.length > 0 || backUpImages.length > 0) && <TaskImages task={task} isJob={isJob || false} loadImages={loadImages} editable hideActivityImages={true} updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks} />}

              {showTaskDetails && (taskActivityImages.length !== 0 || taskFileJAPath || taskLinkJAData.taskLink) && <div className="team-member-uploads pt-3">
                <h6>Added by {task.assigneeUserName === profile.username ? 'you' : task.assignee ? task.assignee : 'Team Member'}</h6>
                {showTaskDetails && taskLinkJAData.taskLink && <div className="d-flex small align-items-start">
                  <span><i className="far fa-link lineitem-icon" aria-hidden="true"></i> <span className="sr-only">External link</span></span>
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <a target="_blank" className="truncate-1" rel="noreferrer" href={getQualifiedLink(taskLinkJAData.taskLink)}>{taskLinkJAData.taskLinkText}</a>
                    </div>
                  </div>
                </div>}

                {showTaskDetails && taskFileJAPath && <div className="d-flex small align-items-start">
                  <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <a href={`/api/files/dbx/signed-read${taskFileJAPath}`} target="_blank" rel="noreferrer" className="truncate-1">{taskFileJAPath.split('/')[2]}</a>
                      {!taskFileUploading && <a className="ml-2 text-danger" href="#" data-toggle="modal" data-target="#delete-file" onClick={() => setShowFileDeleteModal(true)}><i className="far fa-trash-alt" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a>}
                      {/*taskFileUploading && <a className="ml-2 text-danger"><i className="far fa-spinner fa-spin" aria-hidden="true"></i> <span className="sr-only">Remove File Attachment</span></a>*/}
                    </div>
                  </div>
                </div>}
                {!!taskActivityImages && !!taskActivityImages.length && task.stage !== 'Copy' && <div className="task-images">
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
                        showImageScore={idx === 0}
                        updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                      />
                    ))}
                  </>
                </div>}
              </div>}

            </div>
          }
          {!!imageRequired && showTaskDetails && (
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
          {(isCompletedTask || isRejectedTask || isIncompleteTask) && task.modifiedDate && <p className="mb-1">
            <small>
              <i className="fas fa-check" aria-hidden="true"></i> Last Updated: {DateUtils.unicodeFormat(DateUtils.parseISO(task.modifiedDate), 'P p')}
            </small>
          </p>}
          {lastComment?.comments?.length > 0 && lastComment?.totalCount && !isCloneTask && <p className="mb-0">
            <small>
              <i className="far fa-comment-alt" aria-hidden="true"></i>
              <Link onClick={handleAddComment} to='#'>{t(`${lastComment.totalCount} comment${lastComment.totalCount > 1 ? 's' : ''}`)}</Link>
              <em className="ml-4 truncate-2"><strong>{formatFirstNameAndLastInitial(lastComment.comments[0].user)}</strong>{t(` ${lastComment.comments[0].comment}`)}</em>
            </small>
          </p>}
          <hr className="my-2" />
          <div className="text-right">
            <div>
              {(!isCustomJobGroupCard && !isTemplateJobGroupCard) && !isCloneTask && <button
                onClick={handleAddComment}
                type="button"
                data-target="button-add-comment"
                className="task-c-button p-1 ml-1 btn rounded btn-outline-primary"
              >
                <i className="far fa-comment-alt" aria-hidden="true"></i><span className="sr-only"><Trans>Add Comment</Trans></span>
              </button>}
              {
                (isOwnerOrManager()) && !isReviewTask && !isCompletedTask && !isIncompleteTask && (
                  <>
                    <button
                      onClick={handleRemoveClick}
                      type="button"
                      data-target="button-remove"
                      className="task-c-button p-1 ml-2 btn rounded btn-outline-primary"
                    >
                      <i className="far fa-trash-alt" aria-hidden="true"></i><span className="sr-only"><Trans>{isJob ? ('del_job') : ('del_task')}</Trans></span>
                    </button>
                    {isOpenTask && !isCustomJobGroupCard && !isTemplateJobGroupCard && task.createdBy === profile.username && <button onClick={handleQuickCompleteClick} type="button" className="task-c-button p-1 ml-2 btn rounded btn-outline-primary" data-toggle="modal" data-target="quick-complete"><i className="far fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="Complete Task" /></span></button>}
                    {isEditable && !isInProgressTask && !isCustomJobGroupCard && !task.assignee &&
                      <button
                        type="button"
                        className={classnames(['task-c-button p-1 ml-2 btn rounded btn-outline-primary', isOpenTask && 'task_add_assignee'])}
                        data-target="button-toggle-show-assign"
                        onClick={onAssign}
                      >
                        <i className="fas fa-user-plus" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="assign" /></span>
                      </button>
                    }
                  </>)
              }
              {isAssignedTask && !isCustomJobGroupCard && task.assigneeUserName === profile.username &&
                <button
                  type="button"
                  className="py-1 px-3 ml-1 btn rounded btn-primary"
                  data-target="accept-task"
                  onClick={() => handleAcceptanceTask('Accepted')}
                >
                  <Trans i18nKey="accept" />
                </button>
              }
              {(isAcceptedTask || isReworkTask) && !isJob && !disableWorkerActions && task.assigneeUserName === profile.username &&
                <Button
                  className="py-1 px-3 ml-1 rounded"
                  variant="primary"
                  data-target="start-task"
                  disabled={!canStartToday}
                  onClick={handleClickStartTask}
                >
                  <Trans i18nKey="start" />
                </Button>
              }
              {isCloneTask &&
                <button
                  type="button"
                  className="task-c-button task-copy-create p-1 ml-2 btn rounded btn-outline-info"
                  onClick={handleRemoveClick}
                >
                  <i className="fas fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="delete" /></span>
                </button>
              }
              {isCloneTask &&
                <button
                  type="button"
                  className="task-c-button task-copy-create p-1 ml-2 btn rounded-circle btn-info"
                  onClick={saveClonedTask}
                >
                  <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="copy" /></span>
                </button>
              }
              {isReviewTask && !expandReviewTask && !customReviewCompleted &&
                <button
                  type='button'
                  className='p-1 px-3 ml-1 btn rounded btn-outline-primary'
                  data-target='expand-review-button'
                  onClick={isJob ? handleReviewJob : handleExpandTaskForReview}
                >
                  <Trans i18nKey="review" />
                </button>
              }
              {isReviewTask && !isJob && expandReviewTask && !customJobReviewCompleted &&
                <button
                  type="button"
                  className="py-1 px-3 ml-1 btn rounded btn-outline-success"
                  data-target="task-reject-button"
                  onClick={openRejectModal}
                >
                  <Trans i18nKey="reject" />
                </button>
              }
              {isReviewTask && isJob && !task.custom && expandReviewTask &&
                <button
                  type="button"
                  className="py-1 px-3 ml-1 btn rounded btn-outline-success"
                  data-target="job-reject-button"
                  onClick={() => setShowRejectJobModal(true)}
                >
                  <Trans i18nKey="reject" />
                </button>
              }
              {isReviewTask && !task.custom && expandReviewTask && !customJobReviewCompleted &&
                <button
                  type="button"
                  data-target="task-done-button"
                  className="py-1 px-3 ml-1 btn rounded btn-success"
                  onClick={() => { customReview ? handleCustomeJobReview() : handleTaskTaking('Completed'); }}
                >
                  <Trans i18nKey="Approve" />
                </button>
              }
              {(isOwnerOrManager()) && !isReviewTask && !isCompletedTask && !isIncompleteTask && (<>
                {!(isTemplateJobGroupCard && task.deviceName) && <Button
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
                  isConvertGroupActive={task.templateType === 'Todo' && !task.custom && (task.stage === 'Open' || task.stage === 'Assigned')}
                  handleConvertGroup={handleConvertGroup}
                  isDescriptionActive={!isJob}
                  handleShowEditDescription={handleShowEditDescription}
                  isAddImagesActive={!isJob && task.stage !== 'Review' && taskImages.length < MAX_ALLOWED_IMAGES && !isCloneTask && !isTemplateJobGroupCard}
                  handleAddImageButtonClick={handleAddImageButtonClick}
                  isAddScreenshotsActive={!isJob && taskImages.length < MAX_ALLOWED_IMAGES && !isCloneTask}
                  handleAddScreenshotButtonClick={handleAddScreenshotButtonClick}
                  isCopyActive={isJob ? false : true}
                  handleCopy={handleCopy}
                  isAssociateActive={task?.templateType !== 'Main' && !isCustomJob && locationZones && locationZones.length > 0 && task.stage !== 'In Progress'}
                  handleAddZoneClick={handleAddZoneClick}
                  isJob={isJob}
                  isAddDeviceActive={task.templateType === 'Main' && !task.deviceName}
                  addDevice={() => addDevice(task.templateId)}
                  isSetPriorityActive={(task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  setPriority={() => setShowPriority(true)}
                  isSetDueDateActive={(task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  setDueDate={() => setShowDueDate(true)}
                  isAddFileActive={(task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  addFile={() => handleTaskFileClick()}
                  isSetStartDateActive={(task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && task.stage === 'Open' && !isCustomJobGroupCard}
                  setStartDate={() => setShowScheduleModal(true)}
                  isSetTaskLinkActive={(task.taskType === 'Adhoc' || task.taskType === 'CustomGroupTask') && !isCustomJobGroupCard}
                  setTaskLink={() => handleSetTaskLinkClick()}
                  isRequireVerificationActive={!isCustomJobGroupCard && !isTemplateJobGroupCard}
                  handleRequireVerificationClick={handleRequireVerificationClick}
                  isCopyGroupActive={isCustomJobGroupCard}
                  handleCopyGroupClick={handleCopyGroupClick}
                  isGroupCard={isCustomJobGroupCard || isTemplateJobGroupCard}
                  locationUserRole={locationUserRole}
                  task={task}
                />}
              </>)}
              {isJob ?
                <Link to={{
                  pathname: (profile.username === task.assigneeUserName) ? (URLS.TASK_DETAILS(locationId, task.templateId, 'tm')) : (URLS.TASK_DETAILS(locationId, task.templateId)),
                  search: TextUtils.generateQS(task),
                  state: { templateType: task.templateType }
                }} >
                  <Button className="py-1 px-3 ml-1 rounded" variant="outline-primary">
                    <Trans i18nKey="view_tasks" />
                  </Button>
                </Link> :
                isExpandable && (
                  <Button
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
                    <span className="sr-only"><Trans i18nKey="view_details" /></span>
                  </Button>
                )
              }
            </div>
          </div>
        </div>
      </div>}
      {showAssignModal && <AssignModal
        onClose={() => setShowAssignModal(false)}
        onUpdate={updateAssign}
        show={showAssignModal}
        assignee={isCustomJobGroupCard ? task.jobManager : task.assignee}
        assigneeUserName={isCustomJobGroupCard ? task.jobManagerUserName : task.assigneeUserName}
        isJob={isJob}
        isEdit={task.assignee && (isEditable || isOwnerOrManager())}
        task={task}
      />}
      {showScheduleModal && <ScheduleModal
        onClose={() => setShowScheduleModal(false)}
        onUpdate={updateSchedule}
        show={showScheduleModal}
        task={task}
        isJob={isJob}
      />}
      {showDeleteModal && <DeleteModal
        data-target="delete-modal"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleRemove}
        show={showDeleteModal}
        title={(isCustomJobGroupCard || isTemplateJobGroupCard) ? t('del_job') : t('del_task')}
        messageText={(isCustomJobGroupCard || isTemplateJobGroupCard) ? t('del_job_tasks') : t('del_task_prmt')}
      />}
      {showRemoveModal && <RemoveModal
        data-target="remove-modal"
        onCancel={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveAssignee}
        show={showRemoveModal}
        title={(isCustomJobGroupCard || isTemplateJobGroupCard) ? t('del_job') : t('del_task')}
        messageText={(isCustomJobGroupCard || isTemplateJobGroupCard) ? t('del_job_tasks') : t('del_task_prmt')}
      />}
      {showZoneModal && (
        <AssociateZoneModal
          onClose={() => setShowZoneModal(false)}
          onAssociate={associateZoneToTask}
          show={showZoneModal}
          locationZoneId={task.locationZoneId}
          isJob={isJob}
        />
      )}
      {showRejectModal && <RejectTaskModal
        show={showRejectModal}
        onCancel={() => setShowRejectModal(false)}
        onReject={handleRejectTask}
        onReassign={openReassignModal}
      />}
      {showRejectJobModal && <RejectJobModal
        show={showRejectJobModal}
        onCancel={() => setShowRejectJobModal(false)}
        onReject={() => handleJobAcceptance('Rejected')}
        onReassign={() => handleJobAcceptance('Rework')}
      />}

      {showReassignModal && <AssignTaskModal
        show={showReassignModal}
        onCancel={() => setShowReassignModal(false)}
        onReassign={handleReassignTaking}
        task={task}
        updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
      />}

      {showNavToAssignedTaskModal && <AssignedModal
        onCancel={() => setShowNavToAssignedTaskModal(false)}
        onConfirm={(isJob || task.taskType === 'CustomGroupTask') ? handleJobAssignedToYouClick : handleTaskAssignedToYouClick}
        show={showNavToAssignedTaskModal}
        title={isJob ? t('job_asigned_to_you') : t('task_asigned_to_you')}
        messageText={isJob ? t('job_asigned_notification') : t('task_asigned_notification')}
        secondLineText={t('work_it_now_question')}
        cancelText={t('no')}
        confirmText={t('yes')}
      />}

      {showTaskReviewModal && <AssignedModal
        onCancel={() => changeFiltersTo('Completed')}
        onConfirm={() => changeFiltersTo('Active')}
        show={showTaskReviewModal}
        title="Task Approved"
        messageText="You have just approved this task."
        secondLineText="Want to work on more tasks?"
        cancelText={t('no')}
        confirmText={t('yes')}
      />}

      {showCompleteModal && <CompleteModal
        onCancel={() => setShowCompleteModal(false)}
        onConfirm={handleQuickComplete}
        show={showCompleteModal}
        title={t('Complete task')}
        messageText={t('Are you sure you want to mark this task complete?')}
        cancelText={t('Cancel')}
        confirmText={t('Complete')}
        postUserPref={postUserPref}
        quickCompleteTaskOption={profile.quickCompleteTaskOption}
      />}

      {showTaskStart && <TaskStartModal
        show={showTaskStart}
        onClose={handleCloseTaskStart}
        onConfirm={handleStartConfirm}
      />}

      {showPriority && <PriorityModal
        show={showPriority}
        onUpdate={updatePriority}
        onClose={() => setShowPriority(false)}
        selectedPriority={task.priority}
      />}
      {showDueDate && <DueDateModal
        show={showDueDate}
        onUpdate={updateDueDate}
        onClose={() => setShowDueDate(false)}
        dueDate={task.dueDate}
        task={task}
      />}
      {showLinkModal && <LinkModal
        show={showLinkModal}
        onUpdate={updateTaskLink}
        onClose={() => setShowLinkModal(false)}
        onDelete={deleteTaskLink}
        linkData={taskLinkData}
      />}
      {showRequireImageVerificationModal && <RequireImageVerificationModal
        show={showRequireImageVerificationModal}
        onClose={() => setShowRequireImageVerificationModal(false)}
        onSelectItem={handleRequireVerificationSelectItem}
        selectedItem={imageRequired}
      />}
      {showFileDeleteModal && <FileDeleteModal
        show={showFileDeleteModal}
        onConfirm={onTaskFileDelete}
        onCancel={() => setShowFileDeleteModal(false)}
      />}
      {openSelectHW && <AddEquipmentModal
        show={openSelectHW}
        onUpdate={onEqSelected}
        onClose={() => setOpenSelectHW(false)}
        templateId={task.templateId}
        locationId={locationId}
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
    </div>
  );

};
TaskCard.propTypes = {
  getLocation: PropTypes.func.isRequired,
  task: PropTypes.object.isRequired,
  taskSummary: PropTypes.object,
  onRemove: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  setAllCustomeJobReviewsInListCompleted: PropTypes.func,
  setNumberofCustomTasksReviewed: PropTypes.func,
  numberofCustomTasksReviewed: PropTypes.number,
  numberofCustomTasksToReview: PropTypes.number,
  customJobCompleted: PropTypes.bool,
  totalTasks: PropTypes.number,
  updateTaskInNonGrpJobTasks: PropTypes.func,
  isOnTaskDetailsPage: PropTypes.bool,
  disableWorkerActions: PropTypes.bool,
  locationUserRole: PropTypes.string,
  isNotifyPage: PropTypes.bool,
  insertCopiedTask: PropTypes.func,
  updateFilters: PropTypes.func,
  cardSkin: PropTypes.string,
  bulkSelectTaskArray: PropTypes.array,
  setBulkSelectTaskArray: PropTypes.func,
  setShowCreateBtn: PropTypes.func,
};

TaskCard.defaultProps = {
  taskSummary: {},
  totalTasks: 0,
  disableWorkerActions: false,
  insertCopiedTask: () => { },
  updateFilters: () => { },
  cardSkin: '',
};

TaskCard.displayName = 'TaskCard';
export default TaskCard;
