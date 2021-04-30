import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';

import Hooks from '../../hooks';

import LocationManagersModal from '../../components/pages/location-details/location-managers-modal';

describe('LocationManagersModal', () => {
  let props, state;

  const history = {
    push: jest.fn(),
  };


  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      show: true,
    };

    state = {
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
        },
      },
      managers: {
        items: [
          {
            firstName: 'John',
            lastName: 'Doe',
            userName: 'somename',
            contactId: '1',
            mobilePhone: '+18459603842'
          },
          {
            lastName: 'Doe',
            userName: 'somename',
            contactId: '2',
            mobilePhone: '+18434303842'
          },
          {
            userName: 'somename',
            contactId: '3',
            mobilePhone: '+18459634942'
          },
        ],
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LocationManagersModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('setShowAddModal', () => {
    const setShowAddModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAddModal]);
    const wrapper = shallow(<LocationManagersModal {...props} />);
    const handleClose = wrapper.find('AddManagerModal').invoke('onClose');
    const handleUpdate = wrapper.find('AddManagerModal').invoke('onUpdate');
    handleClose();
    expect(setShowAddModal).toHaveBeenCalledWith(false);
    setShowAddModal.mockRestore();
    handleUpdate();
    expect(setShowAddModal).toHaveBeenCalledWith(false);
  });

  it('handleAddClick', () => {
    const setShowAddModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAddModal]);
    const wrapper = shallow(<LocationManagersModal {...props} />);
    const handleAddClick = wrapper.find('[data-target="button-add"]').invoke('onClick');
    handleAddClick();
    expect(setShowAddModal).toHaveBeenCalledWith(true);
  });

  it('handlePlusTemplateClick', async () => {
    const action = jest.fn();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(action);
    const wrapper = shallow(<LocationManagersModal {...props} />);
    const handleRemove = wrapper.find('[data-target="remove-manager-btn"]').at(0).invoke('onClick');
    await handleRemove();
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('handlePlusTemplateClick failed', async () => {
    const action = jest.fn().mockRejectedValue();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(action);
    const wrapper = shallow(<LocationManagersModal {...props} />);
    const handleRemove = wrapper.find('[data-target="remove-manager-btn"]').at(0).invoke('onClick');
    await handleRemove();
    expect(action).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith('/400');
  });
});
