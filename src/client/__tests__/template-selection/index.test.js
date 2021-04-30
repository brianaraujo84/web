import React from 'react';
import { shallow } from 'enzyme';

import TemplateSelection from '../../components/pages/template-selection';

describe('TemplateSelection', () => {
  let props;

  beforeEach(() => {
    props = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<TemplateSelection {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
