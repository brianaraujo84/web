import React from 'react';
import { shallow } from 'enzyme';

import Footer from '../../../components/shared/layout/footer';

describe('Footer', () => {
  let props;

  beforeEach(() => {
    props = {};
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Footer {...props} />);
    expect(wrapper.length).toBe(1);
  });
});

