import React from 'react';
import PropTypes from 'prop-types';

const AmPmSelect = ({name, handleWeekdayObjectUpdate, isPM}) => {

  const handleSelect = (value) => {
    if (value === 'false') {
      handleWeekdayObjectUpdate(name, false);
    } else if (value === 'true') {
      handleWeekdayObjectUpdate(name, true);
    }
  };

  return (
    <select className="form-control custom-select ml-1" onChange={(event) => handleSelect(event.target.value)} defaultValue={isPM}>
      <option value={false} >AM</option>
      <option value={true} >PM</option>
    </select>
  );
};

AmPmSelect.propTypes = {
  name: PropTypes.string,
  handleWeekdayObjectUpdate: PropTypes.func,
  isPM: PropTypes.bool,
};

AmPmSelect.displayName = 'AmPmSelect';

export default AmPmSelect;
