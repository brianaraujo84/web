import React from 'react';
import { shallow } from 'enzyme';

import ConfirmDeleteImageModal from '../../../components/shared/task-image/confirm-delete-modal';

describe('ConfirmDeleteImageModal', () => {
  let props;

  beforeEach(() => {
    props = {
      show: true,
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ConfirmDeleteImageModal {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
