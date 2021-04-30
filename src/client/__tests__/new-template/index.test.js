import React from 'react';
import { shallow } from 'enzyme';

import NewTemplate from '../../components/pages/new-template';

describe('NewTemplate', () => {
  let props;

  beforeEach(() => {
    props = {
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<NewTemplate {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
