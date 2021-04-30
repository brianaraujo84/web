import React from 'react';
import { shallow } from 'enzyme';

import Content from '../../components/pages/new-template/content';

describe('NewTemplateContent', () => {
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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
