import React from 'react';
import { shallow } from 'enzyme';

import ImageModal from '../../../components/shared/task-image/image-modal';

describe('ImageModal', () => {
  let props;

  beforeEach(() => {
    props = {
      show: true,
      url: 'someurl',
      onHide: jest.fn(),
      onDelete: jest.fn(),
      onAIClick: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ImageModal {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
