import React from 'react';
import { shallow } from 'enzyme';

import AmPmSelect from '../../../components/shared/time-dropdown/am-pm-select';

describe('AmPmSelect', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'Monday',
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
    const wrapper = shallow(<AmPmSelect {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
