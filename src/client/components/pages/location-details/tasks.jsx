import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { classnames } from 'react-form-dynamic';
import InfiniteScroll from 'react-infinite-scroller';
import Select from 'react-select';
import { setLocData } from '../../../redux/actions/tasks-actions';

import ValueContainer, { Option, ValueContainer2 } from './value-container';
import { useActionDispatch } from '../../../hooks';
import {
  getStandardObject,
  postConfidenceManageObject,
  postConfidenceJobObject,
  postConfidenceObject,
  setObject,
} from '../../../redux/actions/object';
import {
  getStandardObjectsList,
  getPostStandardObjectsList,
} from '../../../redux/actions/objects';

import { uploadTaskImages } from '../../../redux/actions/files';
import { addToast } from '../../../redux/actions/toasts';
import { DateUtils, toBase64Array } from '../../../utils';
import { setItem, getItem } from '../../../utils/storage-utils';
import { StorageKeys } from '../../../constants';
import { toggleShortcuts, catchShortcut } from '../../../utils/electron';
import { SortByRS, SortByRSGrp } from '../../../constants';
import * as URLS from '../../../urls';
import { _getObject } from '../../../services/services';

import NewTask from './new-task';
import NewTaskTemplate from './new-task-template';
import TasksList from './tasks-list';
import EmptyLocation from './empty-location';
import ToggleButton from './toggle-button';
import EllipsisMenuV3 from '../../shared/ellipsis-menu/ellipsis-menu-v3';
import PriorityModal from './priority-modal';
import AssignModal from './assign-modal';
import DueDateModal from './due-date-modal';
import ScheduleModal from './schedule-modal';
import PreDefinedFiltersModal from './pre-defined-filters-modal';
import MoveToGroupModal from './move-to-group-modal';
import TaskLoader from './task-loader';

const OBJECT_TASK = 'task';
const OBJECT_ASSIGN = 'assign';
const OBJECT_TEMPLATE = 'template';
const OBJECT_LOСATION = 'location';
const OBJECT_JOBS_AND_TASKS = 'jobs';
const OBJECT_AGGREGATES = 'task';
const OBJECT_AGGREGATES_GRP = 'group';
const OBJECT_TASK_STATUS = 'taskStatus';
const OBJECT_LOСATION_ZONES = 'locationZones';
const OBJECT_CONTACTS = 'contacts';
const OBJECT_TASK_BULK = 'task/bulk';
const OBJECT_CUSTOM_GROUPS = 'taskGroups';

let isFetching = false;
let nonGrpJobTasksCounter = 0;
let isGrpFetching = false;
let grpJobTasksCounter = 0;
let closeNotify = false;
let copiedTask = undefined;
let targetId = undefined;
let userCreatorId = undefined;
let dueDateOff = undefined;
let statusCategory = undefined;

const TASKS_LIMIT = 5, GROUPS_LIMIT = 5;
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
const ALL_INCOMPLETE_OPTIONS_GRP = [{ value: 'All Completed', label: 'All Completed', cat: 'Completed', reqValues: ALL_INCOMPLETE_TASKS.split(',') }, { value: 'Completed', label: 'Completed', cat: 'Completed' }, { value: 'Incomplete', label: 'Incomplete', cat: 'Completed' }, { value: 'Rejected', label: 'Rejected', cat: 'Completed' }];
const ALL_INCOMPLETE_OPTIONS_GRP_0 = [ALL_INCOMPLETE_OPTIONS_GRP[0]];
const filterOptsGrp = [{ label: 'Active', options: ALL_TASK_OPTIONS_GRP }, { label: 'Completed', options: ALL_INCOMPLETE_OPTIONS_GRP }];


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


