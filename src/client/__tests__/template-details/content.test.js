import React from 'react';
import { shallow } from 'enzyme';

import Content from '../../components/pages/template-details/content';

describe('NewTemplateContent', () => {
  let props;

  beforeEach(() => {
    props = {
      template: {},
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
