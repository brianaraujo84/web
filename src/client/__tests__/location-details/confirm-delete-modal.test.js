import React from 'react';
import { shallow } from 'enzyme';

import ConfirmDeleteModal from '../../components/pages/location-details/confirm-delete-modal';

describe('ConfirmDeleteModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      show: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ConfirmDeleteModal {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
