import React from 'react';
import { shallow } from 'enzyme';

import RejectTaskModal from '../../components/pages/location-details/reject-task-modal';

describe('RejectTaskModal', () => {
  let props;

  beforeEach(() => {
    props = {
      show: true,
      onReject: jest.fn(),
      onReassign: jest.fn(),
      onCancel: jest.fn(),
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<RejectTaskModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
