import React from 'react';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';

import Comments from '../../components/pages/location-comments/comments';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('Comment', () => {
  let props, state;

  beforeEach(() => {
    props = {
      scrollToBottom: jest.fn(),
    };
    state = {
      comments: {
        items: [],
        total: 35,
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
    const wrapper = shallow(<Comments {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('fetches data of last 2 pages initially', () => {
    const getCommentsByLocId = jest.fn().mockResolvedValue({});
    
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'someId' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getCommentsByLocId);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    
    shallow(<Comments {...props} />);

    expect(getCommentsByLocId).toHaveBeenCalledWith(
      { start: 20, limit: 20 }, 'someId', {}, '', true, false, false, false,
    );
  });

  it('fetches comments every 5 seconds and updates in store', async () => {
    state = {
      comments: {
        items: new Array(15).fill().map((_, i) => ({ commentId: i + 20 + 1 })),
        total: 35,
      },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    const getCommentsByLocId = jest.fn().mockResolvedValue({
      comments: new Array(10).fill().map((_, i) => ({ commentId: i + 1 })),
      totalComments: 35,
    });
    const updateComments = jest.fn();
    
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'someId' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getCommentsByLocId);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(updateComments);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    
    shallow(<Comments {...props} />);

    jest.advanceTimersByTime(5000);
    expect(getCommentsByLocId).toHaveBeenCalledTimes(2);
    await flushPromises();
    expect(updateComments).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(5000);
    expect(getCommentsByLocId).toHaveBeenCalledTimes(4);
    await flushPromises();
    expect(updateComments).toHaveBeenCalledTimes(2);
  });

  it('scrolls to the bottom of the page when data is retrieved first time', () => {
    state = {
      comments: {
        items: new Array(15).fill().map((_, i) => ({ commentId: i + 20 + 1 })),
        total: 35,
      },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    shallow(<Comments {...props} />);

    expect(props.scrollToBottom).toHaveBeenCalled();
  });

  it('shows no comments message when there are no comments', () => {
    state = {
      comments: {
        items: [],
        total: 0,
      },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    const wrapper = shallow(<Comments {...props} />);

    expect(wrapper.find('[data-target="zero-discussion"]').exists()).toBeTruthy();
  });
});
