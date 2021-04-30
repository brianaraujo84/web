import React from 'react';
import { shallow } from 'enzyme';

import TaskComments from '../../components/pages/task-comments';

describe('Task Comments', () => {
  let props;

  beforeEach(() => {
    props = {};
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<TaskComments {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
