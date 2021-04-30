import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Hooks from '../../hooks';

import Content from '../../components/pages/location-details/content';

describe('LocationDetailsContent', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      locationUserRole: 'Owner',
      tab: 'tasks'
    };

    state = {
      locationZones: {
        items: [],
      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
      loc: {
        data: {
          locationId: 'someId',
          locationType: 'Office',
          locationDetails: 'some details',
          active: true,
          locationUserRole: 'Owner',
        },
      },
      managers: {
        items: [
          {
            contactType: 'Team Manager',
            contactTypeLabel: 'Team Manager',
            email: 'rptrainor@gmail.com',
            firstName: 'Ryan',
            lastName: 'Trainor',
            userName: 'rptrainor$gmail.com',
            contactId: '1'
          },
        ],
      },
      locationDetailsPreferences: {
        data: {}
      },
      tasksActions: {
        data: {}
      }
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.spyOn(ReactRouterDom, 'useParams').mockReturnValue({ locationId: 'someId' });
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

  it('renders inactive', () => {
    const s = { ...state, loc: { ...state.loc, data: { ...state.loc.data, active: false } } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders no manager', () => {
    const s = { ...state, managers: { items: [] } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="link-manager"]').length).toBe(0);
  });

  it('renders manager no firstname', () => {
    const setExpandLocationDetails = jest.fn();
    const s = { ...state, managers: { items: [{ ...state.managers.items[1] }] } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setExpandLocationDetails]);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="link-manager"]').length).toBe(0);
  });

  it('renders manager no firstname, lastname', () => {
    const setExpandLocationDetails = jest.fn();
    const s = { ...state, managers: { items: [{ ...state.managers.items[2] }] } };
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(s);
    });
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setExpandLocationDetails]);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
    expect(wrapper.find('[data-target="link-manager"]').length).toBe(0);
  });

  it('useEffect', () => {
    const getLocation = jest.fn(() => new Promise(() => {}).catch(() => {}));
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getLocation);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    shallow(<Content {...props} />);
    expect(getLocation).toHaveBeenCalled();
  });

  it('handleManagerClick', () => {
    const setExpandLocationDetails = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setExpandLocationDetails]);
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.find('[data-target="link-manager"]').length).toBe(0);
  });

  it('handleEditClick', () => {
    const setShowEdit = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowEdit]);
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const wrapper = shallow(<Content {...props} />);
    const handleShowEdit = wrapper.find('[data-target="link-edit-location"]').invoke('onClick');
    handleShowEdit(event);
    expect(setShowEdit).toHaveBeenCalled();
  });

  it('onClose', () => {
    const setShowEdit = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowEdit]);
    const wrapper = shallow(<Content {...props} />);
    const handleShowEdit = wrapper.find('LocationDetailsEditLocationModal').invoke('onClose');
    handleShowEdit();
    expect(setShowEdit).toHaveBeenCalledWith(false);
  });

  it('handleDelete', () => {
    const setShowEdit = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowEdit]);
    const wrapper = shallow(<Content {...props} />);
    const handleDelete = wrapper.find('LocationDetailsEditLocationModal').invoke('onDelete');
    handleDelete();
    expect(setShowEdit).toHaveBeenCalledWith(false);
  });

  it('setShowManagersModal', () => {
    const setShowManagersModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowManagersModal]);
    const wrapper = shallow(<Content {...props} />);
    const handleClose = wrapper.find('LocationManagersModal').invoke('onClose');
    handleClose();
    expect(setShowManagersModal).toHaveBeenCalledWith(false);
  });

  // it('handleEdit', () => {
  //   // const setShowEdit = jest.fn();
  //   // jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowEdit]);
  //   const wrapper = shallow(<Content {...props} />);
  //   const handleEdit = wrapper.find('LocationDetailsEditLocationModal').invoke('onUpdate');
  //   handleEdit();
  //   // expect(setShowEdit).toHaveBeenCalledWith(false);
  // });
});
