import React from 'react';
import { shallow } from 'enzyme';

import LanguageSelection from '../../components/pages/signup/language-selection';

describe('LanguageSelection', () => {
  let props;

  beforeEach(() => {
    props = {
      onContinue: jest.fn(),
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LanguageSelection {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleSelect', () => {
    const setLanguage = jest.fn();
    
    jest.spyOn(React, 'useState').mockReturnValueOnce(['en-US', setLanguage]);
    const wrapper = shallow(<LanguageSelection {...props} />);
    const onClick = wrapper.find('[data-target="language-selection"]').at(0).invoke('onClick');
    onClick('en-US');
    expect(setLanguage).toHaveBeenCalled();
  });
});
