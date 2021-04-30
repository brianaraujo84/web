import React from 'react';
import { shallow } from 'enzyme';

import Page404 from '../../components/pages/page404';

describe('Page 404', () => {
  let props;

  beforeEach(() => {
    props = {

    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Page404 {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
