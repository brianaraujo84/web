import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import hooks from '../../../hooks';

import TaskImage from '../../../components/shared/task-image';

describe('TaskImage', () => {
  let props, state;

  beforeEach(() => {
    props = {
      editable: true,
      url: 'someurl',
      originUrl: 'someurl',
      onDelete: jest.fn(),
      updatedTask: {
        aiEnabled: true,
      },
      task: {
        stage: 'Open'
      }
    };

    state = {
      updatedTask: {
        aiEnabled: true,
      },
      loc: {
        data: {
          locationUserRole: 'Owner'
        }
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
        
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    const wrapper = shallow(<TaskImage {...props } />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="container"]').length).toBe(1);
  });
  it('renders not editable, no origin', () => {
    const p = { ...props, editable: false, originUrl: null, };
        
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    const wrapper = shallow(<TaskImage {...p} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="container"]').length).toBe(1);
    expect(wrapper.find('ImageModal').length).toBe(0);
  });

  it('hide', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="container"]').length).toBe(0);
  });

  it('onDelete', () => {
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('ConfirmDeleteImageModal').length).toBe(1);
    const handleConfirm = wrapper.find('ConfirmDeleteImageModal').invoke('onConfirm');
    handleConfirm();
    expect(props.onDelete).toHaveBeenCalled();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
  });

  it('no onDelete', () => {
    const p = { ...props, onDelete: undefined };
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<TaskImage {...p} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('ConfirmDeleteImageModal').length).toBe(1);
    const handleConfirm = wrapper.find('ConfirmDeleteImageModal').invoke('onConfirm');
    handleConfirm();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
  });

  it('ConfirmDeleteImageModal', () => {
    const setShowDeleteModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('ConfirmDeleteImageModal').length).toBe(1);
    const handleCancel = wrapper.find('ConfirmDeleteImageModal').invoke('onCancel');
    handleCancel();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
  });

  it('AIOffModal', () => {
    const setShowAIModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAIModal]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('AIOffModal').length).toBe(1);
    const handleClose = wrapper.find('AIOffModal').invoke('onClose');
    handleClose();
    expect(setShowAIModal).toHaveBeenCalledWith(false);
  });

  it('delete-image', () => {
    const setShowDeleteModal = jest.fn();
        
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="delete-image"]').length).toBe(1);
    const handleShow = wrapper.find('[data-target="delete-image"]').invoke('onClick');
    handleShow();
    expect(setShowDeleteModal).toHaveBeenCalledWith(true);
  });

  it('ai-off-image', () => {
    const setShowAIModal = jest.fn();
        
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAIModal]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="ai-off-image"]').length).toBe(1);
    const handleShow = wrapper.find('[data-target="ai-off-image"]').invoke('onClick');
    handleShow();
    expect(setShowAIModal).toHaveBeenCalledWith(true);
  });

  it('task-image', () => {
    const openImageModal = jest.fn();
        
    jest.spyOn(React, 'useState').mockReturnValueOnce([{updatedTask: { aiEnabled: 0 }}, jest.fn()]);
    jest.spyOn(hooks, 'useModal').mockReturnValueOnce([openImageModal]);
    const wrapper = shallow(<TaskImage {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="task-image"]').length).toBe(1);
    const handleShow = wrapper.find('[data-target="task-image"]').invoke('onClick');
    handleShow();
    expect(openImageModal).toHaveBeenCalled();
  });
});
