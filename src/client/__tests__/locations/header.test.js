import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Header from '../../components/pages/locations/header';

describe('LocationsHeader', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {

    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
          subscription: {
            expiresOn: '2020-12-13',
          }
        },
      },
      locations: {
        items: [{
          address: {},
          locationId: 'id',
          locationType: 'Business',
          numberofTasks: 2,
        }],
      },
      headerContent: {
        data: {
          imageUrl: 'https://www.dropbox.com/home/application%20accounts/dev/header?preview=header_image1.png',
          message: 'The harder you work for something, the greater↵You’ll feel when you achieve it.'
        }
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
    const wrapper = shallow(<Header {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('Close free trial tooltip', () => {
    const setShowFreeTrial = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowFreeTrial]);
    jest.spyOn(React, 'useMemo').mockReturnValue(true);
    const wrapper = shallow(<Header {...props} />);
    const onClick = wrapper.find('[data-target="close-tooltip"]').invoke('onClick');
    onClick();
    expect(setShowFreeTrial).toHaveBeenCalledWith(false);
  });

  it('useEffect', () => {
    const setShowFreeTrial = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowFreeTrial]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    shallow(<Header {...props} />);
    expect(setShowFreeTrial).toHaveBeenCalled();
  });
});
