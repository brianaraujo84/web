import {
  getWeekOfMonth,
  format,
  addDays,
  addMinutes,
  isAfter,
  set,
  parseISO,
  endOfToday,
} from 'date-fns';

const DateUtils = {
  getDayOfWeek: (date) => {
    return date && date.getDay();
  },

  getDayOfMonth: (date) => {
    return date && date.getDate();
  },

  getWeekOfMonth: (date) => {
    return date && getWeekOfMonth(date);
  },

  getMonthOfYear: (date) => {
    return date && date.getMonth() + 1;
  },

  getCurrentTZName: () => {
    return Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;
  },

  unicodeFormat: (date = new Date(), dirtyFormatStr = 'yyyy-MM-dd HH:mm:ss') => {
    return date && format(date, dirtyFormatStr);
  },

  addDays: (date = new Date(), days) => {
    return date && addDays(date, days);
  },

  addMinutes: (date = new Date(), hours) => {
    return date && addMinutes(date, hours);
  },

  isAfter: (date1 = new Date(), date2 = new Date()) => {
    return isAfter(date1, date2);
  },

  roundToNextMinutes: (date = new Date(), nearestTo = 5) => {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes() + seconds / 60;
    const roundedMinutes = Math.floor(minutes / nearestTo) * nearestTo;
    const remainderMinutes = minutes % nearestTo;
    const addedMinutes = Math.ceil(remainderMinutes / nearestTo) * nearestTo;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes + addedMinutes);
    return DateUtils.unicodeFormat(d, 'HH:mm:ss');
  },

  getTimeIntervals: (interval = 5) => {
    const times = [];
    let tt = 0;
    const ap = ['AM', 'PM'];
    for (let i = 0; tt < 24 * 60; i++) {
      const hh = Math.floor(tt / 60);
      const mm = tt % 60;
      const h = hh % 12 ? hh % 12 : 12;
      const h24 = hh % 24;

      const time = ('0' + h).slice(-2) + ':' + ('0' + mm).slice(-2) + ' ' + ap[Math.floor(hh / 12)];
      const timeValue = ('0' + h24).slice(-2) + ':' + ('0' + mm).slice(-2) + ':00';
      times.push({value: timeValue, label: time});
      tt = tt + interval;
    }
    return times;
  },

  transFormDate: (values, date = new Date()) => {
    return set(date, values);
  },

  parseISO,
  endOfToday,

};
export default DateUtils;
