export const formatTaskRecurringType = (task) => {
  const recurringType = task && task.taskRecurring && task.taskRecurring.recurringType;
  if (recurringType === 'OneTime') {
    return;
  }
  if (recurringType === 'Daily') {
    return 'rep_every_day';
  }
  if (recurringType === 'Weekly') {
    return 'rep_every_week';
  }
  if (recurringType === 'Every other Week') {
    return 'rep_every_other_week';
  }
  if (recurringType === 'Monthly') {
    return 'rep_every_month';
  }
  if (recurringType === 'Every other Month') {
    return 'rep_every_other_month';
  }
  if (recurringType === 'Quarterly') {
    return 'rep_every_quarter';
  }
  if (recurringType === 'Yearly') {
    return 'rep_every_year';
  }
  if (recurringType === 'Hourly' && task.taskRecurring.everyHour === 1 ) {
    return 'rep_every_hour';
  }
  if (recurringType === 'Hourly' && task.taskRecurring.everyHour > 1) {
    return `Every ${task.taskRecurring?.everyHour} Hours`;
  }
  if (recurringType === 'EveryMinute' && task.taskRecurring && task.taskRecurring.everyMinute) {
    return `rep_every_${task.taskRecurring?.everyMinute}mins`;
  }
};
