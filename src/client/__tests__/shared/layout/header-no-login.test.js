import React from 'react';
import { shallow } from 'enzyme';

import Header from '../../../components/shared/layout/header-no-login';

describe('HeaderNoLogin', () => {
  let props;

  beforeEach(() => {
    props = {};
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.length).toBe(1);
  });
});

