import i18n from '../i18n';

const TaskStatus = {
  notStarted: 'not started',
  open: 'open',
  assigned: 'assigned',
  accepted: 'accepted',
  declined: 'declined',
  inProgress: 'in progress',
  review: 'review',
  completed: 'completed',
  rework: 'rework',
  copy: 'copy',
  rejected: 'rejected',
  incomplete: 'incomplete'
};

export const TaskFilterOptions = [
  {
    value: '',
    text: i18n.t('all_active'),
  },
  {
    value: 'Assigned',
    text: i18n.t('assigned'),
  },
  {
    value: 'Rework',
    text: i18n.t('rework'),
  },
  {
    value: 'Accepted',
    text: i18n.t('accepted'),
  },
  {
    value: 'In Progress',
    text: i18n.t('in_progress'),
  },
  {
    value: 'Review',
    text: i18n.t('review'),
  },
  {
    value: 'Completed',
    text: i18n.t('completed'),
  },
  {
    value: 'Incomplete',
    text: i18n.t('incomplete'),
  },
];

export default TaskStatus;
