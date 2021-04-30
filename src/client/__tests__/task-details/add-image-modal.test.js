import React from 'react';
import { shallow } from 'enzyme';

import Hooks from '../../hooks';

import AddImageModal from '../../components/pages/task-details/add-image-modal';

describe('AddImageModal', () => {
  let props;
  const task = {
    jobActivityId: 1,
    taskActivityTrackerId: 1,
  };

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onUpload: jest.fn(),
      show: true,
      task,
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<AddImageModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handlePhotoAdd', () => {
    const event = {
      target: {
        files: [
          { type: 'image/png' },
        ],
      },
    };
    const setImageUrls = jest.fn();
    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setImageUrls]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    const wrapper = shallow(<AddImageModal {...props} />);
    const handlePhotoAdd = wrapper.find('[data-target="input-file"]').invoke('onChange');
    handlePhotoAdd(event);
    expect(setImageUrls).toHaveBeenCalled();
  });

  it('removePhoto', () => {
    const imageUrls = ['photo'];
    const setImageUrls = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([imageUrls, setImageUrls]);
    const wrapper = shallow(<AddImageModal {...props} />);
    const handleRemovePhoto = wrapper.find('[data-target="task-image"]').at(0).invoke('onDelete');
    handleRemovePhoto();
    expect(setImageUrls).toHaveBeenCalled();
  });

  it('uploadImagesList', () => {
    const photos = ['photo'];
    const uploadImages = jest.fn().mockReturnValue({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([photos, jest.fn()]);
    // jest.spyOn(React, 'useState').mockReturnValueOnce([false, setIsUploading]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(uploadImages);

    const wrapper = shallow(<AddImageModal {...props} />);
    const uploadImagesList = wrapper.find('[data-target="button-done"]').invoke('onClick');
    uploadImagesList();
    expect(props.onClose).toHaveBeenCalled();
  });

  it('handleCancel', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    const wrapper = shallow(<AddImageModal {...props} />);
    const handleCancel = wrapper.find('[data-target="cancel-btn"]').invoke('onClick');
    handleCancel();
    expect(props.onClose).toHaveBeenCalled();
  });
});
