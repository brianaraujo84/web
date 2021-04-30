import React from 'react';
import { shallow } from 'enzyme';
import ReactFormDynamic from 'react-form-dynamic';

import ScheduleModal from '../../components/pages/location-details/schedule-modal';

describe('LocationDetailsScheduleModal', () => {
  let props;
  let formik;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      onUpdate: jest.fn(),
      show: true,
    };

    formik = {
      isValid: false,
      values: {},
      errors: {},
      setFieldValue: jest.fn(() => Promise.resolve({})),
      resetForm: jest.fn(),
      setSubmitting: jest.fn(),
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<ScheduleModal {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('handleDateChange', async () => {
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<ScheduleModal {...props} />);
    const handleChange = wrapper.find('[data-target="date-picker-date"]').invoke('onChange');
    handleChange(new Date());
    expect(formik.setFieldValue).toHaveBeenCalledTimes(1);
    expect(formik.setFieldValue.mock.calls[0][0]).toBe('date');
  });

  it('handleStartTimeChange', async () => {
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<ScheduleModal {...props} />);
    const handleChange = wrapper.find('[data-target="date-picker-start-time"]').invoke('onChange');
    handleChange({target: {value: '12:00:00'}});
    expect(formik.setFieldValue).toHaveBeenCalledTimes(1);
    expect(formik.setFieldValue.mock.calls[0][0]).toBe('startTime');
  });

  it('handleEndTimeChange', async () => {
    jest.spyOn(ReactFormDynamic, 'useForm').mockReturnValueOnce(formik);
    const wrapper = shallow(<ScheduleModal {...props} />);
    const handleChange = wrapper.find('[data-target="date-picker-end-time"]').invoke('onChange');
    handleChange({target: {value: '12:00:00'}});
    expect(formik.setFieldValue).toHaveBeenCalledTimes(1);
    expect(formik.setFieldValue.mock.calls[0][0]).toBe('endTime');
  });

  it('onSubmit', () => {
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
    shallow(<ScheduleModal {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({}, formik);
    expect(props.onUpdate).toHaveBeenCalled();

  });
});
