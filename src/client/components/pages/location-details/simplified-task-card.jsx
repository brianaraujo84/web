import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { Dropdown, Form } from 'react-bootstrap';
import { useActionDispatch } from '../../../hooks';
import { postConfidenceManageObject, postConfidenceJobObject, getStandardObject, setObject, postConfidenceObject } from '../../../redux/actions/object';
import { getStandardObjectsList, removeFromList, addToList } from '../../../redux/actions/objects';
import { uploadTaskImages, copyTaskImages, insertImages, updateImageStatus, deleteFileFromDbx } from '../../../redux/actions/files';
import { addToast } from '../../../redux/actions/toasts';
import { DeleteModal } from '../../shared/modal';
import * as URLS from '../../../urls';
import ScheduleModal from './schedule-modal';
import RejectTaskModal from './reject-task-modal';
import RejectJobModal from './reject-job-modal';
import AssignTaskModal from './assign-task-modal';
import AssignedModal from '../../shared/modal/assigned';
import AssociateZoneModal from './associate-zone-modal';
import { getTaskImages, getJobActivityImages, uploadFileToDbx, getFilePathFromDbx } from '../../../redux/actions/files';
import { DateUtils, toBase64Array } from '../../../utils';
import { TaskStatus } from '../../../constants';
import Tooltip from '../../shared/tooltip';
import TaskStartModal from './task-start-modal';
import FileDeleteModal from './file-delete-modal';

const OBJECT_TASKS = 'tasks';
const OBJECT_TASK = 'task';
const OBJECT_ASSIGN = 'assign';
const OBJECT_TRACKING = 'task/tracking';
const OBJECT_CUSTOM_JOB = 'custom';
const OBJECT_CUSTOM_JOBS = 'customJobs';
const OBJECT_CUSTOM_JOB_TASKS = 'templateTasks';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_ACCEPT = 'jobacceptance';
const OBJECT_START = 'task/start';
const OBJECT_GROUP_MANAGE = 'group/manage';
const OBJECT_EXPANDED_TASK_LIST = 'expandedTaskList';

