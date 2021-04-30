import React from 'react';
import { shallow } from 'enzyme';

import EllipsisMenu from '../../../components/shared/ellipsis-menu';

describe('EllipsisMenu', () => {
  let props;

  beforeEach(() => {
    props = {
      disabled: false,
      isDescriptionDisabled: false,
      isCopyDisabled: false,
      isAssociateDisabled: false,
      descriptionFunction: jest.fn(),
      copyFunction: jest.fn(),
      associateFunction: jest.fn(),
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<EllipsisMenu {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders custom delay', () => {
    const p = {
      ...props,
      delay: 5000,
    };
    const wrapper = shallow(<EllipsisMenu {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('addPhoto', () => {
    const setShowTaskDetails = jest.fn();
    const imageInputRef = {
      current: {
        click: jest.fn(),
      },
    };

    const p = {
      ...props,
      isAddImagesActive: true,
      handleAddImageButtonClick: jest.fn(
        imageInputRef.current.click(),
        setShowTaskDetails(true)
      ),
    };

    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);

    const wrapper = shallow(<EllipsisMenu {...p} />);
    const addPhoto = wrapper.find('[data-target="photo-menu-item"]').invoke('onClick');
    addPhoto();
    expect(setShowTaskDetails).toHaveBeenCalledWith(true);
  });
  it('addScreenshot', () => {
    const setShowTaskDetails = jest.fn();
    const imageInputRef = {
      current: {
        click: jest.fn(),
      },
    };

    const p = {
      ...props,
      isAddImagesActive: true,
      handleAddImageButtonClick: jest.fn(
        setShowTaskDetails(true)
      ),
    };

    jest.spyOn(React, 'useRef').mockReturnValueOnce(imageInputRef);

    const wrapper = shallow(<EllipsisMenu {...p} />);
    const addPhoto = wrapper.find('[data-target="photo-menu-item"]').invoke('onClick');
    addPhoto();
    expect(setShowTaskDetails).toHaveBeenCalledWith(true);
  });
});
