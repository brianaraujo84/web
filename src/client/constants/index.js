import states from './states';
import timezones from './timezones';
import countrycodes from './countrycodes';
import zoneTypes from './zone-types';
import TaskStatus, { TaskFilterOptions } from './task-status';
import { MAX_ALLOWED_IMAGES } from './task-images';
import { locationTypes, locationImageURLs } from './location-types';
import SortBy, { SortByRS, SortByRSGrp } from './sort-by';
import DeviceSetupSteps from './device-setup';
import SubscriptionPlans from './subscription-plans';
import StorageKeys from './storage-keys';
import Locales from './locales';
import ErrorTypes from './error-types';
import UserRole from './user-role';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,15}$/;

const placeholderUserImg = '/assets/img/placeholder-user.jpg';

export const COMMENT_ADDED_EVENT = 'COMMENT_ADDED';

export {
  states,
  timezones,
  countrycodes,
  passwordRegex,
  strongPasswordRegex,
  zoneTypes,
  placeholderUserImg,
  TaskStatus,
  MAX_ALLOWED_IMAGES,
  locationTypes,
  locationImageURLs,
  SortBy,
  SortByRS,
  SortByRSGrp,
  TaskFilterOptions,
  DeviceSetupSteps,
  SubscriptionPlans,
  StorageKeys,
  Locales,
  ErrorTypes,
  UserRole
};
