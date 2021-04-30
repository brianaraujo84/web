import React from 'react';
import { shallow } from 'enzyme';

import CropModal from '../../../components/shared/crop-modal';

describe('CropModal', () => {
  let props;

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    props = {
      onClose: jest.fn(),
      onUpdate: jest.fn(),
      photo: {},
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<CropModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    let cleanupFunc;
    const setImgUrl = jest.fn();
    const setCroppedImage = jest.fn();
    const setCrop = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['url', setImgUrl]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setCroppedImage]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setCrop]);

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    shallow(<CropModal {...props} />);
    expect(setImgUrl).toHaveBeenCalled();
    cleanupFunc();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('handleSave', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce(['url', jest.fn()]);
    const wrapper = shallow(<CropModal {...props} />);
    const handleSave = wrapper.find('[data-target="submit-button"]').invoke('onClick');
    handleSave();
    expect(props.onUpdate).toHaveBeenCalled();
  });

  it('onClose', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce(['url', jest.fn()]);
    const wrapper = shallow(<CropModal {...props} />);
    const onClose = wrapper.find('[data-target="cancel-button"]').invoke('onClick');
    onClose();
    expect(props.onClose).toHaveBeenCalled();
  });
  it('onCropChange', () => {
    const setCrop = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['url', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setCrop]);
    const wrapper = shallow(<CropModal {...props} />);
    const onChange = wrapper.find('[data-target="react-crop"]').invoke('onChange');
    onChange();
    expect(setCrop).toHaveBeenCalled();
  });

  it('onImageLoaded', async () => {
    const canvas = {
      toBlob: jest.fn().mockResolvedValueOnce({}),
      getContext: jest.fn().mockReturnValue({ drawImage: jest.fn(), }),
      drawImage: jest.fn(),
    };
    const tmpCreateElement = document.createElement;
    document.createElement = (name, ...rest) => {
      if (name === 'canvas') {
        return canvas;
      }
      return tmpCreateElement(name, rest);
    };


    const image = {

    };
    const setCroppedImage = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['url', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setCroppedImage]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    const wrapper = shallow(<CropModal {...props} />);
    const onImageLoaded = wrapper.find('[data-target="react-crop"]').invoke('onImageLoaded');
    const onComplete = wrapper.find('[data-target="react-crop"]').invoke('onComplete');
    onImageLoaded(image);
    onComplete({});
    expect(canvas.toBlob).toHaveBeenCalled();
    const [[toBlobCb]] = canvas.toBlob.mock.calls;

    await toBlobCb({});
    expect(setCroppedImage).toHaveBeenCalled();
    setCroppedImage.mockRestore();
    await toBlobCb();
    expect(setCroppedImage).not.toHaveBeenCalled();
    document.createElement = tmpCreateElement;
  });
});
