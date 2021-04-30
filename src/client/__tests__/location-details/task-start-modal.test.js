import React from 'react';
import { shallow } from 'enzyme';
import * as StorageUtils from '../../utils/storage-utils';

import TaskStartModal from '../../components/pages/location-details/task-start-modal';

describe('TaskStartModal', () => {
  let props;

  beforeEach(() => {
    props = {
      show: true,
      onClose: jest.fn(),
      onConfirm: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('handleChange', () => {
    const event = {
      target: { checked: true },
    };
    const setShowAgain = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShowAgain]);
    const wrapper = shallow(<TaskStartModal {...props} />);
    const handleChange = wrapper.find('[type="checkbox"]').at(0).invoke('onChange');
    handleChange(event);
    expect(setShowAgain).toHaveBeenCalled();
  });

  it('handleClick with setItem', () => {
    const setItem = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    jest.spyOn(StorageUtils, 'setItem').mockImplementation(setItem);
    const wrapper = shallow(<TaskStartModal {...props} />);
    const handleClick = wrapper.find('Button').invoke('onClick');
    handleClick();
    expect(setItem).toHaveBeenCalled();
    expect(props.onConfirm).toHaveBeenCalled();
  });

  it('handleClick without setItem', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<TaskStartModal {...props} />);
    const handleClick = wrapper.find('Button').invoke('onClick');
    handleClick();
    expect(props.onConfirm).toHaveBeenCalled();
  });
});
