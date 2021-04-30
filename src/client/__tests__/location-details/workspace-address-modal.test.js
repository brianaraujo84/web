import React from 'react';
import { shallow } from 'enzyme';

import WorkspaceAddressModal from '../../components/pages/location-details/workspace-address-modal';

describe('WorkspaceAddressModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      onShowEditLocationModal: jest.fn(),
      show: true,
      address: {
        addressLine1: 'Northwest 5th Street',
        city: 'Miami',
        state: 'FL',
        zip: '33101'
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<WorkspaceAddressModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleShowEditLocationModal', () => {
    const wrapper = shallow(<WorkspaceAddressModal {...props} />);
    const handleShowEditLocationModal = wrapper.find('[data-target="edit-icon"]').invoke('onClick');
    handleShowEditLocationModal();
    expect(props.onShowEditLocationModal).toHaveBeenCalled();
  });
});
