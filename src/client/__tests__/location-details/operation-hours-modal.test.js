import React from 'react';
import { shallow } from 'enzyme';

import OperationHoursModal from '../../components/pages/location-details/operation-hours-modal';
import { INITIAL_HOURS_OF_OPERATION } from '../../constants/location-hours';

describe('OperationHoursModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onCancel: jest.fn(),
      show: true,
      locationId: 'OFFH8J3I',
      hoursofOperation: INITIAL_HOURS_OF_OPERATION,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<OperationHoursModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('onClose', () => {
    const wrapper = shallow(<OperationHoursModal {...props} />);
    const handleClose = wrapper.find('[data-target="button-close"]').invoke('onClick');
    handleClose();
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('handleSubmit', async () => {

    const wrapper = shallow(<OperationHoursModal {...props} />);
    const handleSubmit = wrapper.find('[data-target="button-update"]').invoke('onClick');
    handleSubmit();
  });
});
