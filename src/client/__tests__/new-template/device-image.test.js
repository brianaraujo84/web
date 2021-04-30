import React from 'react';
import { shallow } from 'enzyme';

import DeviceImage from '../../components/pages/new-template/device-image';

describe('DeviceImage', () => {
  let props;

  beforeEach(() => {
    props = {
      formik: {
        values: {
          smartDisplayCompliantImage: 'blob',
        },
        ref: {
          current: {
            click: jest.fn(),
          }
        },
      },
      field: {
        name: 'smartDisplayCompliantImage',
        label: 'Compliant',
      },
      onChange: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<DeviceImage {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleOpen', () => {
    const event = {
      preventDefault: jest.fn(),
    };
    const wrapper = shallow(<DeviceImage {...props} />);
    const handleOpen = wrapper.find('[data-target="edit-image"]').invoke('onClick');
    handleOpen(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.formik.ref.current.click).toHaveBeenCalled();
  });
});
