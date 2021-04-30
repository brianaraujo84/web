import React from 'react';
import { shallow } from 'enzyme';

import TruncatedText from '../../../components/shared/truncated-text';

describe('TruncatedText', () => {
  let props;

  beforeEach(() => {
    props = {
      text: 'Lorem ipsum',
      length: 100,
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<TruncatedText {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('truncate', () => {
    const wrapper = shallow(<TruncatedText {...props} />);
    expect(wrapper.text()).toBe('Lorem ipsum');

    const p = { ...props, length: 3 };
    wrapper.setProps(p);
    expect(wrapper.text()).toBe('Lor...');
  });
});

