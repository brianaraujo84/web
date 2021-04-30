import React from 'react';
import { shallow } from 'enzyme';

import Breadcrumbs from '../../../components/shared/breadcrumbs';

describe('Breadcrumbs', () => {
  let props;

  beforeEach(() => {
    props = {
      current: 'dashboard',
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Breadcrumbs {...props} />);
    expect(wrapper.length).toBe(1);
  });
});

