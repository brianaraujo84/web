import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';

import AssociateZoneModal from '../../components/pages/location-details/associate-zone-modal';

describe('LocationDetailsAssociateZoneModal', () => {
  let props;
  let state;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onAssociate: jest.fn(),
      show: true,
    };

    state = {
      locationZones: {
        items: [
          {
            id: 1,
            type: 'Kitchen',
            sequenceOrder: 1,
          },
          {
            id: 2,
            type: 'Office',
            label: 'Entry',
            sequenceOrder: 2,
          },
        ],
      },
    };

    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([-1, jest.fn()]);
    const wrapper = shallow(<AssociateZoneModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleSelectZone', () => {
    const setSelectedZoneId = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce([-1, setSelectedZoneId]);
    const wrapper = shallow(<AssociateZoneModal {...props} />);
    const handleSelectZone = wrapper.find('.list-group-item').at(0).invoke('onClick');

    handleSelectZone();
    expect(setSelectedZoneId).toHaveBeenCalled();
  });

  it('handleAssociate', () => {
    const wrapper = shallow(<AssociateZoneModal {...props} />);
    const handleAssociate = wrapper.find('[type="submit"]').invoke('onClick');

    handleAssociate();
    expect(props.onAssociate).toHaveBeenCalled();
  });
});
