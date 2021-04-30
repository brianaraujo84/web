import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import ProductDetails from '../../components/pages/product/product-details';
import Hooks from '../../hooks';

describe('ProductDetails', () => {
  let props, state;

  beforeEach(() => {
    props = {
      template: {
        templateName: 'Template Name',
      }
    };
    state = {
      newTemplate: {
        data: {}
      },
      locations: {
        items: [
          {
            active: true,
            address: {
              addressLine1: '2340 Clay Street',
              city: 'San Francisco',
              state: 'CA',
              zip: '94115',
            },
            locationDetails: '',
            locationId: 'HOMUMVXH',
            locationName: 'Dev\'s House',
            locationType: 'Home',
            numberofMyTasks: 17,
            numberofTasks: 30,
          }
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
    const wrapper = shallow(<ProductDetails {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('updateTemplateData', () => {
    const updateTemplateData = jest.fn().mockResolvedValueOnce({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(updateTemplateData);
    const wrapper = shallow(<ProductDetails {...props} />);
    const handleClickUse = wrapper.find('#use_template_btn').invoke('onClick');

    handleClickUse();

    expect(updateTemplateData).toHaveBeenCalled();
  });
});
