import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Content from '../../components/pages/task-template/content';
import Hooks from '../../hooks';

describe('Content', () => {
  let props, state;

  beforeEach(() => {
    props = {
      template: {
        templateName: 'Template Name',
      }
    };
    state = {
      newTemplate: {
        data: {}
      }
    };

    global.scrollTo = jest.fn();

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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('updateTemplateData', () => {
    const updateTemplateData = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(updateTemplateData);
    const wrapper = shallow(<Content {...props} />);
    const handleClickUse = wrapper.find('#use_template_btn').invoke('onClick');

    handleClickUse();

    expect(updateTemplateData).toHaveBeenCalled();
  });
});