const Tasks = ({
  my,
  isLoading,
  setAllCustomeJobReviewsInListCompleted,
  setNumberofCustomTasksReviewed,
  numberofCustomTasksReviewed,
  isNotifyPage,
}) => {
  const { t } = useTranslation();

  const tasksRef = React.useRef(null);
  const newTaskBtnRef = React.useRef(null);
  const lastCommittedFD = React.useRef(false);

  const [minDate, setMinDate] = React.useState({});
  const [showNewTask, setShowNewTask] = React.useState(false);
  const [showNewTaskTemplate, setShowNewTaskTemplate] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const [filterGrp, setFilterGrp] = React.useState('');
  const [sort, setSort] = React.useState(SortByRS[0]);
  const [sortGrp, setSortGrp] = React.useState(SortByRS[0]);
  const [isNewLocation, setIsNewLocation] = React.useState(false);
  const [statusLoading, setStatusLoading] = React.useState(true);
  const [nonGrpJobTasks, setNonGrpJobTasks] = React.useState([]);
  const [nonGrpJobTasksCount, setNonGrpJobTasksCount] = React.useState(0);
  const [nonGrpTasksCount, setNonGrpTasksCount] = React.useState(0);
  const [tempData, setTempData] = React.useState(false);
  const [phase, setPhase] = React.useState(1);
  const [tab, setTab] = React.useState('tasks');

  const [grpPhase, setGrpPhase] = React.useState(1);
  const [grpJobTasks, setGrpJobTasks] = React.useState([]);
  const [grpJobTasksCount, setGrpJobTasksCount] = React.useState(0);
  const [grpTasksCount, setGrpTasksCount] = React.useState(0);
  const [tempGroupData, setTempGroupData] = React.useState(false);
  const [grpInit, setGrpInit] = React.useState(true);
  const [tasksInit, setTasksInit] = React.useState(true);

  const [reporters, setReporters] = React.useState([]);
  const [assignees, setAssignees] = React.useState([]);
  const [reportersSelected, setReportersSelected] = React.useState([]);
  const [reportersSelectedGrp, setReportersSelectedGrp] = React.useState([]);
  const [assigneesSelected, setAssigneesSelected] = React.useState([]);
  const [assigneesSelectedGrp, setAssigneesSelectedGrp] = React.useState([]);
  const [category, setCategory] = React.useState('Active');
  const [sortBy, setSortBy] = React.useState('createdDate');
  const [sortByOrder, setSortByOrder] = React.useState('desc');
  const [sortByGrp, setSortByGrp] = React.useState('createdDate');
  const [sortByOrderGrp, setSortByOrderGrp] = React.useState('desc');
  const [loading, setLoading] = React.useState(false);
  const [rePaint, setRePaint] = React.useState(false);
  const [categoryGrp, setCategoryGrp] = React.useState('Active');
  const [dueDateSelected, setDueDateSelected] = React.useState({ value: 'All', label: 'All' });
  const [dueDateSelectedGrp, setDueDateSelectedGrp] = React.useState({ value: 'All', label: 'All' });
  const [prioritySelected, setPrioritySelected] = React.useState([{ value: 'All', label: 'All' }]);
  const [prioritySelectedGrp, setPrioritySelectedGrp] = React.useState([{ value: 'All', label: 'All' }]);
  const [bulkSelectTaskArray, setBulkSelectTaskArray] = React.useState([]);
  const [showEllipsisMenu, setShowEllipsisMenu] = React.useState(false);
  const [showPriority, setShowPriority] = React.useState(false);
  const [showAssignModal, setShowAssignModal] = React.useState(false);
  const [showDueDate, setShowDueDate] = React.useState(false);
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showPreDefinedFilters, setShowPreDefinedFilters] = React.useState(false);
  const [showMoveToGroupModal, setShowMoveToGroupModal] = React.useState(false);
  const [showCreateBtn, setShowCreateBtn] = React.useState(true);

  const { locationId, filter: locationFilter = '', taskId, templateId: notifyTPLId, cardType } = useParams();
  const history = useHistory();
  const { pathname = '', data = {} } = useLocation();
  const { filterType, tabOnNotify } = data;

  const isTaskReview = pathname.includes('/owner/task');

  const shortcuts = useSelector(state => state.electron.shortcuts);
  const profile = useSelector(state => state.profile.data);
  const filterData = useSelector(state => state.taskGroupFilters && state.taskGroupFilters.data);

  const manageTask = useActionDispatch(postConfidenceManageObject(OBJECT_TASK));
  const assignTask = useActionDispatch(postConfidenceJobObject(OBJECT_ASSIGN));
  const getTasks = useActionDispatch(postConfidenceObject(OBJECT_JOBS_AND_TASKS, undefined, 'jobs/tasks'));
  const getTasks2 = useActionDispatch(postConfidenceObject(OBJECT_JOBS_AND_TASKS, undefined, 'cards/tasks'));
  const getJobs = useActionDispatch(postConfidenceObject(OBJECT_JOBS_AND_TASKS, undefined, 'cards/custom'));
  const getJobs2 = useActionDispatch(postConfidenceObject(OBJECT_JOBS_AND_TASKS, undefined, 'cards/jobs'));
  const getReportersByLocId = useActionDispatch(getStandardObject('reporters', undefined, 'location', '/reporter'));
  const getAssigneeByLocId = useActionDispatch(getStandardObject('assignees', undefined, 'location', '/assignee'));
  //const removeTaskFromList = useActionDispatch(removeFromList(OBJECT_TASKS));
  const cloneTemplate = useActionDispatch(postConfidenceObject(OBJECT_TEMPLATE));
  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));
  const uploadImages = useActionDispatch(uploadTaskImages);
  const toast = useActionDispatch(addToast);
  const customTemplate = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES_GRP));
  //const getCustomTasks = useActionDispatch(getStandardObjectsList(OBJECT_CUSTOM_JOBS, 'tasks', undefined, 'location', '/cards/custom'));
  const getAggregateCounts = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES, undefined, undefined, '/aggregate'));
  const getGroupAggregateCounts = useActionDispatch(postConfidenceObject(OBJECT_AGGREGATES_GRP, undefined, undefined, '/count'));
  const getTaskStatus = useActionDispatch(postConfidenceObject(OBJECT_TASK_STATUS, undefined, 'task/details'));
  const getGroupStatus = useActionDispatch(postConfidenceObject(OBJECT_TASK_STATUS, undefined, 'template/details'));
  const storeFilterData = useActionDispatch(setObject('taskGroupFilters'));
  const groupMenuUpdate = useActionDispatch(setObject('groupMenuUpdate'));
  const tasksActions = useSelector(state => state.tasksActions);
  const updateLocStatus = useActionDispatch(setLocData);

  const getLocationZones = useActionDispatch(
    getStandardObjectsList(
      OBJECT_LOСATION_ZONES,
      'zones',
      undefined,
      'location',
      '/configuration'
    )
  );
  const getContacts = useActionDispatch(getStandardObjectsList(OBJECT_CONTACTS, 'contacts', undefined, 'location', '/contacts'));
  const getBulk = useActionDispatch(postConfidenceObject(OBJECT_TASK_BULK));
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
  const getTemplates = useActionDispatch(getPostStandardObjectsList('templates', 'templates', undefined, 'marketplace/template'));

  const navBackTab = history?.location?.state?.tabType;

  const {
    initialLoading,
    data: { numberofTasks, numberofMyTasks, locationUserRole, locationType },
    data: loc,
  } = useSelector((state) => state.loc);
  //const { items: rawTasks } = useSelector((state) => state.tasks);

  let tasksNumber = my ? numberofMyTasks : numberofTasks;
  if (tab === 'tasks') {
    tasksNumber = nonGrpJobTasksCount + nonGrpTasksCount;
  } else {
    tasksNumber = grpJobTasksCount + grpTasksCount;
  }

  const handlePlusClick = () => {
    setShowNewTask(true);
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

  const getPriorities = (data = []) => {
    const arr = [];
    data.forEach(it => {
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

    getAggregateCounts({ locationId, selfAssigned: my, status: 'All', ...payload }).then((data) => {
      //setStats([data.open, data.assigned, data.inprogress, data.review, data.accepted, data.declined, data.rework]);
      if (lastCommittedFD.current !== filtersData) {
        return;
      }
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

  const updateGroupsCount = () => {
    getGroupAggregateCounts({ locationId, selfAssigned: my, status: 'All' }).then((data) => {
      //setStats([data.open, data.assigned, data.inprogress, data.review, data.accepted, data.declined, data.rework]);
      let gTotal = 0, giTotal = 0;
      ALL_TASK_OPTIONS_GRP.forEach((item) => {
        let key = item.value.toLowerCase();
        const extraCount = data.taskGroupCount || 0;
        if (key === 'in progress') {
          key = 'inprogress';
        }
        item.extraCount = extraCount;
        if (key in data) {
          item.count = data[key];
          gTotal += item.count;
        }
      });
      ALL_TASK_OPTIONS_GRP[0].count = gTotal;
      ALL_INCOMPLETE_OPTIONS_GRP.forEach((item) => {
        const key = item.value.toLowerCase();
        if (key in data) {
          item.count = data[key];
          giTotal += item.count;
        }
      });
      ALL_INCOMPLETE_OPTIONS_GRP[0].count = giTotal;
    });
  };

  const getGroups = (type, filterType, cat, sortByType, sortByOrderType, reportersList, assigneesList) => {
    if (isNotifyPage) {
      closeNotify = true;
    }
    if (type === 'resetStart' || type === 'newTaskReset') {
      grpJobTasksCounter = 0;
      setGrpJobTasks([]);
      setGrpJobTasksCount(0);
      setGrpTasksCount(0);
      setGrpPhase(1);
      if (type === 'newTaskReset') {
        setFilterGrp(ALL_TASK_OPTIONS_GRP_0);
        filterType = ALL_TASK_OPTIONS_GRP_0;
        cat = cat || 'Active';
      }
    } else if (type === 'nextSetData') {
      grpJobTasksCounter = 0;
      setGrpPhase(2);
    } else if (type === 'init') {
      grpJobTasksCounter = 0;
      setGrpJobTasks([]);
      setGrpJobTasksCount(0);
      setGrpTasksCount(0);
      setGrpPhase(1);
    }
    const isResetCall = type === 'resetStart' || type === 'newTaskReset';

    //const prList = priorityList || prioritySelectedGrp || [];
    //const due = dueDateType || dueDateSelected || {};

    const getGroupsData = {
      locationId,
      sortBy: sortByType || sortByGrp,
      sortByOrder: sortByOrderType || sortByOrderGrp,
      selfAssigned: !!my,
      statusCategory: cat || categoryGrp,
      statuses: filterType ? (Array.isArray(filterType) ? getValuesArray(filterType) : [filterType]) : filterGrp ? getValuesArray(filterGrp) : ALL_TASKS.split(','),
      start: isResetCall ? 0 : grpJobTasksCounter,
      limit: GROUPS_LIMIT,
      //dueDate: due.value,
      //priority: getPriorities(prList),
    };
    isGrpFetching = true;
    if ((grpJobTasksCount > grpJobTasks.length || type === 'init' || isResetCall) && type !== 'nextSetData') {
      if (!my) {
        const reps = [], workers = [];
        const r = reportersList || reportersSelectedGrp || [];
        r.forEach(c => reps.push(c.value));
        const a = assigneesList || assigneesSelectedGrp || [];
        a.forEach(c => workers.push(c.value));

        getGroupsData.creatorIds = reporters && reporters.length === reps.length ? [] : reps;
        getGroupsData.assigneeIds = assignees && assignees.length === workers.length ? [] : workers;
      }
      getJobs2(getGroupsData, undefined, undefined, undefined, true).then((data) => setTempGroupData(data));
    } else if (grpTasksCount > (grpJobTasks.length - grpJobTasksCount) || grpJobTasksCount === grpJobTasks.length || type === 'nextSetData') {
      if (grpPhase === 1) {
        getGroupsData.start = 0;
        grpJobTasksCounter = 0;
      }
      setGrpPhase(2);
      getJobs(getGroupsData, undefined, undefined, undefined, true).then((data) => setTempGroupData(data));
    } else {
      isGrpFetching = false;
    }
    grpJobTasksCounter += GROUPS_LIMIT;
    updateGroups;
  };

  const getJobsAndTask = (type, filterType, cat, sortByType, sortByOrderType, reportersList, assigneesList, tabType, dueDateType, priorityList, config = {}) => {
    if (isNotifyPage) {
      closeNotify = true;
    }
    if ((tab === 'groups' && !tabType) || tabType === 'groups') {
      getGroups(type, filterType, cat, sortByType, sortByOrderType, reportersList, assigneesList);
      return;
    }
    if (type === 'resetStart' || type === 'newTaskReset') {
      nonGrpJobTasksCounter = 0;
      isFetching = true;
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
      sortBy: sortByType || sortBy,
      sortByOrder: sortByOrderType || sortByOrder,
      selfAssigned: !!my,
      statusCategory: statusCategory ? 'Active' : (cat || category),
      statuses: filterType ? (Array.isArray(filterType) ? getValuesArray(filterType) : [filterType]) : filter ? getValuesArray(filter) : ALL_TASKS.split(','),
      start: isResetCall ? 0 : nonGrpJobTasksCounter,
      limit: TASKS_LIMIT,
      dueDate: dueDateOff ? 'All' : due.value,
      priority: getPriorities(prList),
    };

    const reps = [], workers = [];
    const r = reportersList || reportersSelected || [];
    r.forEach(c => reps.push(c.value));
    const a = assigneesList || assigneesSelected || [];
    a.forEach(c => workers.push(c.value));

    getTasksData.creatorIds = config.restoreFilters ? reps : reporters && (reporters.length === 0 || reporters.length === reps.length) ? [] : reps;
    getTasksData.assigneeIds = config.restoreFilters ? workers : assignees && (assignees.length === 0 || assignees.length === workers.length) ? [] : workers;
    if (!reporters.length && userCreatorId && my && (filterType === 'Open' || filterType === 'Review')) {
      getTasksData.creatorIds.push(userCreatorId);
    } else if (!reporters.length && userCreatorId && my && (filterType === 'Assigned' || filterType === 'In Progress' || filterType === 'Accepted' || filterType === 'Rework')) {
      getTasksData.assigneeIds.push(userCreatorId);
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
    } else if (nonGrpTasksCount > (nonGrpJobTasks.length - nonGrpJobTasksCount) || nonGrpJobTasksCount === nonGrpJobTasks.length || type === 'nextSetData') {
      if (phase === 1) {
        getTasksData.start = 0;
        nonGrpJobTasksCounter = 0;
      }
      setPhase(2);
      getTasks(getTasksData, undefined, undefined, undefined, true).then((data) => setTempData(data));
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
    if (copiedTask) {
      all.unshift(copiedTask);
      copiedTask = undefined;
    }
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

  const updateGroups = React.useMemo(() => {
    if (tempGroupData && tempGroupData.numberofTasks === 0) {
      if (grpPhase === 1) {
        getJobsAndTask('nextSetData');
      } else if (grpPhase === 2) {
        isGrpFetching = false;
        tasksNumber = grpJobTasksCount + grpTasksCount;
      }
    }
    if (!tempGroupData || !tempGroupData.jobs) {
      return;
    }

    const data = tempGroupData;
    const newTasks = data.jobs || [];
    const existingTasks = grpJobTasks || [];
    const totalGrpJobTasks = data.numberofTasks;
    const all = existingTasks.concat(newTasks);
    setGrpJobTasks(all.splice(0));
    if (grpPhase === 1) {
      setGrpJobTasksCount(totalGrpJobTasks);
    } else if (grpPhase === 2) {
      setGrpTasksCount(totalGrpJobTasks);
    }
    setTempGroupData(false);
    isGrpFetching = false;
    if (grpPhase === 1 && (newTasks.length + existingTasks.length) === totalGrpJobTasks) {
      getGroups('nextSetData');
    }
  }, [tempGroupData]);

  const onTabChange = (tabType) => {
    if (tabType === tab) {
      return;
    }
    setShowNewTaskTemplate(false);
    setShowNewTask(false);
    setTab(tabType);
    if (tabType === 'groups' && grpInit) {
      getGroups('init');
      setGrpInit(false);
    } else if (tabType === 'tasks' && tasksInit) {
      getJobsAndTask('init', null, null, null, null, null, null, tabType);
      setTasksInit(false);
    }
  };

  const isReadyToLoad = () => {
    const currentSelectionCount = phase === 1 ? tasksNumber : nonGrpJobTasksCount + nonGrpTasksCount;
    return nonGrpJobTasks.length < currentSelectionCount && !isFetching && !showNewTask;
  };

  const noTasksToLoad = () => {
    const currentSelectionCount = (nonGrpJobTasksCount ? nonGrpJobTasksCount : 0) + (nonGrpTasksCount ? nonGrpTasksCount : 0);
    return 0 === currentSelectionCount && !isFetching;
  };

  const isGrpReadyToLoad = () => {
    const currentSelectionCount = phase === 1 ? tasksNumber : grpJobTasksCount + grpTasksCount;
    return grpJobTasks.length < currentSelectionCount && !isGrpFetching && !showNewTaskTemplate;
  };

  const noGroupsToLoad = () => {
    const currentSelectionCount = (grpJobTasksCount ? grpJobTasksCount : 0) + (grpTasksCount ? grpTasksCount : 0);
    return 0 === currentSelectionCount && !isGrpFetching;
  };

  const updateSideGroupList = () => {
    groupMenuUpdate({ update: true });
    setTimeout(() => {
      groupMenuUpdate({ update: undefined });
    }, 500);
  };

  const handlePlusTemplateClick = () => {
    //setShowNewTaskTemplate(true);
    handleCreateGroupClick();
  };

  const handleCreateGroupClick = async () => {
    const dataUpdated = {
      locationId,
      templateName: 'New Group',
    };
    getTemplates({
      templateType: 'Reference',
      locationType
    });
    const { templateId } = await customTemplate(dataUpdated);

    updateSideGroupList();
    if (templateId) {
      history.push({
        pathname: URLS.TASK_DETAILS(locationId, templateId), data: { isFirstTime: true, templateType: 'Custom' }
      });
    }
  };

  const handleAddTask = async (task) => {
    setLoading(true);
    const { taskRecurring = {} } = task;
    const date = taskRecurring && taskRecurring.date ? DateUtils.parseISO(taskRecurring.date) : new Date();
    let recurringData = [];
    if (taskRecurring?.repeat?.indexOf('-') > -1) {
      recurringData = taskRecurring.repeat.split('-');
      taskRecurring.repeat = recurringData[0] === 'everyMinute' ? recurringData[0] : 'Hourly';
    }
    const data = {
      locationId,
      task: task.title,
      imageRequired: task.imageRequired,
      taskDescription: task.taskDescription,
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
        [recurringData[0]]: recurringData[1],
      },
    };

    if (task.locationZoneId) {
      data.locationZoneId = task.locationZoneId;
    }

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

      if (task.assignData) {
        const assignData = {
          taskId,
          status: 'assigned',
          assignee:
            task.assignData.assigneeUserName || task.assignData.assignee,
        };

        await assignTask(assignData);
      }
      setSort(SortByRS[0]);
      setSortBy(SortByRS[0].sortBy);
      setSortByOrder(SortByRS[0].sortByOrder);
      getJobsAndTask('newTaskReset', ALL_TASK_OPTIONS_0, null, 'createdDate', 'desc', reporters, assignees, t);
      getLocation(locationId);
      updateTasksCount();
      updateGroupsCount();
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
    setLoading(false);
  };

  const addTaskTemplate = async () => {
    history.push(URLS.TASK_TEMPLATES(locationId));
  };

  const handleAddTemplateTask = async (task) => {
    setShowNewTaskTemplate(false);
    try {
      if (task.templateId || task.isTasks) {
        const cloneTemplateData = {
          templateId: task.templateId,
          templateName: task.title,
          custom: task.custom,
          locationId,
          createdBy: profile.username,
        };

        const { taskRecurring = {} } = task;
        const date = taskRecurring && taskRecurring.date ? DateUtils.parseISO(taskRecurring.date) : new Date();
        let recurringData = [];
        if (taskRecurring?.repeat?.indexOf('-') > -1) {
          recurringData = taskRecurring.repeat.split('-');
          taskRecurring.repeat = recurringData[0] === 'everyMinute' ? recurringData[0] : 'Hourly';
        }
        const taskRecurringData = {
          timeZone: DateUtils.getCurrentTZName(),
          recurringType: taskRecurring.repeat || 'OneTime',
          startDate: DateUtils.unicodeFormat(date, 'yyyy-MM-dd'),
          startTime:
            taskRecurring.startTime ||
            DateUtils.roundToNextMinutes(new Date()),
          endTime:
            taskRecurring.endTime ||
            DateUtils.roundToNextMinutes(
              DateUtils.addMinutes(new Date(), 30)
            ),
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
        };

        cloneTemplateData.taskRecurring = taskRecurringData;

        const { templateId } = !task.isTasks
          ? await cloneTemplate(cloneTemplateData)
          : await customTemplate({
            templateName: task.title,
            locationId,
            jobManager: profile.username,
          });

        if (templateId) {
          if (task.assignData) {
            const assignData = {
              locationId,
              templateId,
              assignee: task.assignData.assigneeUserName,
              status: 'assigned',
            };
            await assignTask(assignData);
          }
          history.push({
            pathname: URLS.TASK_DETAILS(locationId, templateId), data: { isFirstTime: true, templateType: task.templateType }
          });
        }
      }

      getJobsAndTask('newTaskReset');
      getLocation(locationId);
      toast(t('job_added'));
      updateTasksCount();
      updateGroupsCount();
    } catch (e) {
      history.push(URLS.PAGE_400);
    }
  };

  const handleRemove = async () => {
    //await removeTaskFromList(index);
    //await getLocation(locationId);
    await updateTasksCount();
    await updateGroupsCount();
    if (tab === 'tasks') {
      isFetching = false;
    } else {
      isGrpFetching = false;
    }
    updateSideGroupList();
  };

  const handleFilterChangeRS = (data, s) => {
    const action = s.action;
    const currValue = s.option.value;
    let cat = s.option.cat;
    const AT = tab === 'groups' ? ALL_TASK_OPTIONS_GRP_0 : ALL_TASK_OPTIONS_0;
    const AIT = tab === 'groups' ? ALL_INCOMPLETE_OPTIONS_GRP_0 : ALL_INCOMPLETE_OPTIONS_0;

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
    tab === 'groups' ? setFilterGrp(f) : setFilter(f);
    tab === 'groups' ? (action === 'select-option' && (setCategoryGrp(cat))) : (action === 'select-option' && (setCategory(cat)));
    if (currValue === 'All Active') {
      setSort(SortByRS[0]);
      setSortBy('createdDate');
      setSortByOrder('desc');
      getJobsAndTask('resetStart', f, cat, 'createdDate', 'desc');
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

  const handleReportersChange = (data) => {
    tab === 'groups' ? setReportersSelectedGrp(data) : setReportersSelected(data);
    getJobsAndTask('resetStart', null, null, null, null, data);
  };

  const handleAssigneesChange = (data) => {
    tab === 'groups' ? setAssigneesSelectedGrp(data) : setAssigneesSelected(data);
    getJobsAndTask('resetStart', null, null, null, null, null, data);
  };

  const handlePriorityFilterChange = (data, s) => {
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
    tab === 'groups' ? setPrioritySelectedGrp(p) : setPrioritySelected(p);
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

  const handleDueDateFilterChange = (data, action, sortOption = false) => {
    const sortData = sortOption || SortByRS[6];
    let sortBy, sortByOrder, p;
    tab === 'groups' ? setDueDateSelectedGrp(data) : setDueDateSelected(data);
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

  const getFilterCopy = (tab) => {
    if (tab === 'Tasks') {
      if (filter.length === 1) {
        return `${filter[0].value}`;
      } else {
        return tab;
      }
    } else if (tab === 'Groups') {
      if (filterGrp.length === 1) {
        return `${filterGrp[0].value}`;
      } else {
        return tab;
      }
    }
  };

  const getFiltersCount = () => {
    let count = 0;
    if (isNotifyPage) {
      return 1;
    }
    if (tab === 'tasks' && filter) {
      const countItems = ALL_TASK_OPTIONS.concat(ALL_INCOMPLETE_OPTIONS);
      filter.forEach((item) => {
        let countItem = countItems.filter(ci => ci.value === item.value);
        countItem = countItem.length > 0 ? countItem[0] : [{}];
        count += parseInt(countItem.count ? countItem.count : 0);
      });
    } else if (tab === 'groups' && filterGrp) {
      const countItems = ALL_TASK_OPTIONS_GRP.concat(ALL_INCOMPLETE_OPTIONS_GRP);
      filterGrp.forEach((item, idx) => {
        let countItem = countItems.filter(ci => ci.value === item.value);
        countItem = countItem.length > 0 ? countItem[0] : [{}];
        if (idx === 0) {
          count += parseInt(countItem.extraCount ? countItem.extraCount : 0);
        }
        count += parseInt(countItem.count ? countItem.count : 0);
      });
    }
    return count;
  };

  const handleSortChange = (event) => {
    let p, d;
    if (tab === 'tasks') {
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

      if (event.label === 'Scheduled') {
        setFilter(ALL_TASK_OPTIONS_0);
        getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, null, event.sortBy, event.sortByOrder, null, null, null, d, p);
        return;
      }

    } else if (tab === 'groups') {
      setSortGrp(event);
      setSortByGrp(event.sortBy);
      setSortByOrderGrp(event.sortByOrder);
    }
    if (event.value === 'Upcoming Start Date') {
      setFilter(ALL_TASK_OPTIONS_0);
      getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, 'Active', event.sortBy, event.sortByOrder, null, null, null, d, p);
    } else {
      setFilter(ALL_TASK_OPTIONS_0);
      getJobsAndTask('resetStart', ALL_TASK_OPTIONS_0, 'Active', event.sortBy, event.sortByOrder, null, null, null, d, p);
    }
  };

  const getLocationStatus = async () => {
    const { newLocation } = await _getObject(`v1/confidence/location/${locationId}/status`);
    setIsNewLocation(newLocation);
    setStatusLoading(false);
    if (!(locationId in tasksActions.data)) {
      updateLocStatus({ [locationId]: newLocation });
    }
  };

  const tasks = React.useMemo(() => {
    const rawTasks = [];
    if (!isTaskReview) {
      return rawTasks;
    }

    const index = rawTasks.findIndex((task) => task.taskId === +taskId);
    if (index < 0) {
      return rawTasks;
    }

    return [
      rawTasks[index],
      ...rawTasks.slice(0, index),
      ...rawTasks.slice(index + 1),
    ];
  }, [taskId]);

  const insertCopiedTask = async (task) => {
    copiedTask = task;
    if (tab === 'tasks') {
      const s = { action: 'select-option', option: { value: 'All Active', label: 'All Active', cat: 'Active' } };
      const data = [{ value: 'All Active', label: 'All Active', cat: 'Active' }];
      handleFilterChangeRS(data, s);
    }
  };

  const updateTaskInNonGrpJobTasks = async (taskId, templateId, remove, tabType, reWorkOldId, copy, fullUpdate) => {
    if (tab === 'groups' || tabType === 'groups') {
      updateTaskInGrpJobTasks(taskId, templateId, remove);
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
    if (remove) {
      const newArray = nonGrpJobTasks.filter(item =>
        item.taskId !== taskId);
      if (remove !== 'complete') {
        isFetching = true;
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
        newArray = nonGrpJobTasks.map(item =>
          item.taskId === taskId ? { ...item, ...response.taskDetails } : item);
      }
      setNonGrpJobTasks(newArray);
      updateFilterCounts();
      if (copy) {
        getJobsAndTask('newTaskReset');
      }
    }
  };

  const updateTaskInGrpJobTasks = async (taskId, templateId, remove) => {
    if (remove) {
      const newArray = grpJobTasks.filter(item =>
        item.taskId !== taskId);
      isGrpFetching = true;
      setGrpJobTasks(newArray);
      setGrpJobTasksCount(grpJobTasksCount - 1);
      grpJobTasksCounter = grpJobTasksCounter - 1;
    } else {
      const response = await getGroupStatus({
        taskId,
        templateId,
      });
      const updatedData = { ...response.templateDetails };
      let newArray = [];
      if (isNotifyPage) {
        newArray.push({ ...response.templateDetails });
        isGrpFetching = false;
      } else {
        newArray = grpJobTasks.map(item =>
          item.taskId === taskId ? updatedData : item);
      }
      setGrpJobTasks(newArray);
      updateFilterCounts();
    }
  };

  const updateFilters = (type) => {
    if (type === 'Completed') {
      const s = { action: 'select-option', option: { value: 'Completed', label: 'Completed', cat: 'Completed' } };
      const data = [{ value: 'Completed', label: 'Completed', cat: 'Completed' }];
      handleFilterChangeRS(data, s);
    } else if (type === 'Review') {
      const countItems = tab === 'tasks' ? ALL_TASK_OPTIONS : ALL_TASK_OPTIONS_GRP;
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
    }
    updateTasksCount();
    updateGroupsCount();
  };

  const initTasks = async () => {
    if (isNotifyPage) {
      isFetching = true;
      const t = cardType === 'group' ? 'groups' : 'tasks';
      (t === 'groups') ? (isGrpFetching = true) : (isFetching = true);
      setTab(t);
      updateTaskInNonGrpJobTasks(taskId, notifyTPLId, null, t);
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
      updateGroupsCount();
      return;
    }
    const fr = filterData || {};
    const restoreFilters = Object.keys(fr).length > 0;
    const prevActiveTab = getItem(StorageKeys.ACTIVE_TAB_KEY);
    let t = prevActiveTab === 'groups' ? 'groups' : 'tasks';
    (t === 'groups' || fr.tab === 'groups') ? (isGrpFetching = true) : (isFetching = true);
    if (!restoreFilters && prevActiveTab) {
      setTab(t);
    }
    if (restoreFilters) {
      setTab(fr.tab);
      setFilterGrp(fr.filterGrp);
      setReportersSelectedGrp(fr.reportersSelectedGrp);
      setAssigneesSelectedGrp(fr.assigneesSelectedGrp);
      setSortGrp(fr.sortGrp);
      setSortByGrp(fr.sortByGrp);
      setSortByOrderGrp(fr.sortByOrderGrp);
      setCategory(fr.category);

      setFilter(fr.filter);
      setReportersSelected(fr.reportersSelected);
      setAssigneesSelected(fr.assigneesSelected);
      setSort(fr.sort);
      setSortBy(fr.sortBy);
      setSortByOrder(fr.sortByOrder);
      setCategoryGrp(fr.categoryGrp);

    } else if (filterType || locationFilter) {
      const ft = filterType || locationFilter;
      if (locationFilter && tabOnNotify) {
        t = tabOnNotify === 'group' ? 'groups' : 'tasks';
        setTab(t);
      }
      const filterT = ALL_TASK_OPTIONS.filter((f) => f.value === ft);
      const filterTGRP = ALL_TASK_OPTIONS_GRP.filter((f) => f.value === ft);
      setFilter(filterT);
      setFilterGrp(filterTGRP);
    } else if (!filterType) {
      setFilter(ALL_TASK_OPTIONS_0);
      setFilterGrp(ALL_TASK_OPTIONS_GRP_0);
      //setFilter('Review');
    } else {
      setFilter(locationFilter);
    }
    //getCustomTasks(locationId);
    const reporters = [], assignees = [];
    await getReportersByLocId(locationId).then(({ contacts = [] }) => {
      contacts.forEach(c => reporters.push({ value: c.contactId, label: c.firstName ? `${c.firstName} ${c.lastName ? c.lastName.charAt(0) : ''}` : c.userName }));
      setReporters(reporters);

      const userID = (filterType === 'Open' || filterType === 'Assigned' || filterType === 'In Progress' || filterType === 'Accepted' || filterType === 'Rework' || filterType === 'Review') ? contacts.filter(item => item.userName === profile.username) : undefined;
      userCreatorId = userID && userID[0]?.contactId;

      if ((filterType === 'Open' || filterType === 'Review') && my) {
        setReportersSelected(reporters.filter(reporter => reporter.value === userCreatorId));
      } else if ((filterType === 'Assigned' || filterType === 'In Progress' || filterType === 'Accepted' || filterType === 'Rework') && my) {
        setAssigneesSelected(reporters.filter(reporter => reporter.value === userCreatorId));
      }
    });
    await getAssigneeByLocId(locationId).then(({ contacts = [] }) => {
      contacts.forEach(c => assignees.push({ value: c.contactId, label: c.firstName ? `${c.firstName} ${c.lastName ? c.lastName.charAt(0) : ''}` : c.userName }));
      setAssignees(assignees);
    });
    updateTasksCount();
    updateGroupsCount();

    if ((filterType === 'Assigned' || filterType === 'In Progress' || filterType === 'Accepted' || filterType === 'Rework' || filterType === 'Review') && my) {
      setSort(SortByRS[3]);
      setSortBy(SortByRS[3].sortBy);
      setSortByOrder(SortByRS[3].sortByOrder);
      getJobsAndTask('init', filterType || locationFilter, null, 'nextOccurrenceDate', 'asc', reporters, assignees, t);
      return;
    } else if (filterType === 'Open' && my) {
      setSort(SortByRS[1]);
      setSortBy(SortByRS[1].sortBy);
      setSortByOrder(SortByRS[1].sortByOrder);
      getJobsAndTask('init', filterType || locationFilter, null, 'createdDate', 'asc', reporters, assignees, t);
      return;
    }
    if (!restoreFilters) {
      getJobsAndTask('init', filterType || locationFilter, null, null, null, reporters, assignees, t);
    } else {
      const r = fr.tab === 'groups' ? fr.reportersSelectedGrp : fr.reportersSelected;
      const a = fr.tab === 'groups' ? fr.assigneesSelectedGrp : fr.assigneesSelected;
      const filters = fr.tab === 'groups' ? fr.filterGrp : fr.filter;
      const category = fr.tab === 'groups' ? fr.categoryGrp : fr.category;
      const sortBy = fr.tab === 'groups' ? fr.sortByGrp : fr.sortBy;
      const sortByOrder = fr.tab === 'groups' ? fr.sortByOrderGrp : fr.sortByOrder;
      getJobsAndTask('init', filters, category, sortBy, sortByOrder, r, a, fr.tab, null, null, { restoreFilters });
    }
    // window.scrollTo(0, 0);
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
    const res = await moveToTaskGroup(data);
    updateSideGroupList();
    history.push(URLS.TASK_DETAILS(locationId, res.templateId));
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
      updateTasksCount();
      updateGroupsCount();
    } else {
      await getBulk(data);
      setBulkSelectTaskArray([]);
      toast(t('Tasks updated'));
      getJobsAndTask('resetStart');
      updateTasksCount();
      updateGroupsCount();
    }
  };

  const updateFilterCounts = () => {
    updateTasksCount();
    updateGroupsCount();
  };

  const onAssign = () => {
    getContacts(locationId);
    setShowAssignModal(show => !show);
  };

  const addShortcutListeners = () => {
    catchShortcut(shortcuts.CREATE_GROUP, () => {
      handlePlusTemplateClick();
    });
    catchShortcut(shortcuts.CREATE_TASK, () => {
      handlePlusClick();
    });
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

  const isTm = profile.isWorker || my || filter === 'Assigned';

  React.useEffect(() => {
    initTasks();
    if (!isTm) {
      addShortcutListeners();
    }
  }, [taskId, locationId, cardType]);

  React.useEffect(() => {
    return () => {
      if (!isTm) { toggleShortcuts([], [shortcuts.CREATE_GROUP, shortcuts.CREATE_TASK]); }
    };
  }, []);

  React.useEffect(() => {
    if (!isTm) {
      if (tab === 'groups') { toggleShortcuts([shortcuts.CREATE_GROUP], [shortcuts.CREATE_TASK]); }
      else { toggleShortcuts([shortcuts.CREATE_TASK], [shortcuts.CREATE_GROUP]); }
    }
  }, [tab]);

  React.useMemo(() => {
    if (locationId && tab === 'tasks' && !isLoading && !loading) {
      getLocationZones(locationId);
    }
    getLocationStatus();
  }, [locationId, tab, isLoading, loading]);

  React.useEffect(() => {
    if (history && history.location && history.location.state && history.location.state.accepted) {
      setFilter('');
    }
  }, []);

  React.useEffect(() => {
    setItem(StorageKeys.ACTIVE_TAB_KEY, tab);
    storeFilterData({
      tab,
      category,
      categoryGrp,
      filter,
      filterGrp,
      reportersSelected,
      reportersSelectedGrp,
      assigneesSelected,
      assigneesSelectedGrp,
      sort,
      sortGrp,
      sortBy,
      sortByGrp,
      sortByOrder,
      sortByOrderGrp
    });
    if (closeNotify) {
      history.push(URLS.LOCATION_ASSIGNED_TO_YOU(locationId));
    }
  }, [tab, filter, filterGrp, reportersSelected, reportersSelectedGrp, assigneesSelected, assigneesSelectedGrp, sort, sortGrp, sortBy, sortByGrp, sortByOrder, sortByOrderGrp]);

  React.useEffect(() => {
    if (locationFilter === 'Manager') {
      setFilter('');
    }
  }, [locationFilter]);

  React.useEffect(() => {
    if (navBackTab) {
      onTabChange(navBackTab);
    }
  }, [navBackTab]);

  React.useMemo(() => {
    if (history.location?.state?.workspaceId) {
      getJobsAndTask('init');
      updateTasksCount();
      updateGroupsCount();
    }
  }, [history.location?.state?.workspaceId]);

  const sortForLatestStartDate = () => {
    bulkSelectTaskArray.sort(
      (a, b) => {
        return new Date(b.taskRecurring?.startDate) - new Date(a.taskRecurring?.startDate);
      }
    );
    setMinDate(bulkSelectTaskArray[0]?.taskRecurring?.startDate?.slice(0, -9));
  };

  React.useEffect(() => {
    if (bulkSelectTaskArray) {
      sortForLatestStartDate();
    }
  }, [bulkSelectTaskArray]);

  React.useEffect(() => {
    return () => {
      newTaskBtnRef?.current?.focus();
    };
  }, [nonGrpJobTasks, sort]);

  if ((isLoading || statusLoading || initialLoading || loc === {} || loading) && !showNewTask) {
    return (
      <TaskLoader showEye={false}/>
    );
  }
  return (
    <>
      { !(!tasksNumber && isNewLocation && !showNewTask && !showNewTaskTemplate && !loading) &&
        <div className='bg-white'>
          <ul className="nav nav-tabs align-items-stretch nav-fill bg-white pt-2 font-weight-bold px-3">
            <div className='container p-0 px-md-3 d-flex'>
              <li className="nav-item">
                <a className={`nav-link ${tab === 'tasks' ? 'active bg-light' : 'text-primary'}`} onClick={() => onTabChange('tasks')} style={{ height: '100%' }}>Tasks</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${tab === 'groups' ? 'active bg-light' : 'text-primary'}`} onClick={() => onTabChange('groups')} style={{ height: '100%' }}>Groups</a>
              </li>
            </div>
          </ul>
        </div>
      }
      <div className="container bg-light">

        <div className={!(!tasksNumber && isNewLocation && !showNewTask && !showNewTaskTemplate && !loading) ? 'row justify-content-center  pt-3 pb-5 bg-light' : 'row justify-content-center border-top pt-3 pb-5 bg-light'}>

          {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && tab === 'tasks' && !showNewTask && !tasksActions.isDescriptionFocused && showCreateBtn && (
            <Button
              className="add-task btn btn-primary rounded-circle text-white position-fixed"
              role="button"
              title={t('create_task')}
              data-target='button-create-task'
              disabled={showNewTask || showNewTaskTemplate}
              onClick={handlePlusClick} ref={newTaskBtnRef}
              autoFocus
            >
              <i className="far fa-plus" aria-hidden="true"></i>
              <span className="sr-only">Create Task</span>
            </Button>
          )}

          {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && tab === 'groups' && !tasksActions.isDescriptionFocused && (<Button onClick={handlePlusTemplateClick} title={t('create_job_from_template')} className="add-task btn btn-primary rounded-circle text-white position-fixed" role="button" data-target='button-add-from-template' disabled={showNewTask || showNewTaskTemplate}>
            <i className="far fa-file-plus" aria-hidden="true"></i>
            <span className="sr-only">Create Group</span>
          </Button>)}

          <div className='col-12' ref={tasksRef}>
            {(!tasksNumber && isNewLocation && !showNewTask && !showNewTaskTemplate && !loading) ? (
              <EmptyLocation
                onAddTask={handlePlusClick}
                onAddGroup={handlePlusTemplateClick}
                onAddTemplate={addTaskTemplate}
                my={my}
                tab={tab || 'tasks'}
              />
            ) :
              (
                <Accordion defaultActiveKey={isTaskReview ? '1' : null}>
                  <div className={'mb-3'}>
                    <div className="d-flex">
                      <div className="px-0">
                        <h4 className="mt-1">{' '}{tab === 'tasks' ? getFilterCopy('Tasks') : getFilterCopy('Groups')}<small className="text-muted"> ({getFiltersCount()})</small></h4>
                      </div>
                      <div className="col px-0 text-right">
                        {(locationUserRole === 'Owner' || locationUserRole === 'Manager') && tab === 'tasks' && bulkSelectTaskArray.length !== 0 && (
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
                        {tab === 'tasks' && <Button variant="outline-secondary" className="ml-2" role="button" onClick={() => setShowPreDefinedFilters(true)}>
                          <i className="fas fa-sort-size-down" aria-hidden="true"></i>
                          <span className="sr-only">Quick Filter and Sort</span>
                        </Button>}
                        {showPreDefinedFilters && <PreDefinedFiltersModal
                          onClose={() => setShowPreDefinedFilters(false)}
                          onUpdate={handlePDFilterUpdate}
                          show={showPreDefinedFilters}
                        />}
                        {' '}
                        <ToggleButton eventKey='1' className="btn btn-outline-secondary ml-2" role="button" data-toggle="collapse" href="#task-filters" aria-expanded="false" aria-controls="task-filters">
                          <i className="fas fa-filter" aria-hidden="true"></i>
                          <span className="sr-only">Filter Tasks</span>
                        </ToggleButton>
                      </div>
                    </div>
                    <p className="small text-secondary mb-0"><Trans>{tab === 'tasks' ? `Sorted by: ${sort.value}` : `Sorted by: ${sortGrp.value}`}</Trans></p>
                  </div>
                  <Accordion.Collapse eventKey='1' className='row'>
                    <div className='col'>
                      <div className={classnames([
                        'row bg-white border-top border-bottom py-3 mb-3',
                        !isTm && 'bg-white',
                        isTm && 'bg-light',
                      ])}>
                        <div className='col'>
                          <div className='form-group mb-2'>
                            <label className='text-secondary mb-1' htmlFor='status'>
                              <small><Trans i18nKey="status" /></small>
                            </label>
                            {tab === 'tasks' ? <Select
                              value={tab === 'groups' ? filterGrp : filter}
                              isMulti
                              name="filtersRS"
                              options={filterOpts}
                              classNamePrefix="select"
                              hideSelectedOptions={false}
                              components={{ ValueContainer, Option, ClearIndicator: () => null, IndicatorSeparator: () => null }}
                              styles={customStyles}
                              isSearchable={false}
                              onChange={handleFilterChangeRS}
                            /> :
                              <Select
                                value={filterGrp}
                                isMulti
                                name="filtersRS"
                                options={filterOptsGrp}
                                classNamePrefix="select"
                                hideSelectedOptions={false}
                                components={{ ValueContainer, Option, ClearIndicator: () => null, IndicatorSeparator: () => null }}
                                styles={customStyles}
                                isSearchable={false}
                                onChange={handleFilterChangeRS}
                              />}
                          </div>
                          <div className='form-group mb-2'>
                            <label className='text-secondary mb-1' htmlFor='sort'>
                              <small>Creator</small>
                            </label>
                            <Select
                              value={tab === 'groups' ? reportersSelectedGrp : reportersSelected}
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
                          {tab === 'tasks' && <div className='form-group mb-2'>
                            <label className='text-secondary mb-1' htmlFor='sort'>
                              <small>Due Date</small>
                            </label>
                            <Select
                              value={tab === 'groups' ? dueDateSelectedGrp : dueDateSelected}
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
                          </div>}
                        </div>
                        <div className='col pl-0'>
                          <div className='form-group mb-2'>
                            <label className='text-secondary mb-1' htmlFor='sort'>
                              <small>Assignee</small>
                            </label>
                            <Select
                              value={tab === 'groups' ? assigneesSelectedGrp : assigneesSelected}
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
                              value={tab === 'groups' ? sortGrp : sort}
                              defaultValue={'value'}
                              id='sort'
                              options={tab === 'groups' ? SortByRSGrp : SortByRS.filter(item => (item.sortBy !== 'sequenceOrder' && item.value !== 'Recently Completed' && item.value !== 'Require Review'))}
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
                          {tab === 'tasks' && <div className='form-group mb-2'>
                            <label className='text-secondary mb-1' htmlFor='sort'>
                              <small>Priority</small>
                            </label>
                            <Select
                              value={tab === 'groups' ? prioritySelectedGrp : prioritySelected}
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
                          </div>}
                        </div>
                      </div>
                    </div>
                  </Accordion.Collapse>
                </Accordion>
              )}

            {showNewTask && (
              <NewTask
                onDelete={() => setShowNewTask(false)}
                onUpdate={handleAddTask}
              />
            )}
            {showNewTaskTemplate && (
              <NewTaskTemplate
                onDelete={() => setShowNewTaskTemplate(false)}
                onUpdate={handleAddTemplateTask}
              />
            )}

            {tab === 'tasks' &&
              <>
                <InfiniteScroll pageStart={0} loadMore={getJobsAndTask} hasMore={isReadyToLoad()}>
                  <TasksList
                    tasks={nonGrpJobTasks}
                    handleRemove={handleRemove}
                    my={my}
                    getLocation={getLocation}
                    setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                    setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                    numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                    setFilter={setFilter}
                    locationUserRole={loc && loc.locationUserRole}
                    updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                    tab={tab}
                    isNotifyPage={isNotifyPage}
                    insertCopiedTask={insertCopiedTask}
                    updateFilters={updateFilters}
                    bulkSelectTaskArray={bulkSelectTaskArray}
                    setBulkSelectTaskArray={setBulkSelectTaskArray}
                    setShowCreateBtn={setShowCreateBtn}
                  />
                </InfiniteScroll>
                {isFetching && !showNewTask && <div className="text-center mt-3">
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
                </div>}
              </>
            }
            {tab === 'groups' &&
              <>
                <InfiniteScroll pageStart={0} loadMore={getGroups} hasMore={isGrpReadyToLoad()}>
                  <TasksList
                    tasks={grpJobTasks}
                    handleRemove={handleRemove}
                    my={my}
                    getLocation={getLocation}
                    setShowNewTask={setShowNewTask}
                    setAllCustomeJobReviewsInListCompleted={setAllCustomeJobReviewsInListCompleted}
                    setNumberofCustomTasksReviewed={setNumberofCustomTasksReviewed}
                    numberofCustomTasksReviewed={numberofCustomTasksReviewed}
                    setFilter={setFilter}
                    locationUserRole={loc && loc.locationUserRole}
                    nonGrpJobTasks={grpJobTasks}
                    setNonGrpJobTasks={setGrpJobTasks}
                    updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                    tab={tab}
                    updateFilters={updateFilters}
                    getJobsAndTask={getJobsAndTask}
                    getGroups={getGroups}
                    setShowCreateBtn={setShowCreateBtn}
                  />
                </InfiniteScroll>
                {isGrpFetching && !showNewTaskTemplate && <div className="text-center mt-3">
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
                </div>}
              </>
            }

            {(!initialLoading && !tasksNumber && !tasks.length && !isNewLocation && !showNewTask && !showNewTaskTemplate && (tab === 'tasks' && !isNotifyPage && noTasksToLoad()) || (tab === 'groups' && noGroupsToLoad() && !isNotifyPage && !isNewLocation && !showNewTaskTemplate)) &&
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
                                  {tab === 'groups' ? <Trans i18nKey="no_active_groups" defaults="Looks like you have no active groups." /> : <Trans i18nKey="no_active_tasks1" defaults="Looks like you have no active tasks." />}
                                  <br />
                                  {tab === 'groups' ? <Trans i18nKey="btns_create_group" defaults="Use the button below to create a group." /> : <Trans i18nKey="no_active_tasks1" defaults="Use the button below to create a task." />}
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
            <div className="clearfix pt-4"></div>
          </div>
        </div>
      </div>
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
    </>
  );
};

Tasks.propTypes = {
  my: PropTypes.bool,
  isLoading: PropTypes.bool,
  setAllCustomeJobReviewsInListCompleted: PropTypes.func,
  setNumberofCustomTasksReviewed: PropTypes.func,
  numberofCustomTasksReviewed: PropTypes.number,
  isNotifyPage: PropTypes.bool,
};

Tasks.defaultProps = {
  my: false,
  isLoading: false,
  isNotifyPage: false,
};

Tasks.displayName = 'LocationDetailsTasks';
export default Tasks;
