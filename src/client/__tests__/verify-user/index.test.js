import React from 'react';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';

import Hooks from '../../hooks';
import VerifyUser from '../../components/pages/verify-user';

describe('VerifyUser', () => {
  let props;

  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
    };

    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ userId: 'app@confidence.com', verifyCode: '679179' });
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    const wrapper = shallow(<VerifyUser {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('user verification with code success', () => {
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ userId: 'app@confidence.com', verifyCode: '679179' });
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const validateCode = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(validateCode);

    shallow(<VerifyUser {...props} />);
    expect(validateCode).toHaveBeenCalled();
  });

  it('user verification with code failed', () => {
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ userId: 'app@confidence.com', verifyCode: '679179' });
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());

    const validateCode = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(jest.fn().mockRejectedValueOnce({}));
    shallow(<VerifyUser {...props} />);
    expect(validateCode).not.toHaveBeenCalled();
  });
});
