import React from 'react';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';

import Form from '../../components/pages/signup/form';

const flushPromises = () => new Promise(setImmediate);

describe('SignupForm', () => {
  let props, formik;
  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn(),
    };
    jest.useFakeTimers();


    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Form {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('onSubmit', () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Form {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});
    expect(props.handleSubmit).toHaveBeenCalled();
    getForm.mockRestore();
  });

  it('toBase64', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    const FileReaderMock = {
      readAsDataURL: jest.fn().mockResolvedValueOnce('some value'),
      result: '//',

    };
    const fr = jest.spyOn(window, 'FileReader').mockReturnValue(FileReaderMock);

    formik = {
      isValid: false,
      values: {
        password: 'ddfsf@3424kjhkjh',
        profilePhoto: 'somephoto',
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    shallow(<Form {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({ profilePhoto: 'photo' });
    await flushPromises();
    expect(FileReaderMock.readAsDataURL).toHaveBeenCalled();
    FileReaderMock.onload();
    try {
      FileReaderMock.onerror('somedata');
    } catch (e) {
      expect(e).toBe('somedata');
    }

    getForm.mockRestore();
    fr.mockRestore();
  });

  it('isValid', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce({ isValid: false, values: { password: 'ddfsf@3424kjhkjh' } });

    const wrapper = shallow(<Form {...props} />);
    expect(wrapper.find('[data-target="submit-next"]').prop('disabled')).toBe(true);

    getForm.mockRestore();
  });

  it('handlePhotoClick', async () => {
    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    const wrapper = shallow(<Form {...props} />);
    const handlePhotoClick = wrapper.find('[data-target="photo-upload-container"]').invoke('onClick');
    handlePhotoClick(event);
    expect(fileEl.current.click).toHaveBeenCalled();
  });

  it('handlePhotoDrop', async () => {
    const setTmpPhoto = jest.fn();
    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['photo', setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<Form {...props} />);
    const handlePhotoDrop = wrapper.find('[data-target="photo-upload-container"]').invoke('onDrop');
    const event = {
      dataTransfer: {
        files: [
          {
            type: 'image/png'
          },
        ],
      },
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    handlePhotoDrop(event);
    expect(setTmpPhoto).toHaveBeenCalledTimes(1);
  });

  it('handlePhotoDrop wrng type', async () => {
    const setProfilePhoto = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['photo', setProfilePhoto]);
    const wrapper = shallow(<Form {...props} />);
    const handlePhotoDrop = wrapper.find('[data-target="photo-upload-container"]').invoke('onDrop');
    const event = {
      dataTransfer: {
        files: [
          {
            type: 'someother'
          },
        ],
      },
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    handlePhotoDrop(event);
    expect(setProfilePhoto).toHaveBeenCalledTimes(0);
  });

  it('handlePhotoUpload', async () => {
    const setTmpPhoto = jest.fn();
    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['photo', setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<Form {...props} />);
    const handlePhotoUpload = wrapper.find('[data-target="file-input"]').invoke('onChange');
    const event = {
      target: {
        files: [
          {
            type: 'image/png'
          },
        ],
      },
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    handlePhotoUpload(event);
    expect(setTmpPhoto).toHaveBeenCalledTimes(1);
  });

  it('handlePhotoDragOver', async () => {
    const wrapper = shallow(<Form {...props} />);
    const handlePhotoDragOver = wrapper.find('[data-target="photo-upload-container"]').invoke('onDragOver');
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    handlePhotoDragOver(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('togglePassword', async () => {
    const wrapper = shallow(<Form {...props} />);
    expect(wrapper.find('[name="password"]').at(0).prop('type')).toBe('password');
    const append = wrapper.find('[name="password"]').at(0).prop('append');

    const appendWrapper = shallow(append);
    const togglePassword = appendWrapper.find('.input-group-append').invoke('onClick');
    togglePassword();
    expect(wrapper.find('[name="password"]').at(0).prop('type')).toBe('text');
    togglePassword();
    expect(wrapper.find('[name="password"]').at(0).prop('type')).toBe('password');
  });

  it('handleCropCancel handleCropUpdate', async () => {
    // const setProfilePhoto = jest.fn();
    const setTmpPhoto = jest.fn();
    // jest.spyOn(React, 'useState').mockReturnValueOnce([null, setProfilePhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

    formik = {
      isValid: false,
      values: {
        password: 'ddfsf@3424kjhkjh',
        profilePhoto: 'somephoto',
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    const wrapper = shallow(<Form {...props} />);
    const cropModal = wrapper.find('CropModal');
    expect(cropModal.length).toBe(1);
    const handleCropCancel = cropModal.invoke('onClose');
    const handleCropUpdate = cropModal.invoke('onUpdate');
    handleCropCancel();
    expect(setTmpPhoto).toHaveBeenCalledWith(null);
    const blob = new Blob();
    handleCropUpdate(blob);
    expect(formik.setFieldValue).toHaveBeenCalledWith('profilePhoto', blob);
  });

  it('useEffect', () => {
    let cleanupFunc;
    global.URL.createObjectURL = jest.fn().mockReturnValueOnce('somevalue');

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    const setTmpPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

    formik = {
      isValid: false,
      values: {
        profilePhoto: 'somephoto',
        password: 'ddfsf@3424kjhkjh',
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    const wrapper = shallow(<Form {...props} />);
    const cropModal = wrapper.find('CropModal');
    expect(cropModal.length).toBe(1);
    const handleCropUpdate = cropModal.invoke('onUpdate');
    const blob = new Blob();
    handleCropUpdate(blob);

    cleanupFunc();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });

  it('useEffect empty', () => {
    let cleanupFunc;
    global.URL.createObjectURL = jest.fn().mockReturnValueOnce(null);

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    const setTmpPhoto = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

    formik = {
      isValid: false,
      values: {
        password: 'ddfsf@3424kjhkjh',
        profilePhoto: 'somephoto',
      },
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    const wrapper = shallow(<Form {...props} />);
    const cropModal = wrapper.find('CropModal');
    expect(cropModal.length).toBe(1);
    const handleCropUpdate = cropModal.invoke('onUpdate');
    const blob = new Blob();
    handleCropUpdate(blob);

    cleanupFunc();
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});
