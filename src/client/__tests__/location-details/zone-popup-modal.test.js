import React from 'react';
import { shallow } from 'enzyme';

import ZonePopupModal from '../../components/pages/location-details/zone-popup-modal';

describe('ZonePopupModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onViewZones: jest.fn(),
      show: true,
      locationType: 'home',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ZonePopupModal {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
