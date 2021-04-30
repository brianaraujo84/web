import React from 'react';
import { shallow } from 'enzyme';

import Page500 from '../../components/pages/page500';

describe('Page 500', () => {
  let props;

  beforeEach(() => {
    props = {

    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Page500 {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
