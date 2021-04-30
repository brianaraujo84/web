import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Content from '../../components/pages/select-workspace/content';

describe('Content', () => {
  let props, state;

  beforeEach(() => {
    props = {
      onContinue: jest.fn(),
    };

    state = {
      deviceLocations: {
        items: [
          { locationId: 1 },
        ],
      },
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
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders correctly with selected location', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([{}, jest.fn()]);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
