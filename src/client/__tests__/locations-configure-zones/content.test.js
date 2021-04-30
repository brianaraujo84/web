import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactFormDynamic from 'react-form-dynamic';
import ReactRouterDom from 'react-router-dom';
import ReactSortableHoc from 'react-sortable-hoc';

import Content from '../../components/pages/locations-configure-zones/content';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('LocationsConfigureZonesContent', () => {
  let props;
  let state;
  let formik;

  const history = {
    push: jest.fn(),
  };


  beforeEach(() => {
    props = {
    };
    state = {
      zoneTypes: {
        items: [
          {
            zoneTypeId: 1,
            zoneType: 'Living Room',
          }
        ],
      },
      locationZones: {
        items: [
          {
            id: 2,
            type: 'Kitchen',
            sequenceOrder: 2,
          },
          {
            id: 1,
            type: 'Garage',
            label: 'Something',
            sequenceOrder: 1,
          },
        ],
      },
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
    };

    formik = {
      isValid: false,
      values: {},
      setFieldValue: jest.fn(),
    };

    jest.useFakeTimers();
    jest.spyOn(ReactRedux, 'useSelector').mockImplementation((callback) => {
      return callback(state);
    });
    jest.spyOn(ReactRouterDom, 'useHistory').mockReturnValue(history);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Content {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValue(formik);
    const setZones = jest.fn();
    const action = jest.fn(() => Promise.resolve({}));
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(action);
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setZones]);
    shallow(<Content {...props} />);
    expect(setZones).toHaveBeenCalledWith([
      {
        id: 1,
        type: 'Garage',
        label: 'Something',
        sequenceOrder: 1,
      },
      {
        id: 2,
        type: 'Kitchen',
        sequenceOrder: 2,
      },
    ]);
  });

  it('onSortEnd', () => {
    const setZones = jest.fn();
    const zones = [1, 2];
    jest.spyOn(React, 'useState').mockReturnValueOnce([zones, setZones]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    const wrapper = shallow(<Content {...props} />);
    const SortableList = wrapper.find('[data-target="sortable-list"]');
    expect(SortableList.length).toBe(1);
    const onSortEnd = SortableList.invoke('onSortEnd');
    onSortEnd({ oldIndex: 0, newIndex: 1 });
    expect(setZones).toHaveBeenCalledWith([2, 1]);
  });

  it('SortableContainer', async () => {
    jest.spyOn(ReactSortableHoc, 'SortableContainer').mockReturnValue('<div></div>');
    shallow(<Content {...props} />);
    const El = ReactSortableHoc.SortableContainer.mock.calls[0][0];
    const p = {
      items: [
        {
          id: 1,
          type: 'Garage',
          label: 'Something',
          sequenceOrder: 1,
        },
      ],
    };
    const sortWrapper = shallow(<El {...p} />);
    expect(sortWrapper.length).toBe(1);
  });

  it('handleRemove', async () => {
    const setZones = jest.fn();
    const setZonesToDelete = jest.fn();
    const zones = [
      {
        id: 1,
        type: 'Garage',
        label: 'Something',
        sequenceOrder: 1,
      },
      {
        id: 1,
        type: 'Garage',
        label: 'Something',
        sequenceOrder: 1,
        new: true,
      }
    ];
    jest.spyOn(ReactSortableHoc, 'SortableContainer').mockReturnValue('<div></div>');
    jest.spyOn(React, 'useState').mockReturnValueOnce([zones, setZones]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setZonesToDelete]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    shallow(<Content {...props} />);
    const El = ReactSortableHoc.SortableContainer.mock.calls[0][0];
    const p = {
      items: [...zones],
    };
    const sortWrapper = shallow(<El {...p} />);
    const handleRemove = sortWrapper.find('LocationsConfigureZonesZone').at(0).invoke('onRemove');
    const handleRemove2 = sortWrapper.find('LocationsConfigureZonesZone').at(1).invoke('onRemove');
    handleRemove();
    expect(setZonesToDelete).toHaveBeenCalled();
    const setZonesToDeleteCB = setZonesToDelete.mock.calls[0][0];
    expect(setZonesToDeleteCB([])).toEqual([{ id: 1, type: 'Garage', action: 'delete' }]);
    expect(setZones).toHaveBeenCalled();

    handleRemove2();
    const setZonesCB = setZones.mock.calls[1][0];
    expect(setZonesCB([])).toEqual([]);
  });

  it('handleUpdate', async () => {
    const setZones = jest.fn();
    const setZonesToDelete = jest.fn();
    const zones = [
      {
        id: 1,
        type: 'Kitchen',
        label: 'Something',
        sequenceOrder: 2,
      },
      {
        id: 2,
        type: 'Garage',
        label: 'Something',
        sequenceOrder: 1,
        new: true,
      }
    ];
    jest.spyOn(ReactSortableHoc, 'SortableContainer').mockReturnValue('<div></div>');
    jest.spyOn(React, 'useState').mockReturnValueOnce([zones, setZones]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setZonesToDelete]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    shallow(<Content {...props} />);
    const El = ReactSortableHoc.SortableContainer.mock.calls[0][0];
    const p = {
      items: [...zones],
    };
    const sortWrapper = shallow(<El {...p} />);
    const handleUpdate = sortWrapper.find('LocationsConfigureZonesZone').at(0).invoke('onUpdate');
    handleUpdate({ ...zones[0], label: 'New label' });
    expect(setZonesToDelete).toHaveBeenCalled();
    expect(setZones).toHaveBeenCalled();
    const setZonesCB = setZones.mock.calls[0][0];
    const newZones = setZonesCB(zones);
    expect(newZones.length).toBe(2);
    expect(newZones[0].label).toBe('New label');
  });

  it('SortableElement', async () => {
    jest.spyOn(ReactSortableHoc, 'SortableElement').mockReturnValue([]);
    shallow(<Content {...props} />);
    const sortEl = ReactSortableHoc.SortableElement.mock.calls[0][0];
    expect(sortEl({ children: 'something' })).toBe('something');
  });

  it('handleSave', async () => {
    const updateLocationZones = jest.fn().mockResolvedValue({});
    const getLocationZones = jest.fn().mockResolvedValue({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['save', jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getLocationZones);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(updateLocationZones);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    shallow(<Content {...props} />);
    expect(updateLocationZones).toHaveBeenCalled();
    await flushPromises();
    expect(getLocationZones).toHaveBeenCalled();
  });

  it('handleSave with error', async () => {
    const updateLocationZones = jest.fn().mockRejectedValue(new Error('error'));
    const getLocationZones = jest.fn().mockResolvedValue({});

    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['save', jest.fn()]);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(getLocationZones);
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValueOnce(updateLocationZones);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());

    shallow(<Content {...props} />);
    expect(updateLocationZones).toHaveBeenCalled();
    await flushPromises();
    expect(history.push).toHaveBeenCalled();
  });

  it('handleAdd', async () => {
    const setZones = jest.fn();
    const setShouldTaskAdd = jest.fn();
    const setAddModal = jest.fn();
    const setScheduleUpdate = jest.fn();

    jest.spyOn(React, 'useState').mockReturnValueOnce([[], setZones]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setScheduleUpdate]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, setAddModal]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, setShouldTaskAdd]);
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    const wrapper = shallow(<Content {...props} />);
    const handleAdd = wrapper.find('LocationDetailsEditZoneModal').invoke('onUpdate');
    handleAdd({ type: 'type', label: 'label' });
    expect(setZones).toHaveBeenCalled();
    expect(setShouldTaskAdd).toHaveBeenCalledWith(false);
    expect(setAddModal).toHaveBeenCalledWith(false);
    expect(setScheduleUpdate).toHaveBeenCalled();
  });

  it('handleGoToLocationDetails', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, jest.fn()]);
    const wrapper = shallow(<Content {...props} />);
    const handleGoToLocationDetails = wrapper.find('[data-target="save-btn"]').invoke('onClick');
    handleGoToLocationDetails();
    expect(history.push).toHaveBeenCalled();
  });
});
