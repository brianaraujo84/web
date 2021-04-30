import React from 'react';
import { shallow } from 'enzyme';

import ClockHoursSelect from '../../../components/shared/time-dropdown/clock-hours-select';

describe('ClockHoursSelect', () => {
  let props;

  beforeEach(() => {
    props = {
      values: {
        'Monday': {
          'weekday': 'Monday',
          'openingHour': '09:00:00',
          'closingHour': '17:00:00',
          'closed': false
        },
      },
      name: 'Monday',
      property: 'openingHour',
      handleWeekdayObjectUpdate: jest.fn(),
      isPM: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ClockHoursSelect {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
