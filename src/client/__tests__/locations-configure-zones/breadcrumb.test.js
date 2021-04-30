import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Breadcrumb from '../../components/pages/locations-configure-zones/breadcrumb';

describe('Breadcrumb', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {

    };

    state = {
      loc: {
        data: {
          address: {
            addressLine1: '123 main street',
          }
        },
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Breadcrumb {...props} />);
    expect(wrapper.length).toBe(1);
  });
  it('renders no address', () => {
    state = {
      loc: {
        data: {
        },
      },
    };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    const wrapper = shallow(<Breadcrumb {...props} />);
    expect(wrapper.length).toBe(1);
  });
});
