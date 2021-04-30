import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import AssignModal from '../location-details/assign-modal';
import ScheduleModal from '../location-details/schedule-modal';
import DeclineJobModal from '../location-details/decline-job-modal';
import { DateUtils, smoothScrollToRef } from '../../../utils';
import RejectJobModal from '../location-details/reject-job-modal';
import { ALL_TASK_OPTIONS, ALL_TASK_OPTIONS_GRP} from '../location-details/tasks';
import { TaskStatus, UserRole } from '../../../constants';
import AssignedModal from '../../shared/modal/assigned';
import Tooltip from '../../shared/tooltip';
import AddEquipmentModal from '../location-details/add-equipment-modal';

import { formatTaskRecurringType } from '../../../lib/task';
import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { postConfidenceManageObject, postConfidenceJobObject, setObject, postConfidenceObject } from '../../../redux/actions/object';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { addToast } from '../../../redux/actions/toasts';

const OBJECT_TASK = 'task';
const OBJECT_ASSIGN = 'assign';
const OBJECT_TRACKING = 'task/tracking';
const OBJECT_ACCEPT = 'jobacceptance';
const OBJECT_CUSTOM_JOB = 'custom';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_GROUP_MANAGE = 'group/manage';

const Content = ({ task, isLoading, updateTasks, allCustomeJobReviewsInListCompleted, setCustomJobCompleted, locationUserRole, my, isOwnerManager }) => {
  const { t } = useTranslation();

  const [values, setValues] = React.useState({ templateName: task.templateName, templateDescription: task.templateDescription });
  const [showEditTitle, setShowEditTitle] = React.useState(false);
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [assignData, setAssignData] = React.useState(false);
  const [showNavToAssignedTaskModal, setShowNavToAssignedTaskModal] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState(false);
  const [showRejectJobModal, setShowRejectJobModal] = React.useState(false);
  const [hideAssignBtn, setHideAssignBtn] = React.useState(false);
  const [showDeclineJob, setShowDeclineJob] = React.useState(false);
  const [isCurrentUserOwnerOrManager, setIsCurrentUserOwnerOrManager] = React.useState(false);
  const [openSelectHW, setOpenSelectHW] = React.useState(false);
  const [showTaskReviewModal, setShowTaskReviewModal] = React.useState(false);

  const { locationId, tm } = useParams();
  const history = useHistory();

  const inputTaskRef = React.useRef();

  const groupManage = useActionDispatch(postConfidenceObject(OBJECT_GROUP_MANAGE, undefined, 'group/manage'));
  const manageTask = useActionDispatch(postConfidenceManageObject(OBJECT_TASK));
  const assignTask = useActionDispatch(postConfidenceJobObject(OBJECT_ASSIGN));
  const trackingTask = useActionDispatch(postConfidenceJobObject(OBJECT_TRACKING));
  const acceptOrDeclineTask = useActionDispatch(postConfidenceJobObject(OBJECT_ACCEPT));
  const customTemplate = useActionDispatch(postConfidenceJobObject(OBJECT_CUSTOM_JOB));
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));
  const resetFilterData = useActionDispatch(setObject('taskGroupFilters'));
  const toast = useActionDispatch(addToast);
  const groupMenuUpdate = useActionDispatch(setObject('groupMenuUpdate'));

  const filterData = useSelector(state => state.taskGroupFilters && state.taskGroupFilters.data);
  const profile = useSelector(state => state.profile.data);
  const templateTasksInfo = useSelector(state => state.templateTasks.data);

  const updateAssign = (data) => {
    if (data?.assigneeMobile === profile.phone && task.templateType !== 'Custom') {
      setShowNavToAssignedTaskModal(true);
    }
    setAssignData(data);
    setShowAssignModal(false);
  };

  const updateSchedule = (data) => {
    setScheduleData(data);
    setShowScheduleModal(false);
  };

  const handleUpdateTask = async (data) => {
    if ((task.templateType === 'Custom' || task.templateType === 'Main')) {
      await groupManage(data);
    } else {
      await manageTask(data);
    }
    setScheduleData(false);
    updateTasks();
  };

  const handleChange = ({ target: { name, value } }, restoreFocus = false) => {
    setValues(v => ({ ...v, [name]: value }));
    if (restoreFocus) {
      inputTaskRef.current.focus();
    }
  };

  const handleAssignTask = async (data) => {
    if (task.templateType === 'Custom') {
      await updateCustomJob(data);
    } else {
      await assignTask(data);
    }
    setAssignData(false);
    updateTasks();
  };

  const updateCustomJob = async (data) => {
    task.jobManager = data.assigneeName;
    task.jobManagerUserName = data.userName;
    const payload = {
      locationId,
      templateId: task.templateId,
      jobManager: data.assignee,
      templateName: task.templateName,
    };
    await customTemplate(payload);
    updateTasks();
  };

  const handleCustomJobReviewCompleted = () => {
    setCustomJobCompleted(true);
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

  const updateCompleteFilters = () => {
    filterData.tab = 'groups';
    filterData.categoryGrp = 'Completed';
    filterData.filterGrp = [{ value: 'Completed', label: 'Completed', cat: 'Completed' }];
    filterData.sortGrp = {value: 'Created Newest First', label: 'Created', subLabel: 'Newest First', sortBy: 'createdDate', sortByOrder: 'desc'};

    filterData.category = filterData.categoryGrp;
    filterData.filter = filterData.filterGrp;
    filterData.sort = filterData.sortGrp;

    resetFilterData({ ...filterData });
  };

  const handleFilterChange = (type) => {
    if (type ==='Completed') {
      setShowTaskReviewModal(false);
      updateCompleteFilters();
      history.push(URLS.LOCATION(locationId));
    } else {
      setShowTaskReviewModal(false);
      updateFiltersToActive();
      history.push(URLS.LOCATION(locationId));
    }
  };

  const handleJobReviewCompleted = async () => {
    await handleTaskTaking('Completed');
    setShowTaskReviewModal(true);
  };

  const handleTaskTaking = async (type) => {
    const jaId = templateTasksInfo?.zones && templateTasksInfo?.zones[0]?.tasks && templateTasksInfo?.zones[0]?.tasks[0]?.jobActivityId;
    const data = {
      taskActivityTrackerId: task.taskActivityTrackerId,
      jobActivityId: task.jobActivityId || jaId,
      status: type,
    };
    await trackingTask(data);
    updateTasks();
  };

  const handleTitleEdit = () =>{
    if (isOwnerManager) {
      setShowEditTitle(true);
    }
  };

  const handleJobAcceptance = async (type) => {
    await handleTaskTaking(type);
    setShowRejectJobModal(false);
  };

  const handleAcceptanceTask = async (acceptance) => {
    const data = {
      taskId: task.taskId,
      templateId: task.templateId,
      stage: acceptance,
    };
    await acceptOrDeclineTask(data);
    updateTasks();
    history.push({pathname: URLS.TASK_DETAILS_RELOAD(locationId, task.templateId, 'tm'), state: {templateType: task.templateType}});
  };

  const isOwnerOrManager = () => {
    return [UserRole.OWNER, UserRole.MANAGER].includes(locationUserRole);
  };

  const isReviewTask = React.useMemo(() => {
    return task.stage && TaskStatus.review === task.stage.toLowerCase();
  }, [task.stage]);

  const isCompletedTask = React.useMemo(() => {
    return task.stage && TaskStatus.completed === task.stage.toLowerCase();
  }, [task.stage]);

  const isOpenedTask = React.useMemo(() => {
    return task.stage && TaskStatus.open === task.stage.toLowerCase();
  }, [task.stage]);

  const isAssignedTask = React.useMemo(() => {
    return task.stage && TaskStatus.assigned === task.stage.toLowerCase();
  }, [task.stage]);

  const isAcceptedTask = React.useMemo(() => {
    return task.stage && TaskStatus.accepted === task.stage.toLowerCase();
  }, [task.stage]);

  const isEditable = React.useMemo(() => {
    return task.stage && [TaskStatus.inProgress, TaskStatus.review]?.indexOf(task.stage.toLowerCase()) === -1;
  }, [task.stage]);

  const handleToggleAssignModal = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (my) {
      return;
    }
    getContacts(locationId);
    setHideAssignBtn(!hideAssignBtn);
    setShowAssignModal(show => !show);
  };

  const handleToggleScheduleModal = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isOwnerManager) {
      setShowScheduleModal(show => !show);
    }
  };

  const onTitleKeyDown = async (e) => {
    if (e.key === 'Enter' && values.templateName) {
      handleSaveTitle(e);
    }
  };

  const updateSideGroupList = () => {
    groupMenuUpdate({update: true});
    setTimeout(() => {
      groupMenuUpdate({update: undefined});
    },500);
  };

  const onEqSelected = () => {

  };

  const handleSaveTitle = async () => {
    const { templateName: taskTitle = '' } = values;
    const { templateType } = task;
    setShowEditTitle(false);
    if ((task.templateType === 'Custom' || task.templateType === 'Main')) {
      task.templateName = taskTitle;
      const customJobData = {
        templateId: task.templateId,
        templateType: templateType,
        templateName: taskTitle,
        templateDescription: task.templateDescription,
        jobManagerUserName: task.assigneeUserName,
        taskRecurring: task.taskRecurring,
      };
      await groupManage(customJobData);
      updateSideGroupList();
    }
    task.templateName = taskTitle;
    toast(t('title_upd'));
  };

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
      templateId: task.templateId, //required in case of Job
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
    if ((task.templateType === 'Custom' || task.templateType === 'Main')) {
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
      assignee: assignData.assigneeMobile || assignData.assignee,
      jobManager: assignData.assigneeMobile || assignData.assignee,
      templateName: task?.templateName,
      assigneeName: assignData.assigneeName,
      userName: assignData.userName,
    };
    task.assignee = assignData.assigneeName;
    task.stage = 'Assigned';
    handleAssignTask(data);
  }, [assignData]);

  const isCurrentUserOwnerOrManagerCheck = () => {
    if (profile.isOwner || profile.isManager) {
      setIsCurrentUserOwnerOrManager(true);
    }
  };

  const moveToGroupsTab = () => {
    setShowNavToAssignedTaskModal(false);
    updateFiltersToActive();
    history.push(URLS.LOCATION(locationId));
  };

  const numberOfTasks = React.useMemo(() => {
    return task.zones && task.zones.reduce((total, zone) => {
      return total + (zone.tasks || []).length;
    }, 0);
  }, [task]);

  const handleJobAssignedToYouClick = async () => {
    setShowNavToAssignedTaskModal(false);
    handleAcceptanceTask('Accepted');
    if (task && task.templateType === 'Main') {
      const data = {
        ...task,
        taskId: task.taskId, //required in case of Task
        templateId: task.templateId, //required in case of Job
        locationId, //required in case of Job
        task: task.task,
        taskDescription: task.taskDescription,
        taskRecurring: {
          ...task?.taskRecurring,
          timeZone: DateUtils.getCurrentTZName(),
          recurringType: task?.taskRecurring?.recurringType ? task.taskRecurring.recurringType : 'OneTime',
          startDate: DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd'),
          startTime: DateUtils.roundToNextMinutes(new Date()),
          endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
        }
      };
      await manageTask(data);
    }
    history.push(URLS.TASK_DETAILS(locationId, task.templateId, 'tm'), { accepted: true, state: { templateType: task.templateType } });
  };

  React.useEffect(() => {
    isCurrentUserOwnerOrManagerCheck();
  });

  React.useEffect(() => {
    if (history && history.location && history.location.state && history.location.state.accepted) {
      handleAcceptanceTask('Accepted');
    }
    Tooltip.show('new_group_title_change', 'bottom');
  },[]);

  React.useEffect(() => {
    if (task) {
      const { templateName, templateDescription } = task;
      setValues({ templateName, templateDescription });
    }
  }, [task]);

  const isTM = profile.isWorker || tm || my;

  if (isLoading || !Object.keys(task).length) {
    return (
      <div className='bg-white pt-3'>
        <div className="container pb-2">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="col px-0 w-100">
                  <span className="ph-animate ph-text ph-title mb-2"></span>
                  <span className="ph-animate ph-text ph-small mb-2"></span>
                  <span className="ph-animate ph-text ph-small mb-2"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='border-bottom bg-white pt-3 first-item'>
      <div className='container'>
        <div className='row'>
          <div className="col">
            {!showEditTitle ? (
              <>
                <h4
                  onClick={handleTitleEdit}
                  className="new_group_title_change d-inline-block"
                >
                  {task.templateName || task.task}
                </h4>
              </>
            ) : (
              <div className="task-title-edit">
                <label className="sr-only">Title</label>
                <div className="input-group input-group-seamless-append" id="password-input">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('Group Name')}
                    value={values.templateName}
                    name="templateName"
                    onChange={handleChange}
                    onKeyDown={onTitleKeyDown}
                    ref={inputTaskRef}
                    maxLength="100"
                    onFocus={()=>smoothScrollToRef(inputTaskRef, 72)}
                    autoComplete="off"
                  />
                  <div className="input-group-append" onClick={() => handleChange({ target: { name: 'templateName', value: '' }}, true)}>
                    <span className="input-group-text border-0 bg-white" id="show_hide_password">
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                      <span className="sr-only">Clear Text</span>
                    </span>
                  </div>
                </div>
                <div className="text-right p-3 actions">
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="task-c-button p-1 btn rounded-circle"
                    data-target="discard-title-button"
                    onClick={() => {
                      setShowEditTitle(false);
                    }}
                  >
                    <i className="far fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="discard" /></span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="task-c-button p-1 ml-2 btn rounded-circle"
                    data-target="save-title-button"
                    onClick={handleSaveTitle}
                    disabled={!values.templateName}
                  >
                    <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="save" /></span>
                  </Button>
                </div>
              </div>
            )}
            {task.jobManager && task.templateType !== 'Main' &&
            <p className="mb-1">
              <small>
                <i className="fas fa-users mr-1" aria-hidden="true"/>
                {task.templateType === 'Custom' ? 'Group Manager' : <Trans i18nKey="job_manager" />}:&nbsp;
                <img
                  className="rounded-circle border border-primary avatar-small"
                  src={URLS.PROFILE_IMAGE_THUMB(task.jobManagerUserName)}
                  style={{ width: '25px' }}
                />
                <a
                  href="#"
                  data-target="button-toggle-show-edit-assign"
                  onClick={handleToggleAssignModal}
                >
                  &nbsp; {task.jobManager !== 'null null' ? task.jobManager : task.jobManagerUserName}&nbsp;
                </a>
              </small>
            </p>
            }
            {task.referenceTemplateName && (
              <div className="d-flex small mb-1">
                <i className="fas fa-tasks mr-2 mt-1 lineitem-icon"></i>
                <strong>{task.referenceTemplateName}</strong>
              </div>
            )}
            {task.deviceName && (
              <>
                <p className="mb-1"><small>
                  <i className="fas fa-tablet-alt mr-2 lineitem-icon" aria-hidden="true"/>
                  <Link
                    to={URLS.ACTIVATE('display', task.deviceName)}
                  >Confidence Smart Display *{task?.deviceName?.slice(-4)}</Link>
                </small></p>
              </>
            )}
            {task.templateType === 'Main' && task?.taskRecurring?.nextOccurrenceDate &&
              <p className="mb-1">
                <small>
                  <i className="far fa-calendar-alt mr-2 lineitem-icon" aria-hidden="true"></i>
                  {!isTM
                    ?<a
                      href="#"
                      data-target="button-toggle-show-edit-schedule"
                      onClick={handleToggleScheduleModal}
                    >
                      {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}
                      {task.taskRecurring?.recurringType && <span> | {t(formatTaskRecurringType(task))}</span>}
                    </a>
                    :<span>
                      {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskRecurring.nextOccurrenceDate), 'P p')}
                      {task.taskRecurring?.recurringType && <span> | {t(formatTaskRecurringType(task))}</span>}
                    </span>
                  }
                </small>
              </p>
            }
            {task.templateType !== 'Custom' && <p className="mb-0">
              {
                isTM ?
                  (task.assignedBy &&
                    <small>
                      <i className="fas fa-user mr-2 lineitem-icon" aria-hidden="true"/>
                      <Trans i18nKey="assigned_by" />&nbsp;
                      <a className="text-primary">
                        <img
                          className="rounded-circle border border-primary avatar-small"
                          src={URLS.PROFILE_IMAGE_THUMB(task.assignedByUserName)}
                          style={{ width: '25px' }}
                        />
                        {' '}
                        {task.assignedBy}
                        {' '}
                      </a>
                    </small>
                  ) :
                  (task.assignee &&
                    <small>
                      <i className="fas fa-user mr-2 lineitem-icon" aria-hidden="true"/>
                      <Trans i18nKey="assigned_to" />&nbsp;
                      <img
                        className="rounded-circle border border-primary avatar-small"
                        src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)}
                        style={{ width: '25px' }}
                      />
                      {
                        (isEditable  || isCurrentUserOwnerOrManager)
                          ?<a
                            href="#"
                            className="ml-1"
                            data-target="button-toggle-show-edit-assign"
                            onClick={handleToggleAssignModal}
                          >
                            {' '}
                            {task.assignee}
                            {' '}
                          </a>
                          :<span>
                            {' '}
                            {task.assignee}
                            {' '}
                          </span>
                      }

                    </small>
                  )
              }
            </p>}
            <div className={`${!isCompletedTask && 'mb-2 mt-3'}`}>
              {!(task.assigneeUserName || task.assignedByUserName || task.templateType === 'Custom' || hideAssignBtn) && !isCompletedTask && task.templateType !== 'Custom' && (locationUserRole === 'Owner' || locationUserRole === 'Manager') &&
                <Button
                  variant="outline-primary"
                  className="btn btn-sm btn-outline-primary mr-2"
                  onClick={handleToggleAssignModal}
                >
                  <i className="fas fa-user-plus" aria-hidden="true"></i> <Trans i18nKey="assign" />
                </Button>
              }
              {task.templateType !== 'Custom' && !task.deviceName && isOwnerManager && (isOpenedTask || isAcceptedTask || isAssignedTask) && <Button onClick={() => setOpenSelectHW(true)} variant="outline-primary" className="btn btn-sm btn-outline-primary mr-2" data-toggle="modal" data-target="#associate-device"><i className="fas fa-tablet-android-alt" aria-hidden="true"></i> Add device</Button>}
              {isReviewTask && isOwnerOrManager() && task.templateType !== 'Custom' &&
                <button
                  type="button"
                  className="py-1 px-3 ml-2 btn rounded-pill btn-outline-success"
                  data-target="reject-job"
                  onClick={() => setShowRejectJobModal(true)}
                >
                  <Trans i18nKey="reject" />
                </button>
              }
              {isReviewTask && isOwnerOrManager() && task.templateType !== 'Custom' &&
                <button
                  type="button"
                  className="py-1 px-3 ml-2 btn rounded-pill btn-success"
                  data-target="task-done-button"
                  onClick={() => handleJobReviewCompleted()}
                >
                  <Trans i18nKey="Approved" />
                </button>
              }
            </div>
            <div className={`${!isCompletedTask && 'mb-2 mt-3'}`}>
              {isTM && isAssignedTask && task.templateType !== 'Custom' &&
                <Button
                  className="py-1 px-3 btn rounded-pill"
                  variant="outline-primary"
                  data-target="decline-task"
                  onClick={() => setShowDeclineJob(true)}
                >
                  <Trans i18nKey="decline" />
                </Button>
              }
              {isTM && isAssignedTask && task.templateType !== 'Custom' &&
                <Button
                  className="py-1 px-3 ml-2 btn rounded-pill"
                  variant="primary"
                  data-target="accept-task"
                  onClick={() => handleAcceptanceTask('Accepted')}
                >
                  <Trans i18nKey="accept" />
                </Button>
              }
              {allCustomeJobReviewsInListCompleted ? (
                <button
                  type="button"
                  className="py-1 px-3 ml-2 btn rounded-pill btn-success"
                  data-target="complete-job-button"
                  onClick={() => handleCustomJobReviewCompleted()}>
                  <Trans i18nKey="complete_job" />
                </button>
              ) : undefined}
            </div>
            {(isCompletedTask && (task.taskStartedTime || task.taskCompletedTime || task.taskDurationTime || task.taskApprovedTime)) && <hr className="mt-2 mb-1" />}
            {isCompletedTask && task.taskStartedTime && <div className="mb-1"><small><i className="far fa-calendar-alt lineitem-icon" aria-hidden="true"></i> Started: {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskStartedTime), 'P p')}</small></div>}
            {isCompletedTask && task.taskCompletedTime && <div className="mb-1"><small><i className="far fa-calendar-check lineitem-icon" aria-hidden="true"></i> Completed: {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskCompletedTime), 'P p')}</small></div>}
            {isCompletedTask && task.taskDurationTime && <div className="mb-1"><small><i className="far fa-clock lineitem-icon" aria-hidden="true"></i> Duration: {task.taskDurationTime}</small></div>}
            {isCompletedTask && task.taskApprovedTime && <div className="mb-1"><small><i className="far fa-check lineitem-icon" aria-hidden="true"></i> Approved: {DateUtils.unicodeFormat(DateUtils.parseISO(task.taskApprovedTime), 'P p')}</small></div>}
            {isCompletedTask && <hr className="mt-2 mb-0" />}
            {isCompletedTask &&
              <div className="mt-2 mb-2">
                <div className="d-flex align-items-center mb-1">
                  <span className="text-success w-100">100% complete</span>
                  <div style={{width: '92px'}}>
                    <p className="mb-0 small text-secondary ml-2 text-right">{numberOfTasks}/{numberOfTasks}</p>
                  </div>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" role="progressbar" style={{width: '100%'}} aria-valuemax="100"></div>
                  <div className="progress-bar bg-lightgray text-dark" role="progressbar" style={{width: '0%'}} aria-valuemax="100"></div>
                </div>
              </div>}
          </div>
        </div>
      </div>
      {showAssignModal && (
        <AssignModal
          onClose={() => handleToggleAssignModal()}
          onUpdate={updateAssign}
          show={showAssignModal}
          assigneeUserName={task.jobManager ? task.jobManagerUserName : task.assigneeUserName}
          isJob
        />
      )}
      {openSelectHW && (
        <AddEquipmentModal
          show={openSelectHW}
          onUpdate={onEqSelected}
          onClose={() => setOpenSelectHW(false)}
          templateId={task.templateId}
          locationId={locationId}
        />
      )}
      {
        showScheduleModal && (
          <ScheduleModal
            onClose={() => setShowScheduleModal(false)}
            onUpdate={updateSchedule}
            show={showScheduleModal}
            task={task}
          />
        )
      }
      {
        showRejectJobModal && (
          <RejectJobModal
            show={showRejectJobModal}
            onCancel={() => setShowRejectJobModal(false)}
            onReject={() => handleJobAcceptance('Rejected')}
            onReassign={() => handleJobAcceptance('Rework')}
          />
        )
      }
      { 
        showDeclineJob && (
          <DeclineJobModal
            show
            onCancel={() => setShowDeclineJob(false)}
            onDecline={() => handleAcceptanceTask('Declined') }
            isJob
          />
        )
      }
      <AssignedModal
        onCancel={moveToGroupsTab}
        onConfirm={() => handleJobAssignedToYouClick()}
        show={showNavToAssignedTaskModal}
        title={t('group_assigned_to_you_title')}
        messageText={t('group_assigned_to_you_message')}
        secondLineText={t('work_it_now_question')}
        cancelText={'No'}
        confirmText={'Yes'}
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
    </div>
  );
};

Content.propTypes = {
  task: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  updateTasks: PropTypes.func.isRequired,
  allCustomeJobReviewsInListCompleted: PropTypes.bool,
  setCustomJobCompleted: PropTypes.func,
  locationUserRole: PropTypes.string,
  my: PropTypes.bool,
  isOwnerManager: PropTypes.bool,
};

Content.defaultProps = {
};

Content.displayName = 'TaskDetailsContent';

export default Content;
