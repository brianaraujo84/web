import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import TemplateDetails from '../../components/pages/template-details';

describe('TemplateDetails', () => {
  let props, state;

  beforeEach(() => {
    props = {
    };

    state = {
      templates: {
        items: [],
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
    jest.spyOn(React, 'useMemo').mockReturnValueOnce({});
    const wrapper = shallow(<TemplateDetails {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
