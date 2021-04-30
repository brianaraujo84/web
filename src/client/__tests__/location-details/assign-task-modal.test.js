import React from 'react';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';

import AssignTaskModal from '../../components/pages/location-details/assign-task-modal';

describe('AssignTaskModal', () => {
  let props, formik;

  beforeEach(() => {
    props = {
      show: true,
      task: {
        taskId: 123,
        task: 'task name',
        taskDescription: 'Description'
      },
      onReassign: jest.fn(),
      onCancel: jest.fn(),
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      resetForm: jest.fn(),
      setValues: jest.fn(),
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<AssignTaskModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('showDescription', () => {
    const photos = [{ url: 'abc.png', name: 'abc.png' }, { url: 'abc1.png', name: 'abc1.png' }];
    const setShowDescription = jest.fn();
    const setShowAddPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDescription]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAddPhoto]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([photos, jest.fn()]);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    const wrapper = shallow(<AssignTaskModal {...props} />);
    const handleChange = wrapper.find('[data-target="textarea-description"]').invoke('onChange');
    const setShowAddPhotoFn = wrapper.find('[data-target="button-show-add-photo"]').invoke('onClick');
    const setShowDescriptionFn2 = wrapper.find('[data-target="add-description"]').invoke('onClick');
    setShowAddPhotoFn(false);
    setShowDescriptionFn2(a => !a);
    handleChange({ target: { name: 'name', value: '123' } });

    expect(formik.setFieldValue).toHaveBeenCalled();
    expect(setShowDescription).toHaveBeenCalled();
    expect(setShowAddPhoto).toHaveBeenCalled();
    getForm.mockRestore();
  });

  it('deleteImage', () => {
    const photos = [{ url: 'abc.png', name: 'abc.png' }, { url: 'abc1.png', name: 'abc1.png' }];
    const setPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([photos, setPhoto]);

    const wrapper = shallow(<AssignTaskModal {...props} />);
    const removePhoto = wrapper.find('[data-target="task-image"]').at(0).invoke('onDelete');
    removePhoto(0);

    expect(setPhoto).toHaveBeenCalled();
  });

  it('handleShowAddPhoto', () => {
    const photos = [{ url: 'abc.png', name: 'abc.png' }, { url: 'abc1.png', name: 'abc1.png' }];
    const setPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([photos, setPhoto]);

    const wrapper = shallow(<AssignTaskModal {...props} />);
    const handleShowAddPhoto = wrapper.find('[data-target="add-pictures"]').at(0).invoke('onClick');
    handleShowAddPhoto(0);

    expect(setPhoto).not.toHaveBeenCalled();
  });

  it('handlePhotoAdd', () => {
    const setPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setPhoto]);
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    const wrapper = shallow(<AssignTaskModal {...props} />);
    const handlePhotoAdd = wrapper.find('[data-target="input-file"]').invoke('onChange');

    const event = {
      target: {
        files: [
          {
            type: 'data:/'
          },
          {
            type: 'image/png'
          },

        ],
      }
    };
    handlePhotoAdd(event);
    expect(setPhoto).toHaveBeenCalled();
  });

  it('submitForm', () => {
    const formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      resetForm: jest.fn(),
      setValues: jest.fn(),
      isSubmitting: true,
    };
    const setPhoto = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setPhoto]);
    const onReassign = jest.spyOn(props, 'onReassign').mockReturnValueOnce({});
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<AssignTaskModal {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});

    expect(onReassign).toHaveBeenCalled();
  });

});
