import React from 'react';
import ReactRedux from 'react-redux';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';

import Hooks from '../../hooks';

import NewTaskTemplate from '../../components/pages/location-details/new-task-template';

describe('LocationDetailsNewTaskTemplate', () => {
  let props, state;

  beforeEach(() => {
    props = {
      onDelete: jest.fn(),
      onUpdate: jest.fn(),
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
      newTemplate: {
        data: {}
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

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
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);

    const s = {
      newTemplate: {
        data: {}
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<NewTaskTemplate {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('setShowTemplateSelection', () => {
    const setShowTemplateSelection = jest.fn();
    const setIsTitleValid = jest.fn();
    const setisExpandChecked = jest.fn();
    const handleClickTemplate = jest.fn();
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTemplateSelection]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsTitleValid]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setisExpandChecked]);
    const wrapper = shallow(<NewTaskTemplate {...props} />);
    expect(wrapper.length).toBe(1);
    setIsTitleValid(true);
    setisExpandChecked(true);
    expect(setisExpandChecked).toHaveBeenCalled();
    handleClickTemplate(event);
  });

  it('setShowTemplateSelection', () => {
    const setShowTemplateSelection = jest.fn();
    const setIsTitleValid = jest.fn();
    const setisExpandChecked = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsTitleValid]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTemplateSelection]);

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsTitleValid]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTemplateSelection]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsTitleValid]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowTemplateSelection]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);

    const wrapper = shallow(<NewTaskTemplate {...props} />);
    setisExpandChecked(true);
    expect(wrapper.length).toBe(1);
    setIsTitleValid(true);
    setShowTemplateSelection(true);
    expect(setShowTemplateSelection).toHaveBeenCalled();
  });

  it('useEffect geolocation', async () => {
    const s = {
      geolocation: {
        location: {}
      },
      newTemplate: {
        data: {}
      }
    };
    const getGeoLocation = jest.fn();
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getGeoLocation);
    shallow(<NewTaskTemplate {...props} />);
    expect(getGeoLocation).not.toHaveBeenCalled();
  });


  it('handleUpdate', async () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<NewTaskTemplate {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(props.onUpdate).toHaveBeenCalled();
  });


  it('useEffect', () => {
    const getTemplates = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getTemplates);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: { focus: jest.fn() } });
    shallow(<NewTaskTemplate {...props} />);
    expect(getTemplates).toHaveBeenCalled();
  });

  it('isValid', async () => {
    const formik = {
      isValid: false,
      values: {},
    };

    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<NewTaskTemplate {...props} />);
    expect(wrapper.find('[data-target="button-toggle-save"]').prop('disabled')).toBe(true);

    getForm.mockRestore();
  });

  it('DeleteModal', () => {
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const wrapper = shallow(<NewTaskTemplate {...props} />);
    const showModal = wrapper.find('DeleteModal').invoke('onCancel');
    const deleteModal = wrapper.find('DeleteModal').invoke('onConfirm');
    showModal();
    deleteModal();
    expect(props.onDelete).toHaveBeenCalled();
  });

  it('setShowDeleteModal', () => {
    const setShowDeleteModal = jest.fn();
    const handleDiscard = jest.fn();
    handleDiscard(true);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const wrapper = shallow(<NewTaskTemplate {...props} />);
    wrapper.find('[data-target="button-delete"]').simulate('click');
    expect(handleDiscard).toHaveBeenCalled();
  });
});
