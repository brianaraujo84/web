import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Trans, useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-form-dynamic';


import { useActionDispatch } from '../../../hooks';
import { postConfidenceObject, getStandardObject } from '../../../redux/actions/object';
import { addToast } from '../../../redux/actions/toasts';
import ClockHoursSelect from '../../shared/time-dropdown/clock-hours-select';
import AmPmSelect from '../../shared/time-dropdown/am-pm-select';
import * as URLS from '../../../urls';

const OBJECT_LOСATION = 'location';

const OperationHoursModal = ({ show, onCancel, locationId, hoursofOperation: hOfOperation }) => {
  const { t } = useTranslation();
  const toast = useActionDispatch(addToast);

  const updateHours = useActionDispatch(postConfidenceObject('hoursofOperation', 'v1', `location/${locationId}/hours`));
  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));

  const fields = [
    {
      name: 'Monday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Monday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Monday')[0] : {
        'weekday': 'Monday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': false
      }
    },
    {
      name: 'MondayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Monday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Monday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'MondayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Monday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Monday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
    {
      name: 'Tuesday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Tuesday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Tuesday')[0] : {
        'weekday': 'Tuesday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': false
      },
    },
    {
      name: 'TuesdayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Tuesday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Tuesday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'TuesdayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Tuesday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Tuesday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
    {
      name: 'Wednesday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Wednesday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Wednesday')[0] : {
        'weekday': 'Wednesday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': false
      },
    },
    {
      name: 'WednesdayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Wednesday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Wednesday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'WednesdayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Wednesday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Wednesday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
    {
      name: 'Thursday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Thursday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Thursday')[0] : {
        'weekday': 'Thursday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': false
      },
    },
    {
      name: 'ThursdayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Thursday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Thursday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'ThursdayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Thursday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Thursday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
    {
      name: 'Friday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Friday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Friday')[0] : {
        'weekday': 'Friday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': false
      },
    },
    {
      name: 'FridayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Friday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Friday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'FridayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Friday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Friday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
    {
      name: 'Saturday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Saturday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Saturday')[0] : {
        'weekday': 'Saturday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': true
      },
    },
    {
      name: 'SaturdayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Saturday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Saturday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'SaturdayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Saturday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Saturday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
    {
      name: 'Sunday',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Sunday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Sunday')[0] : {
        'weekday': 'Sunday',
        'openingHour': '09:00:00',
        'closingHour': '05:00:00',
        'closed': true
      },
    },
    {
      name: 'SundayOpeningPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Sunday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Sunday')[0].openingHour.slice(0, 2) >= 12 : false,
    },
    {
      name: 'SundayClosingPm',
      initialValue: hOfOperation && hOfOperation.filter(item => item.weekday === 'Sunday').length !== 0 ? hOfOperation.filter(item => item.weekday === 'Sunday')[0].closingHour.slice(0, 2) >= 12 : true,
    },
  ];

  const handleSubmit = async () => {
    const {
      Monday,
      MondayOpeningPm,
      MondayClosingPm,
      Tuesday,
      TuesdayOpeningPm,
      TuesdayClosingPm,
      Wednesday,
      WednesdayOpeningPm,
      WednesdayClosingPm,
      Thursday,
      ThursdayOpeningPm,
      ThursdayClosingPm,
      Friday,
      FridayOpeningPm,
      FridayClosingPm,
      Saturday,
      SaturdayOpeningPm,
      SaturdayClosingPm,
      Sunday,
      SundayOpeningPm,
      SundayClosingPm,
    } = formik.values;
    try {
      const pmHourFormater = (timeString) => {
        const originalHours = timeString.slice(0, 2);
        if (originalHours > 12) {
          return timeString;
        }
        const updatedHoursInt = parseInt(originalHours) + 12;
        const updatedHour = updatedHoursInt.toString() + timeString.slice(2, 8);
        return updatedHour;
      };
      const amHourFormater = (timeString) => {
        const originalHours = timeString.slice(0, 2);
        if (originalHours < 12) {
          return timeString;
        }
        const updatedHoursInt = parseInt(originalHours) - 12;
        const updatedHour = updatedHoursInt.toString() + timeString.slice(2, 8);
        return updatedHour;
      };
      const hoursofOperation = [
        {
          weekday: Monday.weekday,
          openingHour: MondayOpeningPm ? pmHourFormater(Monday.openingHour) : amHourFormater(Monday.openingHour),
          closingHour: MondayClosingPm ? pmHourFormater(Monday.closingHour) : amHourFormater(Monday.closingHour),
          closed: Monday.closed,
          locationHourId: Monday.locationHourId,
        },
        {
          weekday: Tuesday.weekday,
          openingHour: TuesdayOpeningPm ? pmHourFormater(Tuesday.openingHour) : amHourFormater(Tuesday.openingHour),
          closingHour: TuesdayClosingPm ? pmHourFormater(Tuesday.closingHour) : amHourFormater(Tuesday.closingHour),
          closed: Tuesday.closed,
          locationHourId: Tuesday.locationHourId,
        },
        {
          weekday: Wednesday.weekday,
          openingHour: WednesdayOpeningPm ? pmHourFormater(Wednesday.openingHour) : amHourFormater(Wednesday.openingHour),
          closingHour: WednesdayClosingPm ? pmHourFormater(Wednesday.closingHour) : amHourFormater(Wednesday.closingHour),
          closed: Wednesday.closed,
          locationHourId: Wednesday.locationHourId,
        },
        {
          weekday: Thursday.weekday,
          openingHour: ThursdayOpeningPm ? pmHourFormater(Thursday.openingHour) : amHourFormater(Thursday.openingHour),
          closingHour: ThursdayClosingPm ? pmHourFormater(Thursday.closingHour) : amHourFormater(Thursday.closingHour),
          closed: Thursday.closed,
          locationHourId: Thursday.locationHourId,
        },
        {
          weekday: Friday.weekday,
          openingHour: FridayOpeningPm ? pmHourFormater(Friday.openingHour) : amHourFormater(Friday.openingHour),
          closingHour: FridayClosingPm ? pmHourFormater(Friday.closingHour) : amHourFormater(Friday.closingHour),
          closed: Friday.closed,
          locationHourId: Friday.locationHourId,
        },
        {
          weekday: Saturday.weekday,
          openingHour: SaturdayOpeningPm ? pmHourFormater(Saturday.openingHour) : amHourFormater(Saturday.openingHour),
          closingHour: SaturdayClosingPm ? pmHourFormater(Saturday.closingHour) : amHourFormater(Saturday.closingHour),
          closed: Saturday.closed,
          locationHourId: Saturday.locationHourId,
        },
        {
          weekday: Sunday.weekday,
          openingHour: SundayOpeningPm ? pmHourFormater(Sunday.openingHour) : amHourFormater(Sunday.openingHour),
          closingHour: SundayClosingPm ? pmHourFormater(Sunday.closingHour) : amHourFormater(Sunday.closingHour),
          closed: Sunday.closed,
          locationHourId: Sunday.locationHourId,
        },
      ];
      await updateHours({ hoursofOperation });
      getLocation(locationId);
      onCancel();
      toast(t('Hours of operation updated'));
    } catch (error) {
      history.push(URLS.PAGE_400);
    }
  };

  const formik = useForm({ fields, onSubmit: handleSubmit });

  const handleWeekdayObjectUpdate = (name, value) => {
    formik.setFieldValue(name, value);
  };

  const handleCheckBox = (name, value) => {
    const weekdayObj = {
      'weekday': name,
      'openingHour': formik.values[name].openingHour,
      'closingHour': formik.values[name].closingHour,
      'closed': value,
      'locationHourId': formik.values[name].locationHourId,
    };
    formik.setFieldValue(name, weekdayObj);
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Trans i18nKey='hours_of_opration' />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Monday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input closed' type='checkbox' checked={formik.values.Monday.closed} onChange={(event) => handleCheckBox('Monday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Monday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Monday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'MondayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.MondayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Monday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'MondayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.MondayClosingPm} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Tuesday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input' type='checkbox' checked={formik.values.Tuesday.closed} onChange={(event) => handleCheckBox('Tuesday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Tuesday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pr-1'>
                <ClockHoursSelect name={'Tuesday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'TuesdayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.TuesdayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Tuesday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'TuesdayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.TuesdayClosingPm} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Wednesday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input' type='checkbox' checked={formik.values.Wednesday.closed} onChange={(event) => handleCheckBox('Wednesday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Wednesday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pr-1'>
                <ClockHoursSelect name={'Wednesday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'WednesdayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.WednesdayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Wednesday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'WednesdayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.WednesdayClosingPm} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Thursday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input' type='checkbox' checked={formik.values.Thursday.closed} onChange={(event) => handleCheckBox('Thursday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Thursday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pr-1'>
                <ClockHoursSelect name={'Thursday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'ThursdayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.ThursdayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Thursday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'ThursdayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.ThursdayClosingPm} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Friday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input' type='checkbox' checked={formik.values.Friday.closed} onChange={(event) => handleCheckBox('Friday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Friday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pr-1'>
                <ClockHoursSelect name={'Friday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'FridayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.FridayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Friday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'FridayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.FridayClosingPm} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Saturday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input' type='checkbox' checked={formik.values.Saturday.closed} onChange={(event) => handleCheckBox('Saturday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Saturday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pr-1'>
                <ClockHoursSelect name={'Saturday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'SaturdayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.SaturdayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Saturday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'SaturdayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.SaturdayClosingPm} />
              </div>
            </div>
          </Form.Group>
          <Form.Group className='day mb-3'>
            <div className='row'>
              <div className='col'>
                <h6>Sunday</h6>
              </div>
              <div className='col text-right'>
                <div className='form-check'>
                  <input id='monday-closed' className='form-check-input' type='checkbox' checked={formik.values.Sunday.closed} onChange={(event) => handleCheckBox('Sunday', event.target.checked)} />
                  <label className='form-check-label'> Closed</label>
                </div>
              </div>
            </div>
            <div className={formik.values.Sunday.closed ? 'd-flex hours disabled' : 'd-flex hours'}>
              <div className='d-flex w-100 pr-1'>
                <ClockHoursSelect name={'Sunday'} property={'openingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'SundayOpeningPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.SundayOpeningPm} />
              </div>
              <div className='pt-2 mx-1 text-secondary'>
                <span>-</span>
              </div>
              <div className='d-flex w-100 pl-1'>
                <ClockHoursSelect name={'Sunday'} property={'closingHour'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} values={formik.values} />
                <AmPmSelect name={'SundayClosingPm'} handleWeekdayObjectUpdate={handleWeekdayObjectUpdate} isPM={formik.values.SundayClosingPm} />
              </div>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onCancel} type='button' className='btn btn-outline-secondary' data-dismiss='modal' data-toggle='modal' data-target='button-close'>Cancel</button>
        <button onClick={handleSubmit} data-target="button-update" type='button' className='btn btn-primary' data-dismiss='modal' data-toggle='modal' >Update</button>
      </Modal.Footer>
    </Modal>
  );
};

OperationHoursModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  show: PropTypes.bool,
  locationId: PropTypes.string.isRequired,
  hoursofOperation: PropTypes.array,
};

OperationHoursModal.defaultProps = {
  show: false,
  hoursofOperation: []
};

OperationHoursModal.displayName = 'OperationHoursModal';

export default OperationHoursModal;
