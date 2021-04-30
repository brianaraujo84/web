import React from 'react';
import { shallow } from 'enzyme';

import AddDevice from '../../components/pages/add-device';

describe('AddDevice', () => {
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
    const wrapper = shallow(<AddDevice {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
