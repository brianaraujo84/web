import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Locations from '../../components/pages/locations';

describe('Locations', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      profile: {
        isOwner: true,
      }
    };

    state = {
      profile: {
        isOwner: true,
      },
      locations: {
        items: []
      }
    };
    
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Locations {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
