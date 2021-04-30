import React from 'react';
import ReactRouterDom from 'react-router-dom';
import { shallow } from 'enzyme';

import Content from '../../components/pages/signup/content';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

const STATE_LANGUAGE = 1;
const STATE_FORM = 2;
const STATE_VERIFICATION = 3;

describe('Content', () => {
  let props;
  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    props = {};
    
    jest.useFakeTimers();
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('LanguageSelection').length).toBe(1);
    expect(wrapper.find('SignupForm').length).toBe(0);
    expect(wrapper.find('Verification').length).toBe(0);
  });

  it('handleSubmitForm', async () => {
    const setState = jest.fn();
    const setError = jest.fn();
    const setData = jest.fn();
    const manageUser = jest.fn().mockResolvedValue({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([STATE_FORM, setState]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setError]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setData]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageUser);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.find('SignupForm').length).toBe(1);
    expect(wrapper.find('Verification').length).toBe(0);
    const handleSubmitForm = wrapper.find('SignupForm').invoke('handleSubmit');
    handleSubmitForm({
      phone: '+15555555555'
    }, '');
    expect(setData).toHaveBeenCalled();
    expect(setError).toHaveBeenCalled();
    expect(manageUser).toHaveBeenCalled();
    await flushPromises();
    expect(setState).toHaveBeenCalledWith(STATE_VERIFICATION);
  });

  it('handleSubmitDialogue failed', async () => {
    const setState = jest.fn();
    const setError = jest.fn();
    const setData = jest.fn();
    const manageUser = jest.fn().mockRejectedValueOnce();
    window.scrollTo = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([STATE_FORM, setState]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([null, setError]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, setData]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageUser);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.find('SignupForm').length).toBe(1);
    expect(wrapper.find('Verification').length).toBe(0);
    const handleSubmitForm = wrapper.find('SignupForm').invoke('handleSubmit');
    handleSubmitForm({
      phone: '+15555555555'
    }, '');
    expect(setData).toHaveBeenCalled();
    expect(setError).toHaveBeenCalled();
    expect(manageUser).toHaveBeenCalled();
    await flushPromises();
    expect(window.scrollTo).toHaveBeenCalled();
    expect(setError).toHaveBeenCalled();
  });

  it('SignupForm', async () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([STATE_FORM, jest.fn()]);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.find('SignupForm').length).toBe(1);
    expect(wrapper.find('SignupFormWorker').length).toBe(0);
  });

  it('SignupForm manager', async () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([STATE_FORM, jest.fn()]);
    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ type: 'manager' });
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.find('SignupForm').length).toBe(1);
    expect(wrapper.find('SignupFormWorker').length).toBe(0);
  });
  
  it('handleSelectLanguage', () => {
    const setLanguage = jest.fn();
    const setState = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([STATE_LANGUAGE, setState]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['', jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['en-US', setLanguage]);
    const wrapper = shallow(<Content {...props} />);
    const onContinue = wrapper.find('LanguageSelection').invoke('onContinue');
    onContinue('en-US');
    expect(setLanguage).toHaveBeenCalledWith('en-US');
    expect(setState).toHaveBeenCalledWith(STATE_FORM);
  });
});
