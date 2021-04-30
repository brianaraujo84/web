import React from 'react';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';

import EditZoneModal from '../../components/pages/locations-configure-zones/edit-zone-modal';

describe('EditZoneModal', () => {
  let props;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onUpdate: jest.fn(),
      show: true,
      zone: {
        id: 1,
        label: 'label',
        tyoe: 'kitchen',
      },
      zoneTypes: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<EditZoneModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders correctly add', () => {
    const p = { ...props, zone: {} };
    const wrapper = shallow(<EditZoneModal {...p} />);
    expect(wrapper.length).toBe(1);
  });

  it('onSubmit', () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<EditZoneModal {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});
    expect(props.onUpdate).toHaveBeenCalled();
  });
});
