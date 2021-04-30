import React from 'react';
import { shallow } from 'enzyme';

import Signup from '../../components/pages/signup';

describe('Signup', () => {
  let props;

  beforeEach(() => {
    props = {

    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Signup {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
