import React from 'react';
import { shallow } from 'enzyme';

import Form from '../../components/pages/template-details/form';

describe('TemplateDetailsForm', () => {
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
    const wrapper = shallow(<Form {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
