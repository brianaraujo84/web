import React from 'react';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';
import ReactRedux from 'react-redux';

import Hooks from '../../hooks';
import Form from '../../components/pages/account/form';

const flushPromises = () => new Promise(setImmediate);

describe('AccountForm', () => {
  let props, state, formik;
  const history = {
    push: jest.fn(),
  };

  beforeAll(() => {
    const { location: loc } = window;
    location = loc;
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn(),
    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '555555',
          img: 'someurl',
        },
      },
      geolocation: {},
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
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

  it('onSubmit', async () => {
    const changeUser = jest.fn().mockResolvedValueOnce({});
    const toast = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(changeUser);
    jest.spyOn(Hooks, 'useActionDispatch').mockImplementation((fn) => {
      if ('addToast' === fn.name) {
        return toast;
      } else {
        return changeUser;
      }
    });
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Form {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(changeUser).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith('Profile Updated!');
    getForm.mockRestore();
  });

  it('onSubmit failed', async () => {
    const changeUser = jest.fn().mockRejectedValueOnce();
    const toast = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(changeUser);
    jest.spyOn(Hooks, 'useActionDispatch').mockImplementation((fn) => {
      if ('addToast' === fn.name) {
        return toast;
      } else {
        return changeUser;
      }
    });
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Form {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(changeUser).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith('Profile Update Failed!');
    getForm.mockRestore();
  });

  it('toBase64', async () => {
    const setProfilePhoto = jest.fn();
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    const FileReaderMock = {
      readAsDataURL: jest.fn().mockResolvedValueOnce('some value'),
      result: '//',

    };
    const fr = jest.spyOn(window, 'FileReader').mockReturnValue(FileReaderMock);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['photo', setProfilePhoto]);
    shallow(<Form {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});
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
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce({ isValid: false, values: {} });
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<Form {...props} />);
    expect(wrapper.find('[data-target="submit-btn"]').prop('disabled')).toBe(true);

    getForm.mockRestore();
  });

  it('handlePhotoClick', async () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const fileEl = {
      current: {
        click: jest.fn(),
      }
    };
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
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
    jest.spyOn(React, 'useRef').mockReturnValueOnce(fileEl);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
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
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
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

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
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
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<Form {...props} />);
    const handlePhotoDragOver = wrapper.find('[data-target="photo-upload-container"]').invoke('onDragOver');
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };
    handlePhotoDragOver(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('handleCropCancel handleCropUpdate', async () => {
    const setProfilePhoto = jest.fn();
    const setTmpPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setProfilePhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

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
    expect(setProfilePhoto).toHaveBeenCalledWith(blob);
  });

  it('useEffect', () => {
    let cleanupFunc;
    global.URL.createObjectURL = jest.fn().mockReturnValueOnce('somevalue');

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    const setProfilePhoto = jest.fn();
    const setTmpPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setProfilePhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

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
    const setProfilePhoto = jest.fn();
    const setTmpPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setProfilePhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setTmpPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

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

  it('handleEdit', () => {
    const setEditable = jest.fn();
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setEditable]);
    const wrapper = shallow(<Form {...props} />);
    wrapper.find('[data-target="edit-link"]').simulate('click', event);
    expect(setEditable).toHaveBeenCalledWith(true);
  });

  it('handleDiscard', () => {
    const setEditable = jest.fn();
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setEditable]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['photo', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);

    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<Form {...props} />);
    wrapper.find('[data-target="discard-btn"]').simulate('click', event);
    expect(setEditable).toHaveBeenCalledWith(false);
  });
});
