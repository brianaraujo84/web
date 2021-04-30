import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import hotkeys from 'hotkeys-js';
import Select from 'react-select';
import InfiniteScroll from 'react-infinite-scroller';

import ToggleButton from '../location-details/toggle-button';
import { useActionDispatch } from '../../../hooks';

import * as URLS from '../../../urls';
import { postConfidenceManageObject, postConfidenceJobObject } from '../../../redux/actions/object';
import NewTask from '../location-details/new-task';
import TaskCard from '../location-details/task-card';
import WorkerTaskCard from '../location-details/worker-task-card';
import { addToast } from '../../../redux/actions/toasts';
import { toBase64Array } from '../../../utils';
import { postConfidenceObject, getStandardObject, resetObject, setObject } from '../../../redux/actions/object';
import { uploadTaskImages } from '../../../redux/actions/files';
import { getStandardObjectsList, getPostStandardObjectsList } from '../../../redux/actions/objects';
import { DateUtils } from '../../../utils';
import EllipsisMenuV3 from '../../shared/ellipsis-menu/ellipsis-menu-v3';
import PriorityModal from '../location-details/priority-modal';
import AssignModal from '../location-details/assign-modal';
import DueDateModal from '../location-details/due-date-modal';
import ScheduleModal from '../location-details/schedule-modal';
import ValueContainer, { Option, ValueContainer2 } from '../location-details/value-container';
import { SortByRS } from '../../../constants';
import DragableTaskList from './dragable-task-list';
import PreDefinedFiltersModal from '../location-details/pre-defined-filters-modal';
import MoveToGroupModal from '../location-details/move-to-group-modal';
import ViewMenu from './view-menu';
import GroupLoader from './group-loader';

const OBJECT_TEMPLATE_TASKS = 'templateTasks';
const OBJECT_TEMPLATE = 'template';
const OBJECT_LOСATION = 'location';
const OBJECT_LOСATION_ZONES = 'locationZones';
const OBJECT_TASK = 'task';
const NEW_TEMPLATE = 'newTemplate';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_TASK_BULK = 'task/bulk';
const OBJECT_JOBS_AND_TASKS = 'jobs';
const OBJECT_TASK_STATUS = 'taskStatus';
const OBJECT_ASSIGN = 'assign';
const OBJECT_SEQUENCE_ORDER = 'task/sequenceorder';
const OBJECT_AGGREGATES_GRP = 'group';
const OBJECT_CUSTOM_GROUPS = 'taskGroups';

let sortingMode = true;
let isFetching = false;
let nonGrpJobTasksCounter = 0;
let targetId = undefined;
let showNewTaskForm = false;
const TASKS_LIMIT = 5;
let dueDateOff = undefined;
let statusCategory = undefined;

const ALL_TASKS = 'Open,Assigned,In Progress,Review,Accepted,Declined,Rework';
const ALL_INCOMPLETE_TASKS = 'Completed,Incomplete,Rejected';
export const ALL_TASK_OPTIONS = [{ value: 'All Active', label: 'All Active', cat: 'Active', reqValues: ALL_TASKS.split(',') }, { value: 'Open', label: 'Open', cat: 'Active' }, { value: 'Assigned', label: 'Assigned', cat: 'Active' }, { value: 'Rework', label: 'Rework', cat: 'Active' }, { value: 'Accepted', label: 'Accepted', cat: 'Active' }, { value: 'Declined', label: 'Declined', cat: 'Active' }, { value: 'In Progress', label: 'In Progress', cat: 'Active' }, { value: 'Review', label: 'Review', cat: 'Active' }];
export const ALL_TASK_OPTIONS_0 = [ALL_TASK_OPTIONS[0]];
const ALL_INCOMPLETE_OPTIONS = [{ value: 'All Completed', label: 'All Completed', cat: 'Completed', reqValues: ALL_INCOMPLETE_TASKS.split(',') }, { value: 'Completed', label: 'Completed', cat: 'Completed' }, { value: 'Incomplete', label: 'Incomplete', cat: 'Completed' }, { value: 'Rejected', label: 'Rejected', cat: 'Completed' }];
const ALL_INCOMPLETE_OPTIONS_0 = [ALL_INCOMPLETE_OPTIONS[0]];
const filterOpts = [{ label: 'Active', options: ALL_TASK_OPTIONS }, { label: 'Completed', options: ALL_INCOMPLETE_OPTIONS }];
const dueDateOpts = [{ value: 'All', label: 'All' }, { value: 'Overdue', label: 'Overdue' }];

const priorityOpts_NO = [{ value: 0, label: 'No Priority', cat: 'clearAll' }];
const priorityOpts = [{ value: 'All', label: 'All', cat: 'clearAll' }, { value: 0, label: 'No Priority', cat: 'clearAll' }, { value: 1, label: 'P1' }, { value: 2, label: 'P2' }, { value: 3, label: 'P3' }, { value: 4, label: 'P4' }, { value: 5, label: 'P5' }];
const priorityOpts_ALL = [{ value: 'All', label: 'All', cat: 'clearAll' }];
export const ALL_TASK_OPTIONS_0_WITHOUT_OPEN = [{ value: 'Assigned', label: 'Assigned', cat: 'Active' }, { value: 'Rework', label: 'Rework', cat: 'Active' }, { value: 'Accepted', label: 'Accepted', cat: 'Active' }, { value: 'Declined', label: 'Declined', cat: 'Active' }, { value: 'In Progress', label: 'In Progress', cat: 'Active' }, { value: 'Review', label: 'Review', cat: 'Active' }];

export const ALL_TASK_OPTIONS_GRP = [{ value: 'All Active', label: 'All Active', cat: 'Active', reqValues: ALL_TASKS.split(',') }, { value: 'Open', label: 'Open', cat: 'Active' }, { value: 'Assigned', label: 'Assigned', cat: 'Active' }, { value: 'Rework', label: 'Rework', cat: 'Active' }, { value: 'Accepted', label: 'Accepted', cat: 'Active' }, { value: 'Declined', label: 'Declined', cat: 'Active' }, { value: 'In Progress', label: 'In Progress', cat: 'Active' }, { value: 'Review', label: 'Review', cat: 'Active' }];
export const ALL_TASK_OPTIONS_GRP_0 = [ALL_TASK_OPTIONS_GRP[0]];


const customStyles = {
  valueContainer: (provided) => ({
    ...provided,
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'initial'
  }),
  option: (styles, state) => {
    return { ...styles, backgroundColor: 'white', color: state.isSelected ? '#007bff' : 'black' };
  },
};
const customStyles2 = {
  valueContainer: (provided) => ({
    ...provided,
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'initial'
  }),
  menu: styles => {
    return { ...styles, width: '180px', right: '0px' };
  },
  option: (styles, state) => {
    return { ...styles, backgroundColor: 'white', color: state.isSelected ? '#007bff' : 'black' };
  },
};
const customStyles3 = {
  valueContainer: (provided) => ({
    ...provided,
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'initial'
  }),
  menu: styles => {
    return { ...styles, width: '190px' };
  },
  option: (styles, state) => {
    return { ...styles, backgroundColor: 'white', color: state.isSelected ? '#007bff' : 'black' };
  },
};

