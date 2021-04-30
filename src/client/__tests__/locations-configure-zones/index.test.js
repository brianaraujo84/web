import React from 'react';
import { shallow } from 'enzyme';

import LocationsConfigureZones from '../../components/pages/locations-configure-zones';

describe('LocationsConfigureZones', () => {
  let props;

  beforeEach(() => {
    props = {

    };
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LocationsConfigureZones {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
