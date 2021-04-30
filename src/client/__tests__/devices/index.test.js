import React from 'react';
import { shallow } from 'enzyme';

import Devices from '../../components/pages/devices';

describe('Devices', () => {
  let props;

  beforeEach(() => {
    props = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Devices {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
