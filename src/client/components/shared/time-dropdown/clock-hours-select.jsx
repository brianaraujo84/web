import React from 'react';
import PropTypes from 'prop-types';

const ClockHoursSelect = ({name, property, handleWeekdayObjectUpdate, values}) => {

  const handleSelect = ({ target: { value } }) => {
    const weekdayObj = {
      'weekday': name,
      'openingHour': property === 'openingHour' ? value : values[name].openingHour,
      'closingHour': property === 'closingHour' ? value : values[name].closingHour,
      'closed': values[name].closed,
      'locationHourId': values[name].locationHourId,
    };
    handleWeekdayObjectUpdate(name, weekdayObj);
  };

  return (
    <select className='form-control time custom-select' id='monday-from' onChange={handleSelect}>
      <option value='01:00:00' selected={values[name][property] === '01:00:00' || values[name][property] === '13:00:00'  }>1:00</option>
      <option value='01:30:00' selected={values[name][property] === '01:30:00' || values[name][property] === '13:30:00'  }>1:30</option>
      <option value='02:00:00' selected={values[name][property] === '02:00:00' || values[name][property] === '14:00:00'  }>2:00</option>
      <option value='02:30:00' selected={values[name][property] === '02:30:00' || values[name][property] === '14:30:00'  }>2:30</option>
      <option value='03:00:00' selected={values[name][property] === '03:00:00' || values[name][property] === '15:00:00'  }>3:00</option>
      <option value='03:30:00' selected={values[name][property] === '03:30:00' || values[name][property] === '15:30:00'  }>3:30</option>
      <option value='04:00:00' selected={values[name][property] === '04:00:00' || values[name][property] === '16:00:00'  }>4:00</option>
      <option value='04:30:00' selected={values[name][property] === '04:30:00' || values[name][property] === '16:30:00'  }>4:30</option>
      <option value='05:00:00' selected={values[name][property] === '05:00:00' || values[name][property] === '17:00:00'  }>5:00</option>
      <option value='05:30:00' selected={values[name][property] ===  '05:30:00' || values[name][property] === '17:30:00' }>5:30</option>
      <option value='06:00:00' selected={values[name][property] ===  '06:00:00' || values[name][property] === '18:00:00' }>6:00</option>
      <option value='06:30:00' selected={values[name][property] ===  '06:30:00' || values[name][property] === '18:30:00'  }>6:30</option>
      <option value='07:00:00' selected={values[name][property] ===  '07:00:00' || values[name][property] ===  '19:00:00'  }>7:00</option>
      <option value='07:30:00' selected={values[name][property] ===  '07:30:00' || values[name][property] === '19:30:00'  }>7:30</option>
      <option value='08:00:00' selected={values[name][property] ===  '08:00:00' || values[name][property] === '20:00:00'  }>8:00</option>
      <option value='08:30:00' selected={values[name][property] ===  '08:30:00' || values[name][property] === '20:30:00'  }>8:30</option>
      <option value='09:00:00' selected={values[name][property] ===  '09:00:00' || values[name][property] === '21:00:00'  }>9:00</option>
      <option value='09:30:00' selected={values[name][property] ===  '09:30:00' || values[name][property] === '21:30:00'  }>9:30</option>
      <option value='10:00:00' selected={values[name][property] ===  '10:00:00' || values[name][property] === '22:00:00'  }>10:00</option>
      <option value='10:30:00' selected={values[name][property] ===  '10:30:00' || values[name][property] === '22:30:00'  }>10:30</option>
      <option value='11:00:00' selected={values[name][property] ===  '11:00:00' || values[name][property] === '23:00:00'  }>11:00</option>
      <option value='11:30:00' selected={values[name][property] ===  '11:30:00' || values[name][property] === '23:30:00'  }>11:30</option>
      <option value='12:00:00' selected={values[name][property] ===  '12:00:00' || values[name][property] === '24:00:00'  }>12:00</option>
      <option value='12:30:00' selected={values[name][property] ===  '12:30:00' || values[name][property] === '24:30:00'  }>12:30</option>
    </select>
  );
};

ClockHoursSelect.propTypes = {
  name: PropTypes.string,
  handleWeekdayObjectUpdate: PropTypes.func,
  property: PropTypes.string,
  values: PropTypes.object,
};

ClockHoursSelect.displayName = 'OperationHoursModal';

export default ClockHoursSelect;
