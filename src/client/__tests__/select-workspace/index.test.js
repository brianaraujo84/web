import React from 'react';
import { shallow } from 'enzyme';

import SelectWorkspace from '../../components/pages/select-workspace';

describe('SelectWorkspace', () => {
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
    const wrapper = shallow(<SelectWorkspace {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
