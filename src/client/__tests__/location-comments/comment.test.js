import React from 'react';
import ReactRedux from 'react-redux';
import { shallow } from 'enzyme';

import Comment from '../../components/pages/location-comments/comment';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('Comment', () => {
  let props, state;

  beforeEach(() => {
    props = {
      commentId: 5,
      userName: 'John Doe',
      email: 'no@no.com',
      comment: 'This is a test comment',
      createdDate: '2021-01-01 02:58:45',
      timezone: 'Asia/Calcutta',
      isCurrentUser: true,
    };
    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          isOwner: false,
          isManager: false,
          isWorker: true
        },
        forgotPassword: '+18888888888',
      },
      comments: {
        items: [
          { commentId: 4 },
          { commentId: 5 },
        ],
      },
    };
    jest.useFakeTimers();
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
    const wrapper = shallow(<Comment {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders delete button only when user\'s role is either owner or manager or comment is posted by logged-in user', () => {
    let wrapper = shallow(<Comment {...props} />);
    expect(wrapper.find('[data-target="button-delete"]').exists()).toBeTruthy();

    wrapper.setProps({ isCurrentUser: false });
    expect(wrapper.find('[data-target="button-delete"]').exists()).toBeFalsy();
    wrapper.unmount();

    state = {
      ...state,
      profile: {
        ...state.profile,
        data: {
          ...state.profile.data,
          isOwner: true,
          isManager: false,
          isWorker: false
        },
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    props.isCurrentUser = false;

    wrapper = shallow(<Comment {...props} />);
    expect(wrapper.find('[data-target="button-delete"]').exists()).toBeTruthy();
    wrapper.unmount();

    state = {
      ...state,
      profile: {
        ...state.profile,
        data: {
          ...state.profile.data,
          isOwner: false,
          isManager: true,
          isWorker: false
        },
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    props.isCurrentUser = false;

    wrapper = shallow(<Comment {...props} />);
    expect(wrapper.find('[data-target="button-delete"]').exists()).toBeTruthy();
  });

  it('shows different background color for user\'s own comments and other comments', () => {
    const wrapper = shallow(<Comment {...props} />);
    const container = wrapper.find('[data-target="comment"]');
    expect(container.hasClass('alert-primary')).toBeFalsy();
    expect(container.hasClass('alert-secondary')).toBeTruthy();
    
    wrapper.setProps({ isCurrentUser: false });
    const newContainer = wrapper.find('[data-target="comment"]');
    expect(newContainer.hasClass('alert-primary')).toBeTruthy();
    expect(newContainer.hasClass('alert-secondary')).toBeFalsy();
  });

  it('handleDeleteClick', async () => {
    const setShowDeleteModal = jest.fn();
    const deleteComment = jest.fn().mockResolvedValue({ commentIndex: 1 });
    const removeComment = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeleteModal]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(deleteComment);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(removeComment);
    
    const wrapper = shallow(<Comment {...props} />);
    
    const handleDeleteClick = wrapper.find('[data-target="button-delete"]').at(0).invoke('onClick');
    await handleDeleteClick();

    const handleCancel = wrapper.find('[data-target="delete-modal"]').at(0).invoke('onCancel');
    handleCancel();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
    
    const handleDelete = wrapper.find('[data-target="delete-modal"]').at(0).invoke('onConfirm');
    await handleDelete();
    expect(setShowDeleteModal).toHaveBeenCalledWith(true);

    expect(deleteComment).toHaveBeenCalled();
    await flushPromises();
    expect(removeComment).toHaveBeenCalledWith(1);
    await flushPromises();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
  });
});
