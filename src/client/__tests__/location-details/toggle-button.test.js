import React from 'react';
import { shallow } from 'enzyme';
import * as AccordionToggle from 'react-bootstrap/AccordionToggle';

import ToggleButton from '../../components/pages/location-details/toggle-button';

describe('ToggleButton', () => {
  let props;

  beforeEach(() => {
    props = {
      eventKey: '1',
      children: 'button',
      className: '',
      disabled: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly ToggleButton', () => {
    const wrapper = shallow(<ToggleButton {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleToggle', () => {
    const handleToggle = jest.fn();
    jest.spyOn(AccordionToggle, 'useAccordionToggle').mockReturnValueOnce(handleToggle);
    const wrapper = shallow(<ToggleButton {...props} />);
    const handleToggleFn = wrapper.find('[type="button"]').invoke('onClick');
    handleToggleFn();
    expect(handleToggle).toHaveBeenCalled();
  });
});
