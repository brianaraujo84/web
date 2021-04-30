import i18n from '../i18n';

const SortBy = {
  dateCreatedNewest: i18n.t('date_new_first'),
  dateCreatedOldest: i18n.t('date_old_first'),
  dateScheduledNewest: i18n.t('date_schd_new_first'),
  dateScheduledOldest: i18n.t('date_schd_old_first'),
  locationAz: i18n.t('workspace_a_z'),
  locationZa: i18n.t('workspace_z_a'),
};

export const SortByRS = [
  { value: 'Recently Created', label: 'Created', subLabel: 'Newest First', sortBy: 'createdDate', sortByOrder: 'desc' },
  { value: 'Created Oldest First', label: 'Created', subLabel: 'Oldest First', sortBy: 'createdDate', sortByOrder: 'asc' },
  { value: 'Scheduled Newest First', label: 'Scheduled', subLabel: 'Newest First', sortBy: 'nextOccurrenceDate', sortByOrder: 'desc' },
  { value: 'Scheduled Oldest First', label: 'Scheduled', subLabel: 'Oldest First', sortBy: 'nextOccurrenceDate', sortByOrder: 'asc' },
  { value: 'Priority', label: 'Priority', subLabel: 'Highest First', sortBy: 'Priority', sortByOrder: 'desc' },
  { value: 'Priority Lowest First', label: 'Priority', subLabel: 'Lowest First', sortBy: 'Priority', sortByOrder: 'asc' },
  { value: 'Due Newest First', label: 'Due', subLabel: 'Newest First', sortBy: 'nonEmptyDueDate', sortByOrder: 'desc' },
  { value: 'Due Oldest First', label: 'Due', subLabel: 'Oldest First', sortBy: 'nonEmptyDueDate', sortByOrder: 'asc' },
  { value: 'Task Order', label: 'Task Order', subLabel: '', sortBy: 'sequenceOrder', sortByOrder: 'asc' },
  { value: 'Recently Completed', label: 'Recently Completed', subLabel: '', sortBy: 'modifiedDate', sortByOrder: 'desc' },
  { value: 'Require Review', label: 'Require Review', subLabel: '', sortBy: 'modifiedDate', sortByOrder: 'asc' },
];

export const SortByRSGrp = [
  { value: 'Created Newest First', label: 'Created', subLabel: 'Newest First', sortBy: 'createdDate', sortByOrder: 'desc' },
  { value: 'Created Oldest First', label: 'Created', subLabel: 'Oldest First', sortBy: 'createdDate', sortByOrder: 'asc' },
  { value: 'Scheduled Newest First', label: 'Scheduled', subLabel: 'Newest First', sortBy: 'nextOccurrenceDate', sortByOrder: 'desc' },
  { value: 'Scheduled Oldest First', label: 'Scheduled', subLabel: 'Oldest First', sortBy: 'nextOccurrenceDate', sortByOrder: 'asc' },
];

export default SortBy;
