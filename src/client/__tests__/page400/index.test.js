import React from 'react';
import { shallow } from 'enzyme';

import Page400 from '../../components/pages/page400';

describe('Page 400', () => {
  let props;

  beforeEach(() => {
    props = {

    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Page400 {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
