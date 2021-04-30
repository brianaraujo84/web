import React from 'react';
import { shallow } from 'enzyme';

import PlaceHolderTaskCard from '../../components/pages/location-details/placeHolderTaskCard';

describe('PlaceHolderTaskCard', () => {
  let props;

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      title: 'New Task',
    };

  });


  beforeEach(() => {

  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<PlaceHolderTaskCard {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
