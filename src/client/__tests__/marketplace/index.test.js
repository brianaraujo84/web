import React from 'react';
import { shallow } from 'enzyme';

import Marketplace from '../../components/pages/marketplace';

describe('Marketplace', () => {
  let props;

  it('renders correctly', () => {
    const wrapper = shallow(<Marketplace {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
