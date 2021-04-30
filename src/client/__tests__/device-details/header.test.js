import React from 'react';
import { shallow } from 'enzyme';

import Header from '../../components/pages/device-details/header';

describe('Header', () => {
  let props;

  beforeEach(() => {
    props = {
      deviceId: 'id',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