const CustomJobTasks = ({
  newTaskData,
  editable,
  taskSummary,
  isLoading,
  setAllCustomeJobReviewsInListCompleted,
  setNumberofCustomTasksReviewed,
  numberofCustomTasksReviewed,
  numberofCustomTasksToReview,
  customJobCompleted,
  simplifiedMode,
  locationUserRole,
  loc,
  my,
  isNotifyPage,
  updateSideGroupList,
  handleViewChange,
  areTemplatesAvailable,
}) => {
  const { t } = useTranslation();
  const { locationId, taskTemplateId, tm, filter: locationFilter = '' } = useParams();
  const history = useHistory();
  const { data = {} } = useLocation();
  const { filterType } = data;

  const newTaskBtnRef = React.useRef(null);
  const lastCommittedFD = React.useRef(false);

  const [showNewTask, setShowNewTask] = React.useState(newTaskData ? true : false);
  const [initTaskData, setInitTaskData] = React.useState(newTaskData);
  const [filter, setFilter] = React.useState('');
  const [sort, setSort] = React.useState(SortByRS[0]);
  const [templateCreated, setTemplateCreated] = React.useState(false);
  //const [simplifiedMode, setSimplifiedMode] = React.useState(false);
  const [bulkSelectTaskArray, setBulkSelectTaskArray] = React.useState([]);
  const [showEllipsisMenu, setShowEllipsisMenu] = React.useState(false);
  const [showPriority, setShowPriority] = React.useState(false);
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [showDueDate, setShowDueDate] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [category, setCategory] = React.useState('Active');
  const [reportersSelected, setReportersSelected] = React.useState([]);
  const [reporters, setReporters] = React.useState([]);
  const [dueDateSelected, setDueDateSelected] = React.useState({ value: 'All', label: 'All' });
  const [sortBy, setSortBy] = React.useState('createdDate');
  const [sortByOrder, setSortByOrder] = React.useState('desc');
  const [prioritySelected, setPrioritySelected] = React.useState([{ value: 'All', label: 'All' }]);
  const [assigneesSelected, setAssigneesSelected] = React.useState([]);
  const [assignees, setAssignees] = React.useState([]);
  const [nonGrpJobTasks, setNonGrpJobTasks] = React.useState([]);
  const [nonGrpJobTasksCount, setNonGrpJobTasksCount] = React.useState(0);
  const [nonGrpTasksCount, setNonGrpTasksCount] = React.useState(0);
  const [phase, setPhase] = React.useState(1);
  const [tempData, setTempData] = React.useState(false);
  const [rePaint, setRePaint] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // const [sortingMode, setSortingMode] = React.useState(null);
  const [showPreDefinedFilters, setShowPreDefinedFilters] = React.useState(false);
  const [showMoveToGroupModal, setShowMoveToGroupModal] = React.useState(false);
  const [isFirstTime, setIsFirstTime] = React.useState(history.location?.state?.isFirstTime || history.location?.data?.isFirstTime);
  const [showViewMenu, setShowViewMenu] = React.useState(false);
  const [showCreateBtn, setShowCreateBtn] = React.useState(true);

  const getTaskTemplateInfo = useActionDispatch(getStandardObject(OBJECT_TEMPLATE_TASKS, undefined, `job/custom/${taskTemplateId}`, '/tasks'));
  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));
  const profile = useSelector(state => state.profile.data);
  const toast = useActionDispatch(addToast);
  const cloneTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const manageTask = useActionDispatch(postConfidenceManageObject(OBJECT_TASK));
  const uploadImages = useActionDispatch(uploadTaskImages);
  const getLocationZones = useActionDispatch(getStandardObjectsList(OBJECT_LOСATION_ZONES, 'zones', undefined, 'location', '/configuration'));
  const updateTemplateData = useActionDispatch(setObject(NEW_TEMPLATE));
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));
  const getBulk = useActionDispatch(postConfidenceObject(OBJECT_TASK_BULK));
  const getTasks2 = useActionDispatch(postConfidenceObject(OBJECT_JOBS_AND_TASKS, undefined, 'cards/tasks'));
  const getAggregateCounts = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE, undefined, 'task/aggregate'));
  const getReportersByLocId = useActionDispatch(getStandardObject('reporters', undefined, 'location', '/reporter'));
  const getAssigneeByLocId = useActionDispatch(getStandardObject('assignees', undefined, 'location', '/assignee'));
  const getTaskStatus = useActionDispatch(postConfidenceObject(OBJECT_TASK_STATUS, undefined, 'task/details'));
  const assignTask = useActionDispatch(postConfidenceJobObject(OBJECT_ASSIGN));
  const updateSequenceOrder = useActionDispatch(postConfidenceObject(OBJECT_SEQUENCE_ORDER));
  const moveToTaskGroup = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES_GRP));
  const getCustomGroups = useActionDispatch(getPostStandardObjectsList(
    OBJECT_CUSTOM_GROUPS,
    'jobs',
    'v1',
    'cards/custom',
    '',
    10,
    'numberofTasks'
  ));

  const templateTasksInfo = useSelector(state => state.templateTasks.data);
  const resetTasksInfo = useActionDispatch(resetObject(OBJECT_TEMPLATE_TASKS));
  const setTasksInfo = useActionDispatch(setObject(OBJECT_TEMPLATE_TASKS));
  const newTemplateData = useSelector(state => state.newTemplate.data);
  const taskInProgress = useSelector(state => state.task.inprogress);
  const filterData = useSelector(state => state.taskGroupFilters && state.taskGroupFilters.data);
  const tasksActions = useSelector(state => state.tasksActions);

  //const { items: rawTasks } = useSelector((state) => state.tasks);

  let tasksNumber = nonGrpJobTasksCount + nonGrpTasksCount;

  const handleView = () =>{
    setShowViewMenu(true);
  };

  const getValuesArray = (data = []) => {
    let strArr = [];
    for (let i = 0; i < data.length; i++) {
      const it = data[i];
      if (it.reqValues) {
        strArr = it.reqValues;
        break;
      } else {
        strArr.push(it.value);
      }
    }
    return strArr;
  };

  const handlePDFilterUpdate = (filter) => {
    if (filter.type === 'priority') {
      statusCategory = true;
      dueDateOff = true;
      setDueDateSelected({ value: 'All', label: 'All' });
      setCategory('Active');
      handlePriorityFilterChange(priorityOpts_ALL, { action: 'select-option', option: priorityOpts_ALL });
    } else if (filter.type === 'dueDate') {
      statusCategory = true;
      dueDateOff = false;
      setCategory('Active');
      handleDueDateFilterChange(dueDateOpts[0], null, { value: 'Due Date', label: 'Due', subLabel: 'Oldest First', sortBy: 'nonEmptyDueDate', sortByOrder: 'asc' });
      //handleSortChange({value: 'Due Oldest First', label: 'Due', subLabel: 'Oldest First', sortBy: 'dueDate', sortByOrder: 'asc'});
    } else if (filter.type === 'overdue') {
      statusCategory = true;
      dueDateOff = false;
      setCategory('Active');
      handleDueDateFilterChange(dueDateOpts[1], null, { value: 'Overdue', label: 'Due', subLabel: 'Newest First', sortBy: 'dueDate', sortByOrder: 'asc' });
    } else if (filter.type === 'scheduledDesc') {
      statusCategory = true;
      dueDateOff = true;
      setDueDateSelected({ value: 'All', label: 'All' });
      setCategory('Active');
      handleSortChange({ value: 'Upcoming Start Date', label: 'Scheduled', subLabel: 'Oldest First', sortBy: 'startDate', sortByOrder: 'asc' });
    } else if (filter.type === 'completed') {
      dueDateOff = true;
      statusCategory = false;
      setDueDateSelected('All');
      updateFilters('Completed');
    } else if (filter.type === 'taskOrder') {
      dueDateOff = true;
      setDueDateSelected({ value: 'All', label: 'All' });
      handleSortChange(SortByRS[8]);
    } else if (filter.type === 'active') {
      statusCategory = true;
      dueDateOff = true;
      setDueDateSelected({ value: 'All', label: 'All' });
      setCategory('Active');
      updateFilters('Active');
    } else if (filter.type === 'review') {
      dueDateOff = true;
      setDueDateSelected({ value: 'All', label: 'All' });
      const s = { action: 'select-option', option: { value: 'Review', label: 'Review', cat: 'Active' } };
      const data = [{ value: 'Review', label: 'Review', cat: 'Active' }];
      handleFilterChangeRS(data, s);
    }
  };

  const getPriorities = (data = []) => {
    const arr = [];
    data?.forEach(it => {
      if (it.value !== 'All') {
        arr.push(it.value);
      }
    });
    return arr;
  };

  const updateTasksCount = (filtersData) => {
    let payload = {};
    filtersData = filtersData || lastCommittedFD.current;
    if (filtersData) {
      payload = {
        priority: filtersData.priority,
        creatorIds: filtersData.creatorIds,
        assigneeIds: filtersData.assigneeIds,
        dueDate: (filtersData.sortBy === 'nonEmptyDueDate' && filtersData.dueDate === 'All') ? filtersData.sortBy : filtersData.dueDate,
      };
      lastCommittedFD.current = filtersData;
    }
    getAggregateCounts({ locationId, templateId: taskTemplateId, selfAssigned: my, status: 'All', ...payload }).then((data) => {
      //setStats([data.open, data.assigned, data.inprogress, data.review, data.accepted, data.declined, data.rework]);
      let tTotal = 0, tiTotal = 0;
      ALL_TASK_OPTIONS.forEach((item) => {
        let key = item.value.toLowerCase();
        if (key === 'in progress') {
          key = 'inprogress';
        }
        if (key in data) {
          item.count = data[key];
          tTotal += item.count;
        }
      });
      ALL_TASK_OPTIONS[0].count = tTotal;
      ALL_INCOMPLETE_OPTIONS.forEach((item) => {
        const key = item.value.toLowerCase();
        if (key in data) {
          item.count = data[key];
          tiTotal += item.count;
        }
      });
      ALL_INCOMPLETE_OPTIONS[0].count = tiTotal;
      const re = !rePaint;
      setRePaint(re);
    });
  };

  const getJobsAndTask = (type, filterType, cat, sortByType, sortByOrderType, reportersList, assigneesList, tabType, dueDateType, priorityList) => {
    if (sortByType === 'sequenceOrder' || sortingMode) {
      setFilter(ALL_TASK_OPTIONS_0);
    }
    if (type === 'resetStart' || type === 'newTaskReset') {
      nonGrpJobTasksCounter = 0;
      // isFetching = true;
      setPhase(1);
      if (type === 'newTaskReset') {
        setFilter(ALL_TASK_OPTIONS_0);
        filterType = ALL_TASK_OPTIONS_0;
        cat = cat || 'Active';
      } else {
        setNonGrpJobTasks([]);
        setNonGrpJobTasksCount(0);
        setNonGrpTasksCount(0);
      }
    } else if (type === 'nextSetData') {
      nonGrpJobTasksCounter = 0;
      setPhase(2);
    } else if (type === 'init') {
      nonGrpJobTasksCounter = 0;
      setNonGrpJobTasks([]);
      setNonGrpJobTasksCount(0);
      setNonGrpTasksCount(0);
      setPhase(1);
    }
    const isResetCall = type === 'resetStart' || type === 'newTaskReset';

    const prList = priorityList || prioritySelected || [];
    const due = dueDateType || dueDateSelected || {};

    const getTasksData = {
      locationId,
      templateId: taskTemplateId,
      sortBy: sortByType || sortBy,
      sortByOrder: sortByOrderType || sortByOrder,
      selfAssigned: !!my,
      statusCategory: (statusCategory || sortByType === 'sequenceOrder' || sortingMode) ? 'Active' : (cat || category),
      statuses: (sortByType === 'sequenceOrder' || sortingMode) ? ALL_TASKS.split(',') : filterType ? (Array.isArray(filterType) ? getValuesArray(filterType) : [filterType]) : filter ? getValuesArray(filter) : ALL_TASKS.split(','),
      start: isResetCall ? 0 : nonGrpJobTasksCounter,
      limit: (sortByType === 'sequenceOrder' || sortingMode) ? undefined : TASKS_LIMIT,
      dueDate:  dueDateOff ? 'All' : due.value,
      priority: getPriorities(prList),
    };

    if (!my) {
      const reps = [], workers = [];
      const r = reportersList || reportersSelected || [];
      r.forEach(c => reps.push(c.value));
      const a = assigneesList || assigneesSelected || [];
      a.forEach(c => workers.push(c.value));

      getTasksData.creatorIds = reporters && (reporters.length === 0 || reporters.length === reps.length) ? [] : reps;
      getTasksData.assigneeIds = assignees && (assignees.length === 0 || assignees.length === workers.length) ? [] : workers;
    }

    if (typeof type !== 'number') {
      updateTasksCount(getTasksData);
    }

    isFetching = true;
    if ((nonGrpJobTasksCount > nonGrpJobTasks.length || type === 'init' || isResetCall) && type !== 'nextSetData') {
      getTasks2(getTasksData, undefined, undefined, undefined, true).then((data) => {
        if (type === 'newTaskReset') {
          setNonGrpJobTasks([]);
          setNonGrpJobTasksCount(0);
          setNonGrpTasksCount(0);
        }

        return setTempData(data);
      });
    } else {
      isFetching = false;
    }
    nonGrpJobTasksCounter += TASKS_LIMIT;
    updateJobsAndTask;
  };

  const updateJobsAndTask = React.useMemo(() => {
    if (tempData && tempData.numberofTasks === 0) {
      if (phase === 1) {
        getJobsAndTask('nextSetData');
      } else if (phase === 2) {
        isFetching = false;
        tasksNumber = nonGrpJobTasksCount + nonGrpTasksCount;
      }
    }
    if (!tempData || !tempData.jobs) {
      return;
    }

    const data = tempData;
    const newTasks = data.jobs || [];
    const existingTasks = nonGrpJobTasks || [];
    const totalNonGrpJobTasks = data.numberofTasks;
    const all = existingTasks.concat(newTasks);
    setNonGrpJobTasks(all.splice(0));
    if (phase === 1) {
      setNonGrpJobTasksCount(totalNonGrpJobTasks);
    } else if (phase === 2) {
      setNonGrpTasksCount(totalNonGrpJobTasks);
    }
    setTempData(false);
    isFetching = false;
    if (phase === 1 && (newTasks.length + existingTasks.length) === totalNonGrpJobTasks) {
      getJobsAndTask('nextSetData');
    }
    setShowNewTask(false);
  }, [tempData]);

  const isReadyToLoad = () => {
    const currentSelectionCount = phase === 1 ? tasksNumber : nonGrpJobTasksCount + nonGrpTasksCount;
    return nonGrpJobTasks.length < currentSelectionCount && !isFetching && !showNewTask && !loading;
  };

  const noTasksToLoad = () => {
    const currentSelectionCount = (nonGrpJobTasksCount ? nonGrpJobTasksCount : 0) + (nonGrpTasksCount ? nonGrpTasksCount : 0);
    return 0 === currentSelectionCount && !isFetching;
  };

  const handleFilterChangeRS = (data, s) => {
    const action = s.action;
    const currValue = s.option.value;
    let cat = s.option.cat;
    const AT = ALL_TASK_OPTIONS_0;
    const AIT = ALL_INCOMPLETE_OPTIONS_0;

    sortingMode = false;
    setSort(SortByRS[8]);
    let f = [];
    if (currValue === 'All Active') {
      f = action === 'select-option' ? AT : [];
      action === 'select-option' && (cat = 'Active');
    } else if (currValue === 'All Completed') {
      f = action === 'select-option' ? AIT : [];
      action === 'select-option' && (cat = 'Completed');
    } else {
      f = data;
      f = f.filter(st => st.value !== 'All Active' && st.value !== 'All Completed');
    }

    f = f.filter(st => st.cat === cat);
    setFilter(f);
    (action === 'select-option' && (setCategory(cat)));
    if (currValue === 'All Active') {
      setSort(SortByRS[0]);
      setSortBy('createdDate');
      setSortByOrder('asc');
      getJobsAndTask('resetStart', f, cat, 'createdDate', 'asc');
    } else if (cat === 'Completed') {
      setSort(SortByRS[9]);
      setSortByOrder('desc');
      setSortBy('modifiedDate');
      getJobsAndTask('resetStart', f, cat, 'modifiedDate', 'desc');
    } else if (currValue === 'Review') {
      setSort(SortByRS[10]);
      setSortByOrder('asc');
      setSortBy('modifiedDate');
      getJobsAndTask('resetStart', f, cat, 'modifiedDate', 'asc');
    } else {
      setSortBy('createdDate');
      getJobsAndTask('resetStart', f, cat, 'createdDate', 'asc');
    }
  };

  const handleRemove = async () => {
    //await removeTaskFromList(index);
    //await getLocation(locationId);
    await updateTasksCount();
    isFetching = false;
  };

  const insertCopiedTask = (task) => {
    const ts = nonGrpJobTasks.splice(0);
    //ts.splice(index + 1, 0, task);
    ts.unshift(task);
    setNonGrpJobTasks(ts);
  };

  const updateStaticTask = async (taskId, task) => {
    const newArray = nonGrpJobTasks.map(item => item.taskId === taskId ? { ...item, ...task } : item);
    setNonGrpJobTasks(newArray);
  };

  const updateTaskInNonGrpJobTasks = async (taskId, templateId, updateType, tabType, reWorkOldId, copy, fullUpdate) => {
    if (updateType === 'update') {
      updateStaticTask(taskId, templateId);
      return;
    }

    if (reWorkOldId) {
      const response = await getTaskStatus({
        taskId,
        templateId,
      });
      const newArray = nonGrpJobTasks.filter(item =>
        item.taskId !== reWorkOldId);
      setNonGrpJobTasks(newArray);
      getJobsAndTask('newTaskReset');
      nonGrpJobTasks.unshift({ ...response.taskDetails });
      return;
    }
    if (updateType) {
      const newArray = nonGrpJobTasks.filter(item =>
        item.taskId !== taskId);
      if (updateType !== 'complete') {
        //isFetching = true;
      } else {
        ALL_TASK_OPTIONS[0].count--;
        ALL_TASK_OPTIONS[1].count--;
        ALL_INCOMPLETE_OPTIONS[0].count++;
        ALL_INCOMPLETE_OPTIONS[1].count++;
      }
      setNonGrpJobTasks(newArray);
      setNonGrpJobTasksCount(nonGrpJobTasksCount - 1);
      nonGrpJobTasksCounter = nonGrpJobTasksCounter - 1;
    } else {
      const response = await getTaskStatus({
        taskId,
        templateId,
      });
      let newArray = [];
      if (isNotifyPage) {
        newArray.push(response.taskDetails);
        isFetching = false;
      } else if (fullUpdate) {
        newArray = nonGrpJobTasks.map(item =>
          item.taskId === taskId ? { ...response.taskDetails } : item);
      } else {
        if (nonGrpJobTasks[0].stage === 'Copy') {
          nonGrpJobTasks[0].taskId = taskId;
        }
        newArray = nonGrpJobTasks.map(item =>
          item.taskId === taskId ? { ...item, ...response.taskDetails } : item);
      }
      setNonGrpJobTasks(newArray);
      updateTasksCount();
      if (copy) {
        getJobsAndTask('newTaskReset');
      }
    }
  };

  const handleReportersChange = (data) => {
    sortingMode = false;
    setSort(SortByRS[1]);
    setReportersSelected(data);
    getJobsAndTask('resetStart', null, null, 'createdDate', 'asc', data);
  };

  const handleDueDateFilterChange = (data, action, sortOption = false) => {
    sortingMode = false;
    const sortData = sortOption || SortByRS[6];
    let sortBy, sortByOrder, p;
    setDueDateSelected(data);
    if (sort.label !== 'Due' || sortOption) {
      sortBy = sortData.sortBy;
      sortByOrder = sortData.sortByOrder;
      setSort(sortData);
      setSortBy(sortBy);
      setSortByOrder(sortByOrder);
    }
    if (prioritySelected.label !== 'All') {
      setPrioritySelected(priorityOpts_ALL);
      p = priorityOpts_ALL;
    }
    setFilter(ALL_TASK_OPTIONS_0);
    getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, 'Active', sortBy, sortByOrder, null, null, null, data, p);
  };

  const handleAssigneesChange = (data) => {
    sortingMode = false;
    setSort(SortByRS[1]);
    setAssigneesSelected(data);
    getJobsAndTask('resetStart', null, null, 'createdDate', 'asc', null, data);
  };

  const handlePriorityFilterChange = (data, s) => {
    sortingMode = false;
    const action = s.action;
    const currValue = s.option.value;
    const sortData = SortByRS[4];
    let sortBy, sortByOrder, d;

    let p = [];
    if (currValue === 'All') {
      p = [];
    } else if (currValue === 0) {
      p = action === 'select-option' ? priorityOpts_NO : [];
    } else {
      p = data.filter(p => p.value !== 'All' && p.value !== 0);
    }
    setPrioritySelected(p);
    if (sort.label !== 'Priority') {
      sortBy = sortData.sortBy;
      sortByOrder = sortData.sortByOrder;
      setSort(sortData);
      setSortBy(sortBy);
      setSortByOrder(sortByOrder);
    }
    if (dueDateSelected.label !== 'All') {
      d = dueDateOpts[0];
      setDueDateSelected(dueDateOpts[0]);
    }
    setFilter(ALL_TASK_OPTIONS_0);
    getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, 'Active', sortBy, sortByOrder, null, null, null, d, p);
  };

  const getFiltersCount = () => {
    let count = 0;
    if (filter) {
      const countItems = ALL_TASK_OPTIONS.concat(ALL_INCOMPLETE_OPTIONS);
      filter.forEach((item) => {
        let countItem = countItems.filter(ci => ci.value === item.value);
        countItem = countItem.length > 0 ? countItem[0] : [{}];
        count += parseInt(countItem.count ? countItem.count : 0);
      });
    }
    return count;
  };

  const expandEllipsisMenu = async () => {
    await fetchCustomGroups(true);
    setShowEllipsisMenu(!showEllipsisMenu);
  };

  const fetchCustomGroups = (firstFetch = false) => {
    const data = {
      locationId,
      sortBy: 'createdDate',
      sortByOrder: 'desc',
      selfAssigned: false,
    };
    getCustomGroups(data, undefined, '', '', firstFetch);
  };

  const handleCloseGroupModal = () => {
    setShowMoveToGroupModal(false);
  };

  const showGroupModal = () => {
    setShowMoveToGroupModal(true);
  };

  const handleNavToTargetID = async () => {
    history.push(URLS.TASK_DETAILS(locationId, targetId));
  };

  const moveTasksToGroup = (targetTemplateId) => {
    setShowMoveToGroupModal(false);
    handleCloseGroupModal();
    const taskIds = [];
    bulkSelectTaskArray.forEach(task => taskIds.push(task.taskId));
    targetId = targetTemplateId;
    const data = {
      locationId,
      targetTemplateId: targetTemplateId,
      templateType: 'Custom',
      taskIds,
    };
    moveToTaskGroup(data);
    setBulkSelectTaskArray([]);
    initTasks();
    toast(t('Tasks moved.'), 3000, t('Go to group.'), handleNavToTargetID);
  };

  const createTasksToGroup = async () => {
    setShowMoveToGroupModal(false);
    handleCloseGroupModal();
    const taskIds = [];
    bulkSelectTaskArray.forEach(task => taskIds.push(task.taskId));
    const data = {
      locationId,
      templateName: 'New Group',
      templateType: 'Custom',
      taskIds,
    };
    setBulkSelectTaskArray([]);
    const res = await moveToTaskGroup(data);
    history.push(URLS.TASK_DETAILS(locationId, res.templateId), { templateId: res.templateId });
  };

  const handleBulkUpdate = async (values) => {
    setShowPriority(false);
    setShowDueDate(false);
    setShowScheduleModal(false);
    setShowAssignModal(false);
    const data = {
      taskIds: bulkSelectTaskArray.map(item => item.taskId),
      priority: values?.selectedPriority > 0 ? values.selectedPriority : null,
      dueDate: values.dueDate ? DateUtils.unicodeFormat(values.dueDate, 'yyyy-MM-dd') : undefined,
      assignee: values.userName ? values.userName : values.assigneeMobile ? values.assigneeMobile : undefined,
    };
    let recurringData = [];
    if (values.repeat?.indexOf('-') > -1) {
      recurringData = values.repeat.split('-');
      values.repeat = recurringData[0] === 'everyMinute' ? recurringData[0] : 'Hourly';
    }
    const dataWithTaskRecurring = {
      taskIds: bulkSelectTaskArray.map(item => item.taskId),
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: values.repeat ? values.repeat : undefined,
        startDate: values.date ? DateUtils.unicodeFormat(values.date, 'yyyy-MM-dd') : undefined,
        startTime: values.startTime ? values.startTime : undefined,
        endTime: values.endTime ? values.endTime : undefined,
        dayofWeek: values.repeat === 'Weekly' ? DateUtils.getDayOfWeek(values.date) : undefined,
        dayofMonth: ['Monthly', 'Yearly'].indexOf(values.repeat) > -1 ? DateUtils.getDayOfMonth(values.date) : undefined,
        monthofYear: values.repeat === 'Yearly' ? DateUtils.getMonthOfYear(values.date) : undefined,
        [recurringData[0]]: recurringData[1],
      },
    };
    if (values.date) {
      await getBulk(dataWithTaskRecurring);
      setBulkSelectTaskArray([]);
      toast(t('Tasks updated'));
      getJobsAndTask('resetStart');
    } else {
      await getBulk(data);
      setBulkSelectTaskArray([]);
      toast(t('Tasks updated'));
      getJobsAndTask('resetStart');
    }
  };


  const onAssign = () => {
    getContacts(locationId);
    setShowAssignModal(show => !show);
  };

  const updateFilters = (type) => {
    if (type === 'Completed') {
      const s = { action: 'select-option', option: { value: 'Completed', label: 'Completed', cat: 'Completed' } };
      const data = [{ value: 'Completed', label: 'Completed', cat: 'Completed' }];
      handleFilterChangeRS(data, s);
    } else if (type === 'Review') {
      const countItems = ALL_TASK_OPTIONS;
      let countItem = countItems.filter(ci => ci.value === type);
      countItem = countItem.length > 0 ? countItem[0] : [{}];
      const reviewTasksCount = parseInt(countItem.count ? countItem.count : 0);

      if (reviewTasksCount > 1) {
        const s = { action: 'select-option', option: { value: 'Review', label: 'Review', cat: 'Active' } };
        const data = [{ value: 'Review', label: 'Review', cat: 'Active' }];
        handleFilterChangeRS(data, s);
      } else {
        const s = { action: 'select-option', option: { value: 'All Active', label: 'All Active', cat: 'Active' } };
        const data = [{ value: 'All Active', label: 'All Active', cat: 'Active' }];
        handleFilterChangeRS(data, s);
      }
    } else if (type === 'Declined') {
      const s = { action: 'select-option', option: { value: 'All Active', label: 'All Active', cat: 'Active' } };
      const data = [{ value: 'All Active', label: 'All Active', cat: 'Active' }];
      handleFilterChangeRS(data, s);
    } else if (type === 'Active') {
      const s = { action: 'select-option', option: { value: 'All Active', label: 'All Active', cat: 'Active' } };
      const data = [{ value: 'All Active', label: 'All Active', cat: 'Active' }];
      handleFilterChangeRS(data, s);
    } else if (type === 'Task Order') {
      handlePDFilterUpdate({ type: 'taskOrder'});
    }
    updateTasksCount();
  };

  const sortNonGrpJobTasksBySequenceOrder = () => {
    if (nonGrpJobTasks.length > 0) {
      const largest = Math.max(...nonGrpJobTasks.map(o => o.sequenceOrder), 0);
      return largest + 1;
    } else {
      return 0;
    }
  };

  const handleAddTask = async (task, type) => {
    setLoading(true);
    if (simplifiedMode) {
      insertCustomTask(task);
      setShowNewTask(true);
    }
    setInitTaskData(null);

    const { taskRecurring = {} } = task;
    const date = taskRecurring.date || new Date();
    const data = {
      locationId,
      templateId: taskTemplateId,
      task: task.title,
      imageRequired: task.imageRequired,
      sequeceOrder: sortNonGrpJobTasksBySequenceOrder(),
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: taskRecurring.repeat || 'OneTime',
        startTime:
          taskRecurring.startTime,
        endTime:
          taskRecurring.endTime,
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
      },
    };

    try {
      const { taskId } = await manageTask(data);
      const { photos } = task;
      if (photos && photos.length) {
        const values = await toBase64Array(photos);
        const files = values.reduce((acc, cur) => {
          acc.push(cur.value);
          return acc;
        }, []);

        await uploadImages(files, taskId, 'adhoc');
      }
      toast(type ? t(`Task ${type} updated`) : t('task_add'));

      if (task.assignData) {
        const assignData = {
          taskId,
          status: 'assigned',
          assignee:
            task.assignData.assigneeUserName || task.assignData.assignee,
        };

        await assignTask(assignData);
      }
      getJobsAndTask('newTaskReset');
      getLocation(locationId);
      updateTasksCount();
      if (newTaskData || isFirstTime) {
        updateSideGroupList();
      }
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
    showNewTaskForm = false;
    //setShowNewTask(false);
    setLoading(false);
  };

  const handleSortChange = (event) => {
    let p, d;
    setSort(event);
    setSortBy(event.sortBy);
    setSortByOrder(event.sortByOrder);

    if (event.label !== 'Priority' && prioritySelected.label !== 'All') {
      p = priorityOpts_ALL;
      setPrioritySelected(p);
    }

    if (event.label !== 'Due' && dueDateSelected.label !== 'All') {
      d = dueDateOpts[0];
      setDueDateSelected(dueDateOpts[0]);
    }
    if (event.sortBy === 'sequenceOrder') {
      sortingMode = true;
    } else {
      sortingMode = false;
    }
    if (event.value === 'Upcoming Start Date') {
      setFilter(ALL_TASK_OPTIONS_0);
      getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, 'Active', event.sortBy, event.sortByOrder, null, null, null, d, p);
    } else {
      setFilter(ALL_TASK_OPTIONS_0);
      getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, 'Active', event.sortBy, event.sortByOrder, null, null, null, d, p);
    }
  };

  const handleClickTemplate = (event) => {
    if (!areTemplatesAvailable) {
      return;
    } else {
      event.preventDefault();
      selectTemplate();
      return;
    }
  };

  const selectTemplate = () => {
    const { activeList, selectedTemplate } = newTemplateData;
    updateTemplateData({ activeList, selectedTemplate, templateName: taskSummary.templateName, taskTemplateId, tm, inProgress: true });
    history.push(URLS.TASK_TEMPLATES(locationId));
  };

  const createTemplate = async () => {
    const cloneTemplateData = {
      templateId: newTemplateData?.selectedTemplate?.templateDetails?.templateId,
      templateName: newTemplateData.templateName ? newTemplateData.templateName : newTemplateData.selectedTemplate.referenceTemplateName,
      locationId,
      createdBy: profile.username,
      taskRecurring: {
        timeZone: DateUtils.getCurrentTZName(),
        recurringType: 'OneTime',
        startDate: DateUtils.unicodeFormat(new Date(), 'yyyy-MM-dd'),
        startTime: DateUtils.roundToNextMinutes(new Date()),
        endTime: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
      },
    };
    setTemplateCreated(true);

    const { templateId } = await cloneTemplate(cloneTemplateData);
    history.push({ pathname: URLS.TASK_DETAILS(locationId, templateId, newTemplateData.tm), state: { templateType: 'Main' } });

    updateTemplateData({});
  };

  const insertCustomTask = (targetTask) => {
    templateTasksInfo.tasks = templateTasksInfo.tasks || [];
    templateTasksInfo.tasks.push({ task: targetTask.title });
    setTasksInfo({ ...templateTasksInfo });
  };

  const getFilterCopy = () => {
    if (filter && filter.length === 1) {
      return `${filter[0].value}`;
    } else {
      return 'Tasks ';
    }
  };

  const initTasks = async () => {
    const fr = filterData || {};
    const restoreFilters = Object.keys(fr).length > 0;
    isFetching = true;
    if (restoreFilters) {
      setCategory(fr.category);

      setFilter(fr.filter);
      setReportersSelected(fr.reportersSelected);
      setAssigneesSelected(fr.assigneesSelected);
      setSort(fr.sort);
      setSortBy(fr.sortBy);
      setSortByOrder(fr.sortByOrder);

    } else if (filterType || locationFilter) {
      const ft = filterType || locationFilter;

      const filterT = ALL_TASK_OPTIONS.filter((f) => f.value === ft);
      setFilter(filterT);

    } else if (!filterType) {
      setFilter(ALL_TASK_OPTIONS_0);

    } else {
      setFilter(locationFilter);
    }
    const reporters = [], assignees = [];
    await getReportersByLocId(locationId).then(({ contacts = [] }) => {
      contacts.forEach(c => reporters.push({ value: c.contactId, label: c.firstName ? `${c.firstName} ${c.lastName ? c.lastName.charAt(0) : ''}` : c.userName }));
      setReporters(reporters);
    });
    await getAssigneeByLocId(locationId).then(({ contacts = [] }) => {
      contacts.forEach(c => assignees.push({ value: c.contactId, label: c.firstName ? `${c.firstName} ${c.lastName ? c.lastName.charAt(0) : ''}` : c.userName }));
      setAssignees(assignees);
    });
    updateTasksCount();

    handleSortChange(SortByRS[8]);
  };

  const keyNavigation = (key) => {
    const allEles = document.querySelectorAll('.key-nav');
    if (!allEles.length) {
      return;
    }
    const rowLen = 5;
    const currentEle = document.activeElement;
    let nextEle = allEles[0];
    for (let i = 0; i < allEles.length; i++) {
      if (currentEle === allEles[i]) {
        if (key === 'right' && i !== allEles.length - 1) {
          nextEle = allEles[i + 1];
        }
        if (key === 'left' && i !== 0) {
          nextEle = allEles[i - 1];
        }
        if (key === 'down' && i !== allEles.length - 1 && allEles[i + rowLen]) {
          nextEle = allEles[i + rowLen];
        }
        if (key === 'up' && i !== 0 && allEles[i - rowLen]) {
          nextEle = allEles[i - rowLen];
        }
        break;
      }
    }
    nextEle.focus();
  };
  const attachKBEvents = () => {
    hotkeys('left, up, right, down', 'tableNav', (e, key = {}) => {
      switch (key.key) {
        case 'right': {
          keyNavigation(key.key);
          break;
        }
        case 'left': {
          keyNavigation(key.key);
          break;
        }
        case 'down': {
          //keyNavigation(key.key);
          break;
        }
        case 'up': {
          //keyNavigation(key.key);
          break;
        }
      }
    });
    hotkeys.setScope('tableNav');
  };

  const isTm = profile.isWorker || my || filter === 'Assigned';

  const handleShowNewTask = async () => {
    if (!sortingMode) {
      setSort(SortByRS[8]);
      setSortBy(SortByRS[8].sortBy);
      setSortByOrder(SortByRS[8].sortByOrder);
      sortingMode = true;
      await getJobsAndTask('newTaskReset', ALL_TASK_OPTIONS_0, null, 'sequenceOrder', 'asc', reporters, assignees, t);
      showNewTaskForm = true;
    } else {
      setShowNewTask(true);
    }
  };

  const onTaskCardDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) { return; }
    if (destination.index === source.index) {
      return;
    } else if (destination.index !== source.index) {
      const draggedTask = nonGrpJobTasks[source.index];
      nonGrpJobTasks.splice(source.index, 1);
      nonGrpJobTasks.splice(destination.index, 0, draggedTask);

      const tasks = [];
      nonGrpJobTasks.forEach((item, index) => {
        tasks.push({ taskId: item.taskId, sequenceOrder: index });
      });
      setNonGrpJobTasks(nonGrpJobTasks);
      await updateSequenceOrder({ tasks });
    } else {
      return;
    }
  };

  React.useEffect(() => {
    initTasks();
  }, [taskTemplateId]);

  React.useEffect(() => {
    if (simplifiedMode) {
      attachKBEvents();
      // handleSortChange(SortByRS[0]);
    } else {
      hotkeys.deleteScope('tableNav');
      // handleSortChange(SortByRS[0]);
    }
  }, [simplifiedMode]);

  React.useEffect(() => {
    getLocation(locationId);
    getLocationZones(locationId);
    return resetTasksInfo;
  }, [taskTemplateId]);

  React.useEffect(() => {
    if (newTemplateData.selectedTemplate && !templateCreated) {
      createTemplate();
    }
  }, []);

  React.useEffect(() => {
    if (customJobCompleted && nonGrpJobTasks.length === 0) {
      history.push(URLS.LOCATION(locationId));
    }
  }, [customJobCompleted, nonGrpJobTasks]);

  const minDate = React.useMemo(() => {
    if (!bulkSelectTaskArray) {
      return;
    }
    return bulkSelectTaskArray.sort((a, b) => new Date(b.taskRecurring.startDate) - new Date(a.taskRecurring.startDate)).map(item => item.taskRecurring.startDate)[0];
  }, [bulkSelectTaskArray]);

  React.useEffect(() => {
    return () => {
      newTaskBtnRef?.current?.focus();
    };
  }, [nonGrpJobTasks, simplifiedMode, filter, sort]);

  React.useMemo(() => {
    if (history.location?.state?.isFirstTime || history.location?.data?.isFirstTime) {
      setIsFirstTime(true);
    }
  },[]);

  const isNewGroup = React.useMemo(() => {
    return !isFetching && !loading && !nonGrpJobTasks.length && !showNewTask && !taskInProgress && isFirstTime && editable;
  },[isFetching, loading, nonGrpJobTasks, showNewTask, taskInProgress, isFirstTime, editable]);

  const shouldHideHeader = React.useMemo(() => {
    return !taskSummary.numberofTasks && !showNewTask && !taskInProgress && isFirstTime && editable && !nonGrpJobTasks.length;
  },[taskSummary, showNewTask, taskInProgress, isFirstTime, editable]);

  const loadingState = useSelector(state => {
    return !state.templateTasks || state.templateTasks.initialLoading;
  }) || isLoading;

  React.useMemo(() => {
    if (showNewTaskForm && !isFetching) {
      setShowNewTask(true);
    }
  },[showNewTaskForm, isFetching]);

  if (loadingState || !templateTasksInfo) {
    return (
      <GroupLoader />
    );
  }

  return (
    <div className='container bg-light'>
      {!shouldHideHeader && <Accordion defaultActiveKey={null}>
        <div className='mb-3 pt-3'>
          <div className="d-flex">
            <div className="px-0">
              <h4 className="mt-1">{' '}{getFilterCopy('Tasks')}<small className="text-muted"> ({getFiltersCount()})</small></h4>
            </div>
            <div className="col px-0 text-right">
              {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && bulkSelectTaskArray.length !== 0 && (
                <button onClick={expandEllipsisMenu} id="batch-actions-toggle" className="btn btn-outline-primary collapsed" role="button" data-toggle="collapse" aria-expanded="false" aria-controls="batch-menu">
                  <i className="fas fa-th" aria-hidden="true"></i>
                  <span className="sr-only">Batch Actions</span>
                </button>
              )}
              {showEllipsisMenu && (
                <EllipsisMenuV3
                  handler={setShowEllipsisMenu}
                  isSetPriorityActive={true}
                  setPriority={() => setShowPriority(true)}
                  isAssignActive={true}
                  handleAssignClick={onAssign}
                  isSetDueDateActive={true}
                  setDueDate={() => setShowDueDate(true)}
                  isSetStartDateActive={true}
                  setStartDate={() => setShowScheduleModal(true)}
                  isMoveToGroupActive={true}
                  handleMoveToGroup={showGroupModal}
                  isCreateGroupActive={true}
                  handleCreateGroup={createTasksToGroup}

                  isBulkSelectMenu={true}
                  isCopyActive={false}
                  isDescriptionActive={false}
                  isAssociateActive={false}
                />
              )}
              <button className="btn btn-outline-secondary ml-2" role="button" data-toggle="collapse" href="#page-view" aria-expanded="false" aria-controls="page-view" onClick={handleView}>
                <i className="far fa-eye" aria-hidden="true"></i>
                <span className="sr-only">Page View</span>
              </button>
              {showViewMenu && <ViewMenu
                handler={setShowViewMenu}
                isGroupCard={true}

                isListViewActive={true}
                handleListView={() => handleViewChange('Simplified')}
                isCardViewActive={true}
                handleCardView={() => handleViewChange('Card')}
                isCalViewActive={false}

              />}
              <Button variant="outline-secondary" className="ml-2" role="button" onClick={() => setShowPreDefinedFilters(true)}>
                <i className="fas fa-sort-size-down" aria-hidden="true"></i>
                <span className="sr-only">Quick Filter and Sort</span>
              </Button>
              {showPreDefinedFilters && <PreDefinedFiltersModal
                onClose={() => setShowPreDefinedFilters(false)}
                onUpdate={handlePDFilterUpdate}
                show={showPreDefinedFilters}
                isTaskOrder={true}
                sortData={{ sort, prioritySelected, dueDateSelected }}
              />}
              <ToggleButton eventKey='1' className="btn btn-outline-secondary ml-2" role="button" data-toggle="collapse" href="#task-filters" aria-expanded="false" aria-controls="task-filters">
                <i className="fas fa-filter" aria-hidden="true"></i>
                <span className="sr-only">Filter Tasks</span>
              </ToggleButton>
              {((locationUserRole === 'Owner' || locationUserRole === 'Manager') && !tasksActions.isDescriptionFocused && !showNewTask && showCreateBtn) && (<Button className="add-task btn btn-primary rounded-circle text-white position-fixed" role="button" title={t('create_task')} data-target='button-create-task' disabled={showNewTask} onClick={handleShowNewTask} ref={newTaskBtnRef} autoFocus>
                <i className="far fa-plus" aria-hidden="true"></i>
                <span className="sr-only">Create Task</span>
              </Button>)}
            </div>
          </div>
          <p className="small text-secondary mb-0"><Trans>{`Sorted by: ${sort?.value}`}</Trans></p>
        </div>
        <Accordion.Collapse eventKey='1' className='row'>
          <div className='col'>
            <div className={'row bg-white border-top border-bottom py-3 mb-3'}>
              <div className='col'>
                <div className='form-group mb-2'>
                  <label className='text-secondary mb-1' htmlFor='status'>
                    <small><Trans i18nKey="status" /></small>
                  </label>
                  <Select
                    value={filter}
                    isMulti
                    name="filtersRS"
                    options={filterOpts}
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    components={{ ValueContainer, Option, ClearIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={customStyles}
                    isSearchable={false}
                    onChange={handleFilterChangeRS}
                  />
                </div>
                <div className='form-group mb-2'>
                  <label className='text-secondary mb-1' htmlFor='sort'>
                    <small>Creator</small>
                  </label>
                  <Select
                    value={reportersSelected}
                    id='creators'
                    isMulti
                    options={reporters}
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    components={{ ValueContainer: ValueContainer2, Option, ClearIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={customStyles3}
                    menuPlacement="bottom"
                    isSearchable={false}
                    onChange={handleReportersChange}
                    formatOptionLabel={(d) => <span className="text">{d.label}<small className="text-muted"> {d.subLabel}</small></span>}
                  />
                </div>
                <div className='form-group mb-2'>
                  <label className='text-secondary mb-1' htmlFor='sort'>
                    <small>Due Date</small>
                  </label>
                  <Select
                    value={dueDateSelected}
                    defaultValue={'value'}
                    id='dueDate'
                    options={dueDateOpts}
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    components={{ ClearIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={customStyles2}
                    menuPlacement="bottom"
                    isSearchable={false}
                    onChange={handleDueDateFilterChange}
                    formatOptionLabel={(d) => <span className="text">{d.label}<small className="text-muted"> {d.subLabel}</small></span>}
                  />
                </div>
              </div>
              <div className='col pl-0'>
                <div className='form-group mb-2'>
                  <label className='text-secondary mb-1' htmlFor='sort'>
                    <small>Assignee</small>
                  </label>
                  <Select
                    value={assigneesSelected}
                    id='assignees'
                    isMulti
                    options={assignees}
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    components={{ ValueContainer: ValueContainer2, Option, ClearIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={customStyles2}
                    menuPlacement="bottom"
                    isSearchable={false}
                    onChange={handleAssigneesChange}
                    formatOptionLabel={(d) => <span className="text">{d.label}<small className="text-muted"> {d.subLabel}</small></span>}
                  />
                </div>
                <div className='form-group mb-2'>
                  <label className='text-secondary mb-1' htmlFor='sort'>
                    <small><Trans i18nKey="sort_by" /></small>
                  </label>
                  <Select
                    value={sort}
                    defaultValue={'value'}
                    id='sort'
                    options={SortByRS.filter(item => (item.value !== 'Recently Completed' && item.value !== 'Require Review'))}
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    components={{ ClearIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={customStyles2}
                    menuPlacement="bottom"
                    isSearchable={false}
                    onChange={handleSortChange}
                    formatOptionLabel={(d) => <span className="text">{d.label}<small className="text-muted"> {d.subLabel}</small></span>}
                  />
                </div>
                <div className='form-group mb-2'>
                  <label className='text-secondary mb-1' htmlFor='sort'>
                    <small>Priority</small>
                  </label>
                  <Select
                    value={prioritySelected}
                    id='priority'
                    isMulti
                    options={priorityOpts}
                    classNamePrefix="select"
                    hideSelectedOptions={false}
                    components={{ ValueContainer: ValueContainer2, Option, ClearIndicator: () => null, IndicatorSeparator: () => null }}
                    styles={customStyles3}
                    menuPlacement="bottom"
                    isSearchable={false}
                    onChange={handlePriorityFilterChange}
                    formatOptionLabel={(d) => <span className="text">{d.label}<small className="text-muted"> {d.subLabel}</small></span>}
                  />
                </div>
              </div>
            </div>
          </div>
        </Accordion.Collapse>
      </Accordion>}

      {isNewGroup && (
        <div className="row justify-content-center pt-3 pb-2 bg-light" id="tasks">
          <div className="col-12">
            <div id="new-group">
              <div className="row mb-3 pt-1">
                <div className="col text-center">
                  <h4 className="mt-1">What would you like to do?</h4>
                </div>
              </div>
              <div className="mb-4">
                <a className="d-block text-center p-3 border border-primary bg-white rounded text-primary" id="create-task-first" role="button" onClick={handleShowNewTask} data-target="create-task-button">
                  <i className="far fa-2x fa-plus" aria-hidden="true"></i>
                  <br />
                  <h5 className="mt-2">Create a Task</h5>
                  <p className="mb-0 small text-secondary">Tasks are individual work items.</p>
                </a>
              </div>
              <hr className="my-4" />
              <div className="text-center mb-3">
                <img className="rounded fade-50 mr-1" src="../../../assets/img/noun_hotel.svg" width="40" />
                <img className="rounded fade-50 mr-1" src="../../../assets/img/noun_fire.svg" width="40" />
                <img className="rounded fade-50 mr-1" src="../../../assets/img/noun_plumbing.svg" width="40" />
                <img className="rounded fade-50 mr-1" src="../../../assets/img/noun_clean.svg" width="40" />
                <img className="rounded fade-50 mr-1" src="../../../assets/img/noun_construction.svg" width="40" />
                <img className="rounded fade-50 mr-1" src="../../../assets/img/noun_school.svg" width="40" />
              </div>
              <a className={`d-block text-center p-3 border border-primary bg-white rounded text-primary ${areTemplatesAvailable ? '' : 'disabled'}`} role="button" href="#" onClick={handleClickTemplate}>
                <i className="far fa-2x fa-search" aria-hidden="true"></i>
                <br />
                <h5 className="mt-2">
                  <Trans
                    i18nKey="browse_marketplace"
                    defaults="Browse Marketplace"
                  />
                </h5>
                <p className="mb-0 small text-secondary">Jump start your work by creating a group using predefined industry templates.</p>
              </a>
            </div>
          </div>
        </div>
      )}

      {taskSummary?.templateType === 'Custom' && !sortingMode && <div className='pt-0'>
        <InfiniteScroll pageStart={0} loadMore={getJobsAndTask} hasMore={isReadyToLoad()}>
          {nonGrpJobTasks && nonGrpJobTasks.map((task, taskIdx) => (
            <div className='zone-task-list' key={taskIdx}>
              <div key={taskIdx} className='row justify-content-center bg-light'>
                <div className='col-12' >
                  {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && (task.stage === 'Copy' || task.stage === 'Assigned' || task.stage === 'Accepted' || task.stage === 'Review' || task.stage === 'Rework' || task.stage === 'Open') ?
                    <TaskCard
                      key={task.taskId || task.templateId}
                      task={{ ...task, taskType: 'CustomGroupTask', templateId: taskTemplateId }}
                      index={taskIdx}
                      isCustom={taskSummary?.templateType === 'Custom'}
                      isOnTaskDetailsPage={true}
                      updateTaskGroup={getTaskTemplateInfo}
                      getLocation={getLocation}
                      onRemove={handleRemove}
                      taskSummary={taskSummary}
                      setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                      setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                      numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                      numberofCustomTasksToReview={numberofCustomTasksToReview}
                      customJobCompleted={customJobCompleted}
                      disableWorkerActions={profile.username !== task.assigneeUserName}
                      locationUserRole={locationUserRole}
                      cardSkin={simplifiedMode ? 'simple' : ''}
                      bulkSelectTaskArray={bulkSelectTaskArray}
                      setBulkSelectTaskArray={setBulkSelectTaskArray}
                      updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                      sortingMode={sortingMode}
                      updateStaticTask={updateStaticTask}
                      updateFilters={updateFilters}
                      setShowCreateBtn={setShowCreateBtn}
                    />
                    : profile.username === task.assigneeUserName ?
                      <WorkerTaskCard
                        key={task.taskId || task.templateId}
                        task={{ ...task, taskType: 'CustomGroupTask', templateId: taskTemplateId }}
                        index={taskIdx}
                        isCustom={taskSummary?.templateType === 'Custom'}
                        isOnTaskDetailsPage={false}
                        updateTaskGroup={getTaskTemplateInfo}
                        getLocation={getLocation}
                        onRemove={handleRemove}
                        taskSummary={taskSummary}
                        setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                        setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                        numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                        numberofCustomTasksToReview={numberofCustomTasksToReview}
                        customJobCompleted={customJobCompleted}
                        cardSkin={simplifiedMode ? 'simple' : ''}
                        updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                        sortingMode={sortingMode}
                        updateFilters={updateFilters}
                        locationUserRole={locationUserRole}
                        insertCopiedTask={insertCopiedTask}
                        setShowCreateBtn={setShowCreateBtn}
                      />
                      :
                      <WorkerTaskCard
                        key={task.taskId || task.templateId}
                        task={{ ...task, taskType: 'CustomGroupTask', templateId: taskTemplateId }}
                        index={taskIdx}
                        isCustom={taskSummary?.templateType === 'Custom'}
                        isOnTaskDetailsPage={true}
                        updateTaskGroup={getTaskTemplateInfo}
                        getLocation={getLocation}
                        onRemove={handleRemove}
                        taskSummary={taskSummary}
                        setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                        setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                        numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                        numberofCustomTasksToReview={numberofCustomTasksToReview}
                        customJobCompleted={customJobCompleted}
                        isReadOnly
                        cardSkin={simplifiedMode ? 'simple' : ''}
                        sortingMode={sortingMode}
                        updateFilters={updateFilters}
                        locationUserRole={locationUserRole}
                        insertCopiedTask={insertCopiedTask}
                        setShowCreateBtn={setShowCreateBtn}
                      />
                  }
                </div>
              </div>
            </div>
          )
          )}
        </InfiniteScroll>
        {isFetching && !showNewTask && !isFirstTime && (
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
        )}
        {isFetching && !showNewTask && isFirstTime && <GroupLoader noContainer={true} />}

      </div>}

      {sortingMode && (
        <>
          <DragableTaskList
            nonGrpJobTasks={nonGrpJobTasks}
            onTaskCardDragEnd={onTaskCardDragEnd}
            taskTemplateId={taskTemplateId}
            taskSummary={taskSummary}
            getTaskTemplateInfo={getTaskTemplateInfo}
            getLocation={getLocation}
            handleRemove={handleRemove}
            setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
            setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
            numberofCustomTasksReviewed={numberofCustomTasksReviewed}
            numberofCustomTasksToReview={numberofCustomTasksToReview}
            customJobCompleted={customJobCompleted}
            locationUserRole={locationUserRole}
            simplifiedMode={simplifiedMode}
            bulkSelectTaskArray={bulkSelectTaskArray}
            setBulkSelectTaskArray={setBulkSelectTaskArray}
            updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
            sortingMode={sortingMode}
            isOnTaskDetailsPage={true}
            insertCopiedTask={insertCopiedTask}
            updateFilters={updateFilters}
            setShowCreateBtn={setShowCreateBtn}
          />
          {isFetching && !showNewTask && !isFirstTime && (
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
          )}
          {isFetching && !showNewTask && isFirstTime && <GroupLoader noContainer={true} />}
        </>)}

      {showNewTask && !simplifiedMode &&
        <div className='pt-0'>
          <NewTask
            initData={initTaskData}
            onDelete={() => setShowNewTask(false)}
            onUpdate={handleAddTask}
            cardSkin={simplifiedMode ? 'simple' : ''}
          />
        </div>
      }

      {showNewTask && simplifiedMode &&
        <div className='container pt-0'>
          <div className='row justify-content-center pb-2 bg-light'>
            <div className='col-12'>
              <NewTask
                initData={initTaskData}
                onDelete={() => setShowNewTask(false)}
                onUpdate={handleAddTask}
                cardSkin={simplifiedMode ? 'simple' : ''}
              />
            </div>
          </div>
        </div>
      }
      <div className="clearfix" style={{ paddingTop: '65px' }}></div>

      {!isFirstTime && !loading && !tasksNumber && !nonGrpJobTasks.length && !showNewTask && noTasksToLoad() &&
        (
          <div id="zero-tasks" data-target="no-task-description">
            <div className="row mb-3 pt-1">
              <div className="col text-center">
                <img className="mb-3" src="/assets/img/empty.png" alt={t('empty')} width="200" />
                {
                  isTm ? (
                    <>
                      <p className="mb-3 text-secondary">
                        <em><Trans i18nKey="no_tasks_text" /></em>
                      </p>
                      {!profile.isWorker && (
                        <Button
                          className="mb-3"
                          variant="primary"
                          onClick={() => history.push(URLS.LOCATION(locationId))}
                        >
                          <Trans
                            i18nKey="visit_tasks_wlocation"
                            defaults="Visit all tasks in {{address}}"
                            values={{
                              address: loc?.address?.addressLine1
                            }}
                          />
                        </Button>
                      )}
                      <br />
                      <Link to={URLS.LOCATIONS}>
                        <i className="far fa-arrow-left" aria-hidden="true"></i>
                        <Trans i18nKey="back_to_loc" />
                      </Link>
                    </>
                  ) :
                    (
                      <>
                        <p className="mb-0 text-secondary">
                          <em>
                            <Trans i18nKey="no_active_tasks1" defaults="Looks like you have no active tasks." />
                            <br />
                            <Trans i18nKey="no_active_tasks1" defaults="Use the button below to create a task." />
                          </em>
                        </p>
                      </>
                    )
                }
              </div>
            </div>
          </div>
        )
      }
      <PriorityModal
        show={showPriority}
        onUpdate={handleBulkUpdate}
        onClose={() => setShowPriority(false)}
      />
      <AssignModal
        onClose={() => setShowAssignModal(false)}
        onUpdate={handleBulkUpdate}
        show={showAssignModal}
        isJob={false}
      />
      <DueDateModal
        show={showDueDate}
        onUpdate={handleBulkUpdate}
        onClose={() => setShowDueDate(false)}
        minDate={minDate}
      />
      <ScheduleModal
        onClose={() => setShowScheduleModal(false)}
        onUpdate={handleBulkUpdate}
        show={showScheduleModal}
      />
      <MoveToGroupModal
        onClose={handleCloseGroupModal}
        onUpdate={moveTasksToGroup}
        show={showMoveToGroupModal}
        createTasksToGroup={createTasksToGroup}
        fetchCustomGroups={fetchCustomGroups}
      />
    </div>
  );
};
CustomJobTasks.propTypes = {
  newTaskData: PropTypes.object,
  editable: PropTypes.bool,
  taskSummary: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  setAllCustomeJobReviewsInListCompleted: PropTypes.func,
  setNumberofCustomTasksReviewed: PropTypes.func,
  numberofCustomTasksReviewed: PropTypes.number,
  numberofCustomTasksToReview: PropTypes.number,
  customJobCompleted: PropTypes.bool,
  locationUserRole: PropTypes.string,
  simplifiedMode: PropTypes.bool,
  loc: PropTypes.object,
  my: PropTypes.bool,
  isNotifyPage: PropTypes.bool,
  updateSideGroupList: PropTypes.func,
  handleViewChange: PropTypes.func,
  areTemplatesAvailable: PropTypes.bool,
};
CustomJobTasks.defaultProps = {
  editable: false,
  taskSummary: {},
  simplifiedMode: false,
  my: false,
  isNotifyPage: false,
};

CustomJobTasks.displayName = 'CustomJobTasks';
export default CustomJobTasks;
