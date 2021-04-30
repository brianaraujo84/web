import React from 'react';
import ReactRouterDom from 'react-router-dom';
import ReactFormDynamic from 'react-form-dynamic';
import ReactRedux from 'react-redux';
import { shallow } from 'enzyme';

import Login from '../../components/pages/login';
import Hooks from '../../hooks';

describe('Login', () => {
  let props, state;
  let location;

  const history = {
    push: jest.fn(),
  };

  beforeAll(() => {
    const { location: loc } = window;
    location = loc;
    delete window.location;
    window.location = { replace: jest.fn() };
  });

  afterAll(() => {
    window.location = location;
  });

  beforeEach(() => {

    props = {

    };

    state = {
      profile: {
        loggedIn: false,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      }
    };


    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
    jest.spyOn(ReactRouterDom, 'useLocation').mockReturnValue({});
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
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('WelcomeModal').length).toBe(0);
  });

  it('renders with welcome', () => {
    jest.spyOn(ReactRouterDom, 'useLocation').mockReturnValue({ data: { welcome: true } });
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('WelcomeModal').length).toBe(1);
  });

  it('redirect', async () => {
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ redirect: '/dashboard' });
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Login {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(window.location.replace).toHaveBeenCalledWith('/dashboard');
    getForm.mockRestore();
  });

  it('redirect default', async () => {
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({});

    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Login {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(window.location.replace).toHaveBeenCalledWith('/');
    getForm.mockRestore();
  });


  it('submit phone', async () => {
    const doLogin = jest.fn();
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({});
    const formik = {
      validateForm: jest.fn(),
      isValid: false,
      values: {
        username: '123',
      },
    };
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(doLogin);

    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Login {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({
      countryCode: '+1',
      username: '123',
    });
    expect(doLogin).toHaveBeenCalled();
    expect(doLogin.mock.calls[0][0].username).toBe('123');
  });

  it('login failed', async () => {
    const doLogin = () => {
      throw new Error('Test');
    };
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(doLogin);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<Login {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    await onSubmit({});
    expect(history.push).not.toHaveBeenCalled();
  });

  it('not loggedin', async () => {
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper.find('form').length).toBe(1);
  });

  it('loggedin', () => {
    const s = {
      profile: {
        validateForm: jest.fn(),
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      }
    };
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ redirect: '/someurl' });
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Login {...props} />);
    expect(wrapper.find('form').length).toBe(1);
    expect(history.push).toHaveBeenCalledWith('/someurl');
  });

  it('isPhone', () => {
    const formik = {
      validateForm: jest.fn(),
      isValid: false,
      values: {
        username: '123',
      },
    };

    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);

    const wrapper = shallow(<Login {...props} />);
    expect(wrapper.find('[name="username"]').prop('prepend')).not.toBe(false);
  });
});
