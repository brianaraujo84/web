import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import profileReducer from './reducers/profile';
import locationReducer from './reducers/location';
import objectReducer from './reducers/object';
import objectsReducer from './reducers/objects';
import toastsReducer from './reducers/toasts';
import filesReducer from './reducers/files';
import tasksActionsReducer from './reducers/tasks-actions';
import electronReducer from './reducers/electron';

const rootReducer = combineReducers({
  electron: electronReducer,
  profile: profileReducer,
  toasts: toastsReducer,
  files: filesReducer,
  geolocation: locationReducer,
  locationZones: objectsReducer('locationZones'),
  locations: objectsReducer('locations'),
  zoneTypes: objectsReducer('zoneTypes'),
  locationTypes: objectsReducer('locationTypes'),
  loc: objectReducer('location'),
  company: objectReducer('company'),
  tasks: objectsReducer('tasks'),
  customJobs: objectsReducer('customJobs'),
  newTemplate: objectReducer('newTemplate'),
  task: objectReducer('task'),
  assign: objectReducer('assign'),
  managers: objectsReducer('managers'),
  contacts: objectsReducer('contacts'),
  templates: objectsReducer('templates'),
  myTemplates: objectsReducer('myTemplates'),
  validatePasscode: objectReducer('validatePasscode'),
  templateTasks: objectReducer('templateTasks'),
  device: objectReducer('device'),
  deviceLocations: objectsReducer('deviceLocations'),
  tooltips: objectReducer('tooltips'),
  locationDetailsPreferences: objectReducer('locationDetailsPreferences'),
  template: objectReducer('template'),
  taskStatus: objectReducer('taskStatus'),
  locationType: objectReducer('locationType'),
  taskGroupFilters: objectReducer('taskGroupFilters'),
  completedTemplateGroupData: objectReducer('completedTemplateGroupData'),
  comments: objectsReducer('comments'),
  recentComments: objectsReducer('recentComments'),
  headerContent: objectReducer('headerContent'),
  isSubMenuExpanded: objectReducer('isSubMenuExpanded'),
  userpreferences: objectReducer('userpreferences'),
  taskCommentList: objectsReducer('taskCommentList'),
  groupMenuUpdate: objectReducer('groupMenuUpdate'),
  taskGroups: objectsReducer('taskGroups'),
  templateGroups: objectsReducer('templateGroups'),
  tasksActions: tasksActionsReducer,
  expandedTaskList: objectsReducer('expandedTaskList')
});

const enhancers = [];
const middleware = [
  thunk
];

const storeEl = document.getElementById('ss-store-data');

const initialState = {
  ...(JSON.parse(storeEl && storeEl.innerHTML) || {}),
};
delete window.STORE_DATA;

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

export default store;
