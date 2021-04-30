import React from 'react';
import { shallow } from 'enzyme';

import DeleteModal from '../../../components/shared/modal/delete';

describe('DeleteModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
      show: true,
      title: 'some title',
      messageText: 'some message',

    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DeleteModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders custom buttons', () => {
    const p = {
      ...props,
      deleteText: 'Delete',
      cancelText: 'Cancel',
    };
    const wrapper = shallow(<DeleteModal {...p} />);
    expect(wrapper.length).toBe(1);
  });
});
