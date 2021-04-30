import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import MarketPlaceContent from '../../components/pages/marketplace/content';

describe('MarketPlaceContent', () => {
  let props, state;

  beforeEach(() => {
    props = {
      template: {},
      profile: {
        data: {
          isOwner: true,
        },
      },
    };

    state = {
      templates: {
        items: [
          {
            templateId: 688,
            templateName: 'San Mateo County Schools Monthly Cleaning Procedures for Functional Areas',
            templateShortDescription: null,
            templateDescription: 'School Monthly Cleaning Procedures.  This template is a cleaning guide for K-12 San Mateo schools to follow on a monthly basis for entrances, lobbies and corridors.',
            aboutDeveloper: 'San Mateo County Schools Insurance Group (SMCSIG) is a Joint Powers Authority (JPA) that is comprised of, and serves, all of the school districts in San Mateo County, as well as the San Mateo County Office of Education. SMCSIG provides school districts with the tools necessary to reduce the risk of injury to anyone who comes in contact with our schools. Our goal is to help schools provide a safe place to learn. In addition, SMCSIG provides training and offers programs to schools that are designe',
            templateType: 'Reference'
          },
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
      },
      profile: {
        data: {
          isOwner: true,
        },
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
    const wrapper = shallow(<MarketPlaceContent {...props} />);
    expect(wrapper.length).toBe(1);
  });

});
