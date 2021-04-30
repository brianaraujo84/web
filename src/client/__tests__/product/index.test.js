import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Product from '../../components/pages/product';

describe('Product', () => {
  let props, state;

  beforeEach(() => {
    props = {};

    state = {
      templates: {
        items: [
          {
            aboutDeveloper: 'About Developer',
            templateDescription: 'Template Description',
            templateId: 85,
            templateName: 'Template Name',
            templateType: 'Reference',
          }
        ],
      },
      myTemplates: {
        items: [
          {
            aboutDeveloper: 'My About Developer',
            templateDescription: 'My Template Description',
            templateId: 86,
            templateName: 'My Template Name',
            templateType: 'My Reference',
          }
        ],
      }
    };

    global.scrollTo = jest.fn();

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
    const wrapper = shallow(<Product {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect with empty dep', () => {
    let cleanupFunc;

    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => cleanupFunc = f());
    shallow(<Product {...props} />);
    cleanupFunc();
  });
});
