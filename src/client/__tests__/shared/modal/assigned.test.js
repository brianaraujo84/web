import React from 'react';
import { shallow } from 'enzyme';

import AssignedModal from '../../../components/shared/modal/assigned';

describe('AssignedModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      show: true,
      title: 'some title',
      messageText: 'some message',
      secondLineText: 'message',
      cancelText: 'cancel',
      confirmText: 'confirm'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<AssignedModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders custom buttons', () => {
    const p = {
      ...props,
      deleteText: 'Delete',
      cancelText: 'Cancel',
    };
    const wrapper = shallow(<AssignedModal {...p} />);
    expect(wrapper.length).toBe(1);
  });
});