const SimplifiedTaskCard = ({
  task,
  onRemove,
  index,
  getLocation,
  taskSummary,
  updateTaskGroup,
  setAllCustomeJobReviewsInListCompleted,
  numberofCustomTasksReviewed,
  numberofCustomTasksToReview,
  customJobCompleted,
  totalTasks,
  updateTaskInNonGrpJobTasks,
  isOnTaskDetailsPage,
  isNotifyPage,
  updateFilters,
}) => {
  const { locationId, taskTemplateId, taskId, cardType } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const { pathname } = history.location;

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

  const profile = useSelector(state => state.profile.data);
  const taskType = isJob ? 'predefined' : 'adhoc';

  const taskImagesLoaded = useSelector(state => (
    !!state.files.list && !!state.files.list[taskType] && !!state.files.list[taskType][task.taskId]
  ));

  const filesLoadingInprogress = useSelector(state => state.files.inprogress);

  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState(false);
  const [showTaskDetails, setShowTaskDetails] = React.useState(!!thisTaskInExpandedTaskList);
  const [showEditTaskDescription] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [assignData, setAssignData] = React.useState(false);
  const [showEditTitle, setShowEditTitle] = React.useState(false);
  const [values, setValues] = React.useState({ task: '', taskDescription: '' });
  const [showZoneModal, setShowZoneModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [showReassignModal, setShowReassignModal] = React.useState(false);
  const [showRejectJobModal, setShowRejectJobModal] = React.useState(false);
  const [showNavToAssignedTaskModal, setShowNavToAssignedTaskModal] = React.useState(false);
  const [expandReviewTask, setExpandReviewTask] = React.useState(false);
  const [setCustomReview] = React.useState(false);
  const [setCustomReviewCompleted] = React.useState(false);
  const [showTaskStart, setShowTaskStart] = React.useState(false);
  const [showTaskReviewModal, setShowTaskReviewModal] = React.useState(false);
  const [taskFilePath, setTaskFilePath] = React.useState(false);
  const [showFileDeleteModal, setShowFileDeleteModal] = React.useState(false);
  const [setTaskFileUploading] = React.useState(false);
  const [setTaskFilePathError] = React.useState(false);

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
  const manageCustomJob = useActionDispatch(postConfidenceJobObject(OBJECT_CUSTOM_JOB));
  const uploadImages = useActionDispatch(uploadTaskImages);
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
  const addToExpandedTaskList = useActionDispatch(addToList(OBJECT_EXPANDED_TASK_LIST));
  const removeFromExpandedTaskList = useActionDispatch(removeFromList(OBJECT_EXPANDED_TASK_LIST));

  const templateTasksInfo = useSelector(state => state.templateTasks.data);
  const expandedTaskList = useSelector(state => state.expandedTaskList?.items);
  const thisTaskInExpandedTaskList = expandedTaskList?.filter(i => i.taskId === task.taskId)[0];

  const handleRemove = async () => {
    task.isDeleted = true;
    setShowDeleteModal(false);
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
      if (!isOnTaskDetailsPage) {
        await updateTaskInNonGrpJobTasks(task.taskId, task.templateId, true);
      }
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
    toast(numberofTasks ? t('job_deleted') : t('task_del'));
  };

  const updateTasks = () => {
    if (!isOnTaskDetailsPage) {
      updateTaskInNonGrpJobTasks(task.taskId, task.templateId);
    }
    if (isOnTaskDetailsPage) {
      updateTaskGroup();
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

  const updateAssign = (data) => () => {
    const { mobilePhone, userName, firstName, lastName} = data;
    const contact = {
      assigneeName: `${firstName} ${lastName}`,
      userName,
      assigneeMobile: mobilePhone
    };

    if (isCloneTask) {
      updateCloneTask(contact);
    } else {
      setAssignData(contact);
    }
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
  const loadImages = React.useCallback(async () => {
    await getTaskImagesList(task.taskId, taskType);
    if (task.jobActivityId && task.taskActivityTrackerId) {
      await getTaskActivityImagesList(task.jobActivityId, task.taskActivityTrackerId);
    }
    getTaskFilePath(task.taskId);
  }, [task, taskType]);

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
    scrollToVisibility();
    await uploadImages(images, task.taskId, 'adhoc');
    updateImageOnList(task.taskId, 'adhoc', images[0].imageName);
    //await loadImages();
  }, [task.taskId, uploadImages, loadImages]);

  const preparePaths = (taskId, fileType) => {
    const folderName = `${task.taskId}-adhoc`;
    const fileName = `${task.taskId}${fileType ? '.' + fileType : ''}`;
    return {folderName, fileName};
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
    const path = preparePaths(task.taskId, fileType);
    setTaskFilePath(`/${path.folderName}/${path.fileName}`);
    setTaskFileUploading(true);
    await uploadFileToDbx(path.folderName, path.fileName, taskFile);
    setTaskFileUploading(false);
  };

  const getTaskFilePath = (task) => {
    const path = preparePaths(task.taskId);
    getFilePathFromDbx(path.folderName, path.fileName).then(file => {
      if (file.isFileExist) {
        setTaskFilePath(file.link);
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
  };

  const handleShowEditTask = () => {
    setShowEditTitle(true);
    window.setTimeout(() => {
      inputTaskRef.current.focus();
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleTaskTaking = async (type) => {
    const data = {
      taskActivityTrackerId: task.taskActivityTrackerId,
      jobActivityId: task.jobActivityId,
      status: type,
    };
    await trackingTask(data);
    if (type === 'Completed' && !isOnTaskDetailsPage) {
      setShowTaskReviewModal(true);
    } else {
      updateTasks();
    }
  };

  const changeFiltersTo = (type) => {
    updateFilters(type);
    setShowTaskReviewModal(false);
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

  const handleExpandTaskForReview = () => {
    setExpandReviewTask(true);
    handleExpand(true);
  };

  const handleShowTaskDetails = () => {
    handleExpand(show => !show);
    scrollToVisibility();
  };

  const scrollToVisibility = () => {
    setTimeout(() => {
      scrollIntoView(cardRef.current, {
        block: 'end',
        behavior: 'smooth'
      });
    },100);
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
        state: { templateType: task.templateType }
      });
    } else {
      if (!cardType) {
        history.push(URLS.TASK_DETAILS(locationId, task.templateId), {
          reviewing: true,
          state: { templateType: task.templateType }
        });
      }
      setExpandReviewTask(true);
    }
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
    task.stage = 'Accepted';
    handleAssignTask(assignDataPayload, true).then( async () => {
      const data = {
        taskId: task.taskId,
        templateId: task.templateId,
        stage: 'Accepted',
      };
      await acceptOrDeclineTask(data).then(handleStartTask);
      if (pathname.includes('/location-my')) {
        setShowNavToAssignedTaskModal(false);
      } else if (pathname.includes('/location-notify')) {
        history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
      } else {
        history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
      }
    });
  };

  const handleJobAssignedToYouClick = async () => {
    const assignDataPayload = {
      taskId: task.taskId,
      templateId: task.templateId,
      locationId,
      task: task.task,
      status: 'assigned',
      assignee: assignData.userName ? assignData.userName : assignData.assigneeMobile,
    };
    setShowNavToAssignedTaskModal(true);
    task.stage = 'Accepted';
    handleAssignTask(assignDataPayload, true).then( async () => {
      const data = {
        taskId: task.taskId,
        templateId: task.templateId,
        stage: 'Accepted',
      };
      await acceptOrDeclineTask(data).then(handleStartTask);
      if (isTemplateJobGroupCard) {
        history.push(URLS.TASK_DETAILS(locationId, task.templateId, 'tm'), {
          state: { templateType: task.templateType }
        });
      }
    });
  };

  const updatePriority = async (value) => {
    task.priority = value;
    await manageTask(task);
    updateTasks();
  };

  const updateDueDate = async (value) => {
    task.dueDate = DateUtils.unicodeFormat(value, 'yyyy-MM-dd');
    await manageTask(task);
    updateTasks();
  };

  const isOpenTask = React.useMemo(() => {
    return task.stage && TaskStatus.open === task.stage.toLowerCase();
  }, [task.stage]);

  const isCloneTask = React.useMemo(() => {
    return task.stage && TaskStatus.copy === task.stage.toLowerCase();
  }, [task.stage]);

  React.useEffect(() => {
    if (task) {
      const { task: taskTitle = '', taskDescription = '', templateName } = task;
      setValues({ task: (taskTitle || templateName), taskDescription });
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
    task.stage = 'Accepted';
    handleAssignTask(data, true).then( async () => {
      const data = {
        taskId: task.taskId,
        templateId: task.templateId,
        stage: 'Accepted',
      };
      await acceptOrDeclineTask(data);
      updateTasks();
    });
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
    if (data.assignee === profile.username && !isCustomJobGroupCard) {
      task.stage = 'Accepted';
      task.assigneeUserName = assignData.userName;
      task.assignee = assignData.assigneeName;
      setShowNavToAssignedTaskModal(true);
    } else {
      task.stage = 'Assigned';
      task.assigneeUserName = assignData.userName;
      task.assignee = assignData.assigneeName;
      handleAssignTask(data);
    }
  }, [assignData]);

  React.useEffect(() => {
    if (isCloneTask) {
      setShowEditTitle(true);
      // Wait till "expand" animation is finished
      setTimeout(() => {
        // Scroll into view if needed
        scrollIntoView(cardRef.current, {
          block: 'end',
          scrollMode: 'if-needed',
        });
      }, 500);
    }
  }, [isCloneTask]);

  React.useEffect(() => {
    if (showTaskDetails && !taskImagesLoaded) {
      loadImages();
    }
  }, [showTaskDetails]);

  React.useEffect(() => {
    if (totalTasks === 1) {
      Tooltip.show('task_update_startdate', 'bottom').then(() => {
        if (isOpenTask) {
          Tooltip.show('task_add_assignee', 'bottom');
        }
      });
    }
    loadImages();
  }, []);

  React.useEffect(() => {
    if (showEditTaskDescription) {
      inputDescRef.current && inputDescRef.current.focus();
    }
  }, [showEditTaskDescription]);

  React.useEffect(() => {
    if (history?.location?.state?.reviewing && history?.location.state?.reviewing === true) {
      setExpandReviewTask(true);
    } if (history?.location?.state?.customReview && history?.location.state?.customReview === true) {
      setCustomReview(true);
    } if (history?.location?.state?.allCustomeJobReviewsInListCompleted) {
      setCustomReviewCompleted(true);
    }
  },[history?.location?.state]);

  React.useEffect(() => {
    if ((numberofCustomTasksReviewed === numberofCustomTasksToReview) && numberofCustomTasksReviewed !== 0 && setAllCustomeJobReviewsInListCompleted) {
      setAllCustomeJobReviewsInListCompleted(true);
    }
  },[numberofCustomTasksReviewed]);

  React.useEffect(() => {
    if (customJobCompleted) {
      handleTaskTaking('Completed');
    }
  },[customJobCompleted]);

  const handleSaveTitle = async () => {
    const { task: taskTitle = '' } = values;
    const { templateType } = task;
    setShowEditTitle(false);
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
    if (('Todo' === templateType || taskTemplateId || !task.groupCard) && !task.custom ) {
      task.task = taskTitle;
      await manageTask(task);
      if (task.taskType === 'CustomGroupTask') {
        updateTasks();
      }
      toast(t('title_upd'));
    } else {
      task.templateName = taskTitle;
      toast(t('title_upd'));
    }
  };
    
  const contacts = useSelector(state => state.contacts.items);

  const priority = [1,2,3,4,5,0];

  const [contactFilterKey, setContactFilterKey] = React.useState('');

  const filteredContacts = React.useMemo(() => {
    if (!contactFilterKey) {
      return [...contacts];
    }
    return _(contacts).filter(({ firstName, lastName}) => `${firstName} ${lastName}`.toLowerCase().includes(contactFilterKey.toLowerCase())).value();
  }, [contacts, contactFilterKey]);
  
  React.useMemo(() => {
    if (!!thisTaskInExpandedTaskList !== showTaskDetails) {
      handleShowTaskDetails();
    }
  },[thisTaskInExpandedTaskList, showTaskDetails]);

  if (isNotifyPage && task.stage === 'Review' && !expandReviewTask && !showTaskDetails && !taskImagesLoaded && filesLoadingInprogress) {
    return <div />;
  }
  return (
    <>
      {!task.isDeleted && <div
      
        ref={cardRef}
      >
        <div className="d-flex align-items-center justify-content-between py-2 border-bottom task-compact">
          <div className="d-flex align-items-center">
            <div className={classnames(['title d-inline-block', showEditTitle ? 'edit' : 'view'])}>
              <input 
                type="text"
                className="title form-control form-control-sm"
                placeholder={t('title')}
                value={values.task}
                name="task"
                onChange={handleChange}
              />
              <span onClick={handleShowEditTask}>{task.task || task.templateName}</span>
              <div className={classnames(['buttons ml-1 mr-3', showEditTitle ? 'd-inline-block' : 'd-none'])}>
                <button 
                  className="discard btn btn-sm btn-outline-primary mr-1"
                  onClick={()=> {
                    handleExpand(false);
                    setShowEditTitle(false);
                  }}
                >
                  <i className="far fa-times" aria-hidden="true"></i>
                </button>
                <button 
                  className="save btn btn-sm btn-primary"
                  onClick={handleSaveTitle}
                >
                  <i className="fas fa-check" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <div className="assignee ml-2">
              <Dropdown >
                <Dropdown.Toggle variant={task.assignee?'primary':'default'} className="" size="sm">
                  {
                    task.assignee?<span onClick={onAssign}><i className="fas fa-user" aria-hidden="true"></i>&nbsp;{task.assignee}</span>:
                      <i className="fas fa-user-plus" aria-hidden="true" onClick={onAssign}></i>
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu >
                  <div className="dropdown-item px-2 py-2">
                    <Form.Control 
                      type="text"
                      size="sm"
                      placeholder="Search..."
                      value={contactFilterKey}
                      onChange={({ target: { value } }) => { setContactFilterKey(value); }}/>
                  </div>
                  {
                    filteredContacts.map(({
                      contactId,
                      userName,
                      mobilePhone,
                      firstName,
                      lastName,
                      contactTypeLabel,
                    }) => {
                      return (
                        <Dropdown.Item
                       
                          key={contactId}
                          onClick={updateAssign({...{mobilePhone, userName, firstName, lastName}})}
                        >
                          <img className="rounded-circle border border-secondary" src={URLS.PROFILE_IMAGE_THUMB(userName)} style={{width: '25px'}} /> 
                          {(firstName || lastName) ? ` ${firstName} ${lastName.charAt(0)}. ` : ' Invited '}
                          <small className="text-secondary">{contactTypeLabel}</small>
                        </Dropdown.Item>
                      );
                    })
                  }
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="due ml-2">
              {(task.dueDate || (task.stage==='Assigned' || task.stage === 'Open' || task.stage === 'Accepted')) &&
                <Dropdown>
                  <Dropdown.Toggle variant={task.dueDate?'warning':'default'} className="" size="sm">
                    {
                      task.dueDate?<span ><i className="ci ci-due-f" aria-hidden="true"></i>&nbsp;{task.dueDate}</span>:
                        <i className="ci ci-due-f text-secondary" aria-hidden="true"></i>
                    }
                  </Dropdown.Toggle>
                  {
                    (task.stage==='Assigned' || task.stage === 'Open' || task.stage === 'Accepted') && <Dropdown.Menu id="dropdown-calendar" >
                      <DayPicker onDayClick={(day) => {updateDueDate(day); document.querySelector('#dropdown-calendar').style.opacity='0'; }}/>
                    </Dropdown.Menu> 
                  }
                </Dropdown>
              }
            </div>
            <div className="priority ml-2">
              <Dropdown>
                <Dropdown.Toggle variant={task.priority > 0?'danger':'default'} className="" size="sm">
                  {
                    task.priority>0?
                      <span><i className="fas fa-flag-alt" aria-hidden="true"></i>&nbsp;P{task.priority}</span>:
                      <span><i className="fas fa-flag-alt" aria-hidden="true"></i></span>
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    priority.map((item) => (
                      <Dropdown.Item key={item} onClick={()=>updatePriority(item)} className={task.priority === item ? 'badge-primary':''}>
                        {
                          item === 0?<span>No Priority</span>:
                            <span>P{item}</span>
                        }
                      </Dropdown.Item>    
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className={classnames(['status','badge',task.stage==='Open'?'badge-secondary':'badge-primary'])}>{task.stage}</span>
            <button className="delete-task btn btn-sm btn-default ml-2" data-toggle="modal"  onClick={() => setShowDeleteModal(true)}><i className="far fa-trash-alt" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>}
      <ScheduleModal
        onClose={() => setShowScheduleModal(false)} 
        onUpdate={updateSchedule}
        show={showScheduleModal}
        task={task}
        isJob={isJob}
      />
      <DeleteModal
        data-target="delete-modal"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleRemove}
        show={showDeleteModal}
        title={numberofTasks ? t('del_job') : t('del_task')}
        messageText={numberofTasks ? t('del_job_tasks') : t('del_task_prmt')}
      />
      {showZoneModal && (
        <AssociateZoneModal
          onClose={() => setShowZoneModal(false)}
          onAssociate={associateZoneToTask}
          show={showZoneModal}
          locationZoneId={task.locationZoneId}
          isJob={isJob}
        />
      )}
      <RejectTaskModal
        show={showRejectModal}
        onCancel={() => setShowRejectModal(false)}
        onReject={handleRejectTask}
        onReassign={openReassignModal}
      />
      <RejectJobModal
        show={showRejectJobModal}
        onCancel={() => setShowRejectJobModal(false)}
        onReject={() => handleJobAcceptance('Rejected')}
        onReassign={() => handleJobAcceptance('Rework')}
      />

      <AssignTaskModal
        show={showReassignModal}
        onCancel={() => setShowReassignModal(false)}
        onReassign={handleReassignTaking}
        task={task}
        updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
      />

      <AssignedModal
        onCancel={handleDeclinedSelfAssignStart}
        onConfirm={(isJob || task.taskType === 'CustomGroupTask') ? handleJobAssignedToYouClick : handleTaskAssignedToYouClick}
        show={showNavToAssignedTaskModal}
        title={isJob ? t('job_asigned_to_you') : t('task_asigned_to_you')}
        messageText={isJob ? t('job_asigned_notification') : t('task_asigned_notification')}
        secondLineText={t('work_it_now_question')}
        cancelText={t('no')}
        confirmText={t('yes')}
      />

      <AssignedModal
        onCancel={() => changeFiltersTo('Completed')}
        onConfirm={() => changeFiltersTo('Active')}
        show={showTaskReviewModal}
        title="Task Approved"
        messageText="You have just approved this task."
        secondLineText="Want to work on more tasks?"
        cancelText={t('no')}
        confirmText={t('yes')}
      />

      <TaskStartModal
        show={showTaskStart}
        onClose={handleCloseTaskStart}
        onConfirm={handleStartConfirm}
      />
      <FileDeleteModal
        show={showFileDeleteModal}
        onConfirm={onTaskFileDelete}
        onCancel={() => setShowFileDeleteModal(false)}
      />

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
SimplifiedTaskCard.propTypes = {
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
  updateTaskGroup: PropTypes.func,
  isOnTaskDetailsPage: PropTypes.bool,
  disableWorkerActions: PropTypes.bool,
  locationUserRole: PropTypes.string,
  isNotifyPage: PropTypes.bool,
  insertCopiedTask: PropTypes.func,
  updateFilters: PropTypes.func,
};

SimplifiedTaskCard.defaultProps = {
  taskSummary: {},
  totalTasks: 0,
  disableWorkerActions: false,
  insertCopiedTask: () => {},
  updateFilters: () => {},
};

SimplifiedTaskCard.displayName = 'SimplifiedTaskCard';
export default SimplifiedTaskCard;
