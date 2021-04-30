import React from 'react';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';

import Utils from '../../utils';

import NewTask from '../../components/pages/location-details/new-task';

describe('LocationDetailsNewTask', () => {
  let props;
  let formik;

  beforeEach(() => {
    props = {
      onDelete: jest.fn(),
      onUpdate: jest.fn(),
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      validateForm: () => {},
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    const wrapper = shallow(<NewTask {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleUpdate', async () => {
    jest.spyOn(Utils, 'toBase64').mockResolvedValue('someimagebase64data');

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([-1, jest.fn()]);

    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<NewTask {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(props.onUpdate).toHaveBeenCalled();
  });

  it('DeleteModal', () => {
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const wrapper = shallow(<NewTask {...props} />);
    const showModal = wrapper.find('DeleteModal').invoke('onCancel');
    const deleteModal = wrapper.find('DeleteModal').invoke('onConfirm');
    showModal();
    deleteModal();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
    expect(props.onDelete).toHaveBeenCalled();
  });

  it('setShowDeleteModal', () => {
    const setShowAssignModal = jest.fn();
    const setShowScheduleModal = jest.fn();
    const setAssignData = jest.fn();
    const setShowDeleteModal = jest.fn();
    const setShowPlaceHolderCard = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowAssignModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowScheduleModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setAssignData]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeleteModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowPlaceHolderCard]);
    const wrapper = shallow(<NewTask {...props} />);
    wrapper.find('[data-target="button-delete"]').simulate('click');
    wrapper.update();
  });

  it('useEffect', () => {
    const focus = jest.fn();
    const apply = jest.fn();
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { focus, apply } });
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    jest.spyOn(React, 'useEffect').mockImplementation(focus);
    shallow(<NewTask {...props} />);
    expect(focus).toHaveBeenCalled();
  });
});
