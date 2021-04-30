import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm, Select } from 'react-form-dynamic';

import DatePicker from 'react-datepicker';
import { DateUtils } from '../../../utils';
import SelectGroup from '../../shared/select-group';

const ScheduleModal = ({
  onClose,
  onUpdate,
  show,
  task,
}) => {
  const { t } = useTranslation();

  const fields = React.useMemo(() =>[
    {
      name: 'date',
      label: t('Date'),
      initialValue: new Date(),
      validations: [
        {
          rule: 'required',
        },
      ],
    },
    {
      name: 'startTime',
      label: t('Start Time'),
      initialValue: DateUtils.roundToNextMinutes(new Date()),
    },
    {
      name: 'endTime',
      label: t('End Time'),
      initialValue: DateUtils.roundToNextMinutes(DateUtils.addMinutes(new Date(), 30)),
      validations: [
        {
          rule: 'test',
          params: [
            'isAfter',
            t('End time should be greater than start time'),
            function (endTime) {
              return !DateUtils.isAfter(timeToDate(this.parent.startTime), timeToDate(endTime));
            }
          ]
        }
      ]
    },
    {
      name: 'repeat',
      initialValue: 'OneTime',
    }
  ], []);

  const repeatOptions = [
    {
      value: 'OneTime',
      label: t('never'),
    },
    {
      value: 'Daily',
      label: t('every_day'),
    },
    {
      value: 'Weekly',
      label: t('every_week'),
    },
    {
      value: 'Every other Week',
      label: t('rep_every_other_week'),
    },
    {
      value: 'Monthly',
      label: t('every_month'),
    },
    {
      value: 'Every other Month',
      label: t('rep_every_other_month'),
    },
    {
      value: 'Quarterly',
      label: t('rep_every_quarter'),
    },
    {
      value: 'Yearly',
      label: t('every_year'),
    },
    {
      label: t('multiple_times'),
      value: '',
      options: [
        {
          value: 'everyMinute-5',
          label: t('every_5mins'),
        },
        {
          value: 'everyMinute-10',
          label: t('every_10mins'),
        },
        {
          value: 'everyMinute-30',
          label: t('every_30mins'),
        },
        {
          value: 'everyHour-1',
          label: t('every_hour'),
        },
        {
          value: 'everyHour-4',
          label: t('every_4hrs'),
        },
        {
          value: 'everyHour-8',
          label: t('every_8hrs'),
        },
      ],
    },
  ];

  const datePickerRef = React.useRef(null);

  const rawDate = task && task.nextOccurrenceDate ? task.nextOccurrenceDate : task && task.taskRecurring && task.taskRecurring.nextOccurrenceDate ? task.taskRecurring.nextOccurrenceDate : undefined;
  const formatedDate = rawDate ? DateUtils.parseISO(rawDate) : undefined;

  const timeIntervals = React.useMemo(()=>{
    return DateUtils.getTimeIntervals();
  }, []);

  const isEditSchedule = React.useMemo(()=>{
    return task && task.taskRecurring;
  }, [task]);

  const onSubmit = (values, actions) => {
    onUpdate(values);
    actions.setSubmitting(false);
  };

  const handleDateChange = (date) => {
    formik.setFieldValue('date', date);
  };

  const handleStartTimeChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue('startTime', date).then( () => {
      formik.setFieldValue('endTime', DateUtils.roundToNextMinutes(DateUtils.addMinutes(timeToDate(date), 25)));
    });
  };

  const handleEndTimeChange = (event) => {
    const date = event.target.value;
    formik.setFieldValue('endTime', date);
  };

  const timeToDate = (timeString = '') => {
    const time = timeString.split(':');
    return DateUtils.transFormDate({hours: time[0], minutes: time[1]});
  };

  const formik = useForm({ fields, onSubmit });

  React.useEffect(() => {
    if (isEditSchedule) {
      let repeat = task.taskRecurring?.recurringType;
      if (repeat === 'EveryMinute') {
        repeat = `everyMinute-${task.taskRecurring?.everyMinute}`;
      } else if (repeat === 'Hourly') {
        repeat = `everyHour-${task.taskRecurring?.everyHour}`;
      }
      formik.setValues({
        date: formatedDate ? formatedDate : undefined,
        startTime: task.taskRecurring?.startTime,
        endTime: task.taskRecurring?.endTime,
        repeat,
      }).then(() => {
        formik.setErrors({ date: t('Please change to proceed') });
      });
    }
  }, [isEditSchedule]);

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-primary fad fa-calendar-alt" /> {t('Edit Start Date')}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row justify-content-center">
              <div className="col-12">
                <DatePicker
                  className="form-control"
                  onChange={handleDateChange}
                  selected={formik.values.date ? formik.values.date  : new Date()}
                  minDate={new Date()}
                  data-target="date-picker-date"
                  ref={datePickerRef}
                  customInput={<input style={{backgroundColor: '#ffffff'}}></input>}
                  inline
                />
              </div>
            </div>
            <div className="d-flex justify-content-center pt-3" id="timepicker">
              <div className="col p-0">
                <p className="mb-1 small text-secondary"><Trans i18nKey="start_time" /></p>
                <Select
                  name="startTime"
                  formik={formik}
                  options={timeIntervals}
                  classes={{ select: 'form-control' }}
                  onChange={handleStartTimeChange}
                  showError={false}
                  data-target="date-picker-start-time"
                />
              </div>
              <div className="col p-0 pl-3">
                <p className="mb-1 small text-secondary"><Trans i18nKey="end_time" /></p>
                <Select
                  name="endTime"
                  formik={formik}
                  options={timeIntervals}
                  classes={{ select: 'form-control' }}
                  onChange={handleEndTimeChange}
                  showError={false}
                  data-target="date-picker-end-time"
                />
              </div>
            </div>
            {formik.errors.endTime && <p className="error text-danger"><small>{formik.errors.endTime}</small></p>}

            <div className="pt-4">
              <p className="mb-1 small text-secondary"><Trans i18nKey="repeat" /></p>
              <SelectGroup
                name="repeat"
                formik={formik}
                options={repeatOptions}
                classes={{ select: 'form-control' }}
                showError={false}
                data-target="select-repeat"
              />
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onClose}>
              <Trans><Trans i18nKey="cancel" /></Trans>
            </Button>
            <Button variant="primary" type="submit" disabled={!formik.isValid || formik.isSubmitting}>
              {isEditSchedule ? <Trans i18nKey="schedule" /> : <Trans>Schedule Job</Trans>}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

    </>
  );
};


ScheduleModal.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  task: PropTypes.object,
};

ScheduleModal.defaultProps = {
  show: false,
  task: null,
  taskSummary: {},
};

ScheduleModal.displayName = 'LocationDetailsScheduleModal';
export default ScheduleModal;
