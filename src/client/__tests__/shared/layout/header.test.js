import React from 'react';
import ReactRouterDom from 'react-router-dom';
import ReactRedux from 'react-redux';
import { shallow } from 'enzyme';

import Header from '../../../components/shared/layout/header';
import Hooks from '../../../hooks';
import URLS from '../../../urls';

describe('Header', () => {
  let props;
  let state;
  const history = {
    push: jest.fn(),
    location: {
      pathname: '/',
    },
  };

  beforeEach(() => {
    props = {};
    state = {
      groupMenuUpdate: { 
        data: { update: false }
      },
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
      isSubMenuExpanded: {
        data: {}
      },
      deviceLocations: {
        items: [
          { locationId: 1 },
        ],
      },
      locationType: {
        data: {
          locationType: 'School'
        }
      },
      loc: {
        data: {
          address: {
            addressLine1: '123 main street',
          },
        },
      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
    };
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('current locations', () => {
    const h = {
      ...history,
      location: {
        ...history.location,
        pathname: '/locations',
      },
    };
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(h);
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('[data-target="menu-li-locations"]').hasClass('active')).toBe(true);
  });

  it('current unknown', () => {
    const h = {
      ...history,
      location: {
        ...history.location,
        pathname: '/someurl',
      },
    };
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(h);
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('[data-target="menu-li-locations"]').hasClass('active')).toBe(false);
  });

  it('handleLogout', () => {
    const doLogout = jest.fn();

    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(doLogout);
    const wrapper = shallow(<Header {...props} />);
    wrapper.find('[data-target="menu-link-logout"]').simulate('click');
    expect(doLogout).toHaveBeenCalled();
  });

  it('setSideOpen', () => {
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('[data-target="navbar"]').hasClass('sidenav-open')).toBe(false);
    wrapper.find('[data-target="navbar-toggler"]').simulate('click');
    expect(wrapper.find('[data-target="navbar"]').hasClass('sidenav-open')).toBe(true);
    wrapper.find('[data-target="overlay"]').simulate('click');
    expect(wrapper.find('[data-target="navbar"]').hasClass('sidenav-open')).toBe(false);
  });

  it('setSideOpen', () => {
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue({ ...history, location: { pathname: '/location/configure/zones/someid' } });
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.find('[data-target="navbar"]').hasClass('sidenav-open')).toBe(false);
    wrapper.find('[data-target="navbar-toggler"]').simulate('click');
  });

  it('handleProfileClick', () => {
    const wrapper = shallow(<Header {...props} />);
    const handleProfileClick = wrapper.find('[data-target="profile-img"]').invoke('onClick');
    handleProfileClick();
    expect(history.push).toHaveBeenCalledWith(URLS.ACCOUNT);
  });
});

