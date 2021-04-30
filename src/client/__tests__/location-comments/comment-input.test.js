import React from 'react';
import ReactRedux from 'react-redux';
import ReactFormDynamic from 'react-form-dynamic';
import { shallow } from 'enzyme';

import CommentInput from '../../components/pages/location-comments/comment-input';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('Comment', () => {
  let props, state, formik;

  beforeEach(() => {
    props = {
      scrollToBottom: jest.fn(),
    };

    state = {
      profile: {
        data: {
          email: 'no@no.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
      comments: {
        items: [{ commentId: 1 }],
        total: 1,
      },
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
      handleReset: jest.fn(),
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
    const wrapper = shallow(<CommentInput {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleCommentChange', () => {
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<CommentInput {...props} />);
    const newComment = 'new comment';
    const event = { target: { value: newComment }};
    const commentInput = wrapper.find('[data-target="comment-input"]').invoke('onChange');
    commentInput(event);
    expect(formik.setFieldValue).toHaveBeenCalled();
  });

  it('onSubmit', async () => {
    const newComment = 'new comment';
    formik.values.comment = newComment;

    const postComment = jest.fn().mockResolvedValueOnce({ commentId: 2 });
    const addComment = jest.fn();
    
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(postComment);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(addComment);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    shallow(<CommentInput {...props} />);

    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(postComment).toHaveBeenCalled();
    await flushPromises();
    expect(addComment).toHaveBeenCalledWith(1, {
      commentId: 2,
      comment: newComment,
      user: `${state.profile.data.firstName} ${state.profile.data.lastName}`,
      userName: state.profile.data.email.replace('@', '$'),
      currentUser: true,
    });
    await flushPromises();
    getForm.mockRestore();
  });
});
