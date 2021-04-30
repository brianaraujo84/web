import React from 'react';
import { shallow } from 'enzyme';

import Zone from '../../components/pages/locations-configure-zones/zone';

describe('Zone', () => {
  let props;

  beforeEach(() => {
    props = {
      zone: {
        type: 'kitchen',
        id: 1,
        label: 'label',
      },
      index: 1,
      onRemove: jest.fn(),
      onUpdate: jest.fn(),
      DragHandle: jest.fn(),
      zoneTypes: [],
      zonesCount: 2,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Zone {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('DragHandle', () => {
    const wrapper = shallow(<Zone {...props} />);
    const DragHandle = wrapper.find('[data-target="drag-handle"]');
    expect(DragHandle.length).toBe(1);
    expect(DragHandle.html()).toBe('<img data-target="drag-handle" src="/assets/img/drag-handle.png" class="handle mr-3" width="17"/>');
  });

  it('handleEditLabelClick', () => {
    const event = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    };
    const wrapper = shallow(<Zone {...props} />);
    const handleEditLabelClick = wrapper.find('[data-target="edit-label-link"]').invoke('onClick');
    handleEditLabelClick(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('handleLabelSave', () => {
    const { onUpdate } = props;
    const values = { label: 'label', type: 'type' };
    
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<Zone {...props} />);
    const handleLabelSave = wrapper.find('LocationDetailsEditZoneModal').invoke('handleLabelSave');
    handleLabelSave(values);
    expect(onUpdate).toHaveBeenCalled();
  });

  it('onZoneSave', () => {
    const setEdit = jest.fn();
    const values = { label: 'label', type: 'type' };
    
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setEdit]);
    const wrapper = shallow(<Zone {...props} />);
    const onZoneSave = wrapper.find('LocationDetailsEditZoneModal').invoke('onUpdate');
    onZoneSave(values);
    expect(setEdit).toHaveBeenCalledWith(false);
  });

  it('onCancel ConfirmDeleteModal', () => {
    const setShowDeleteModal = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setShowDeleteModal]);
    const wrapper = shallow(<Zone {...props} />);
    const onCancel = wrapper.find('ConfirmDeleteModal').invoke('onCancel');
    onCancel();
    expect(setShowDeleteModal).toHaveBeenCalledWith(false);
  });
});
