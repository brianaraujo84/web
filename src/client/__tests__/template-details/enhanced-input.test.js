import React from 'react';
import { shallow } from 'enzyme';

import EnhancedInput from '../../components/pages/template-details/enhanced-input';

describe('EnhancedInput', () => {
  let props;

  beforeEach(() => {
    props = {
      name: 'templateName',
      formik: {
        values: {
          templateName: 'Test'
        },
        setFieldValue: jest.fn(),
      },
      onSave: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<EnhancedInput {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleSave', () => {
    const setIsEdit = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsEdit]);
    const wrapper = shallow(<EnhancedInput {...props} />);
    const handleSave = wrapper.find('[data-target="save-btn"]').invoke('onClick');
    handleSave();
    expect(setIsEdit).toHaveBeenCalledWith(false);
    expect(props.onSave).toHaveBeenCalled();
  });

  it('handleDiscard', () => {
    const setIsEdit = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setIsEdit]);
    const wrapper = shallow(<EnhancedInput {...props} />);
    const handleDiscard = wrapper.find('[data-target="discard-btn"]').invoke('onClick');
    handleDiscard();
    expect(setIsEdit).toHaveBeenCalledWith(false);
    expect(props.formik.setFieldValue).toHaveBeenCalled();
  });
});
