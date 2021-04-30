import React from 'react';
import { shallow } from 'enzyme';

import CompleteModal from '../../../components/shared/modal/complete';

describe('CompleteModal', () => {
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
    const wrapper = shallow(<CompleteModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders custom buttons', () => {
    const p = {
      ...props,
      deleteText: 'Delete',
      cancelText: 'Cancel',
    };
    const wrapper = shallow(<CompleteModal {...p} />);
    expect(wrapper.length).toBe(1);
  });
});
