import React from 'react';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';
import Hooks from '../../hooks';
import Verification from '../../components/pages/signup/verification';

describe('Verification', () => {
  let props;
  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn(),
      phone: '+155555555',
      username: '+155555555',
    };

    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Verification {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders with error', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<Verification {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleResend', async () => {
    const resendCode = jest.fn().mockRejectedValueOnce();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(resendCode);
    const wrapper = shallow(<Verification {...props} />);
    const handleResend = wrapper.find('[data-target="link-resend-code"]').invoke('onClick');

    handleResend();
    expect(resendCode).toHaveBeenCalledTimes(1);
  });
});
