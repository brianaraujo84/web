import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Footer from '../../components/pages/account/footer';
import Hooks from '../../hooks';

describe('AccountFooter', () => {
  let props, state;

  beforeEach(() => {
    props = {

    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstName: 'John',
          lastName: 'Doe',
          phone: '555555',
          img: 'someurl',
        },
      },
      geolocation: {},
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
    const wrapper = shallow(<Footer {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleLogout', () => {
    const doLogout = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(doLogout);
    const wrapper = shallow(<Footer {...props} />);
    wrapper.find('[data-target="logout-btn"]').simulate('click');
    expect(doLogout).toHaveBeenCalled();
  });
});
