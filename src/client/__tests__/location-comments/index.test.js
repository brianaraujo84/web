import React from 'react';
import { shallow } from 'enzyme';

import LocationComments from '../../components/pages/location-comments';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('Location Comments', () => {
  let props;

  beforeEach(() => {
    props = {};
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LocationComments {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', async () => {
    const setIsLoading = jest.fn();
    const getCommentsByLocId = jest.fn().mockResolvedValue({
      comments: new Array(10).fill().map((_, i) => ({ commentId: i + 1 })),
      totalCount: 41,
    });
    const updateComments = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsLoading]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getCommentsByLocId);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(updateComments);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    
    shallow(<LocationComments {...props} />);
    
    expect(getCommentsByLocId).toHaveBeenCalled();
    await flushPromises();
    expect(updateComments).toHaveBeenCalledWith([], 41);
    expect(setIsLoading).toHaveBeenCalledWith(false);
  });
});
