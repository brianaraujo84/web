import React from 'react';
import { shallow } from 'enzyme';

import NewTemplateForm from '../../components/pages/new-template/form';

describe('NewTemplateForm', () => {
  let props;

  beforeEach(() => {
    props = {
      template: {
        templateId: '2321',
        templateName: 'thisod'
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<NewTemplateForm {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
