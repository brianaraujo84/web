import React from 'react';
import { shallow } from 'enzyme';

import VirtualDisplay from '../../components/pages/virtual-display';

describe('VirtualDisplay', () => {
  let props;

  beforeEach(() => {
    jest.useFakeTimers();
    props = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<VirtualDisplay {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
