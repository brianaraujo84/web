import React from 'react';
import { shallow } from 'enzyme';

import RequireImageVerificationModal from '../../components/pages/location-details/require-image-verification-modal';

describe('RequireImageVerificationModal', () => {
  let props;

  beforeEach(() => {
    props = {
      show: true,
      onClose: jest.fn(),
      onSelectItem: jest.fn(),
      selectedItem: 0,
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<RequireImageVerificationModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('onSelectItem', () => {
    const wrapper = shallow(<RequireImageVerificationModal {...props} />);
    const clickListItem = wrapper.find('[data-target="list"]').invoke('onSelect');
    clickListItem(1);
    expect(props.onSelectItem).toHaveBeenCalled();
  });
});
