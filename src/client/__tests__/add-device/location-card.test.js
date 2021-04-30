import React from 'react';
import { shallow } from 'enzyme';

import LocationCard from '../../components/pages/add-device/location-card';

describe('LocationCard', () => {
  let props;

  beforeEach(() => {
    props = {
      location: {
        locationId: 1,
        locationType: 'School',
        locationName: 'My School',
        address: {
          addressLine1: '123 St',
          city: 'San Francisco',
          state: 'CA',
        },
      },
      onClick: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LocationCard {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
