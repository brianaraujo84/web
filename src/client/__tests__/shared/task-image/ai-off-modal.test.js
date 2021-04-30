import React from 'react';
import { shallow } from 'enzyme';

import AIOffModal from '../../../components/shared/task-image/ai-off-modal';

describe('AIOffModal', () => {
  let props;

  beforeEach(() => {
    props = {
      show: true,
      onClose: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<AIOffModal {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
