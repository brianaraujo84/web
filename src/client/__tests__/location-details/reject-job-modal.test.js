import React from 'react';
import { shallow } from 'enzyme';

import RejectJobModal from '../../components/pages/location-details/reject-job-modal';

describe('RejectJobModal', () => {
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
    const wrapper = shallow(<RejectJobModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
