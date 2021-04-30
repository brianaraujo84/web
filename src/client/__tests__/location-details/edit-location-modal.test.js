import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import Hooks from '../../hooks';

import EditLocationModal from '../../components/pages/location-details/edit-location-modal';

describe('EditLocationModal', () => {
  let props, state;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onUpdate: jest.fn(),
      onDelete: jest.fn(),
      show: true,
      locationType: 'Home',
      locationData: { locationId: '123' },
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
    const wrapper = shallow(<EditLocationModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('onClose', () => {
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const wrapper = shallow(<EditLocationModal {...props} />);
    const handleCancel = wrapper.find('ConfirmDeleteModal').invoke('onCancel');
    handleCancel();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
  });

  it('handleDelete', () => {
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const manageLocation = jest.fn().mockReturnValue({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getLocations = jest.fn().mockReturnValue({});
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(getLocations);
    const wrapper = shallow(<EditLocationModal {...props} />);
    const handleDelete = wrapper.find('ConfirmDeleteModal').invoke('onConfirm');
    handleDelete();
    expect(getLocations).toHaveBeenCalled();
  });

  it('handleDelete', () => {
    const setShowDeleteModal = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowDeleteModal]);
    const wrapper = shallow(<EditLocationModal {...props} />);
    const handleDeleteClick = wrapper.find('[data-target="button-delete"]').invoke('onClick');
    handleDeleteClick();
    expect(setShowDeleteModal).toHaveBeenCalledWith(true);
  });
});
