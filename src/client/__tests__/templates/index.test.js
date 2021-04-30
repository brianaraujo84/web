import React from 'react';
import { shallow } from 'enzyme';

import Templates from '../../components/pages/templates/index';
import Hooks from '../../hooks';

describe('Templates', () => {
  let props;

  beforeEach(() => {
    props = {
      locationType: 'School',
      formik: {
        values: {
          search_term: 'some value',
        },
        setFieldValue: jest.fn(),
      },
      classes: {
        inputPhone: {
          error: 'some class',
        },
        inputEmail: {
          error: 'another class',
        },
      },
      placeholder: 'pl',
      name: 'some name',
      phoneonly: false,
      showError: true,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Templates {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const setLocationType = jest.fn();
    const getTemplates = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce(['CDC', setLocationType]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getTemplates);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<Templates {...props} />);
  });

  it('setLocationType', () => {
    const setLocationType = jest.fn();
    const event = {
      target: { value: '' },
    };
    jest.spyOn(React, 'useState').mockReturnValueOnce(['Airbnb', setLocationType]);
    const wrapper = shallow(<Templates {...props} />);
    expect(wrapper.length).toBe(1);
    setLocationType(event);
    expect(setLocationType).toHaveBeenCalled();
  });
});
