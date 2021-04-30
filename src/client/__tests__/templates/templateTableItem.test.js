import React from 'react';
import { shallow } from 'enzyme';

import TemplateTableItem from '../../components/pages/templates/templateTableItem';

describe('TemplateTableItem', () => {
  let props;

  beforeEach(() => {
    props = {
      template: {
        'templateId':85,
        'templateName':'COVID-19 standard template - Business',
        'templateDescription':'Process for cleaning and sanitizing all spaces specific to combat COVID-19. Surfaces to be covered include desktops, computers, phones, keyboards, light switches, common touch areas, computer mouse, monitors, drawers and drawer handles. Use a solution that is at least composed of 75% alcohol. ',
        'aboutDeveloper':'The Center of Disease Control (CDC) is a governing body that takes into consideration all of the disease type activities in the United States. They are the foremost experts in identifying diseases and how the public needs to prepare themselves.',
        'templateType':'Reference',
      }, 
      locationType: 'Airbnb',
    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<TemplateTableItem {...props} />);
    expect(wrapper.length).toBe(1);
  });
});

