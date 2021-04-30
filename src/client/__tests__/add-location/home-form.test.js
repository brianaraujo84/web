import React from 'react';
import { shallow } from 'enzyme';
import ReactRedux from 'react-redux';
import ReactRouterDom from 'react-router-dom';
import ReactFormDynamic from 'react-form-dynamic';

import HomeForm from '../../components/pages/add-location/home-form';
import Hooks from '../../hooks';

const flushPromises = () => new Promise(setImmediate);

describe('HomeForm', () => {
  let props;
  let state;

  const history = {
    push: jest.fn(),
  };

  const place = {
    geometry: {
      location: {
        toJSON: jest.fn(),
      }
    }
  };

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      locationType: 'Business',
      resetLocationType: jest.fn(),

    };

    state = {
      profile: {
        loggedIn: true,
        data: {
          email: 'no@no.com',
          firstname: 'John',
          lastname: 'Doe',
        },
      },
      geolocation: {},
    };

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
    const wrapper = shallow(<HomeForm {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('renders locationData', () => {
    const p = { ...props, locationData: { locationId: 'someid' } };
    const wrapper = shallow(<HomeForm {...p} />);
    expect(wrapper.length).toBe(1);
  });

  // it('handleSubmit location data', async () => {
  //   const getForm = jest.spyOn(ReactFormDynamic, 'useForm');
  //   const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
  //   jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);

  //   jest.spyOn(React, 'useState').mockReturnValueOnce([{ zip: '90210' }, jest.fn()]);
  //   jest.spyOn(React, 'useState').mockReturnValueOnce(['somethng', jest.fn()]);
  //   const p = { ...props, locationData: { locationId: 'someid' } };
  //   shallow(<HomeForm {...p} />);
  //   const [{ onSubmit }] = getForm.mock.calls[0];
  //   await onSubmit();
  //   expect(history.push).not.toHaveBeenCalled();
  // });

  it('handleSubmit', async () => {
    const manageLocation = jest.fn().mockResolvedValue({ locationId: 'id' });
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ zip: '90210' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['somethng', jest.fn()]);
    shallow(<HomeForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({ zip: '90210' });
    await flushPromises();
    expect(history.push).toHaveBeenCalledWith({ 'data': { 'isFirstTime': true, locationType: 'Business' }, 'pathname': '/location/id/' });
  });

  it('handleSubmit failed', async () => {
    const manageLocation = jest.fn().mockRejectedValueOnce();
    jest.spyOn(Hooks, 'useActionDispatch').mockReturnValue(manageLocation);
    const getForm = jest.spyOn(ReactFormDynamic, 'useForm');

    jest.spyOn(React, 'useState').mockReturnValueOnce([{ zip: '90210' }, jest.fn()]);
    jest.spyOn(React, 'useState').mockReturnValueOnce(['somethng', jest.fn()]);
    shallow(<HomeForm {...props} />);
    const [{ onSubmit }] = getForm.mock.calls[0];
    onSubmit({});
    await flushPromises();
    expect(history.push).toHaveBeenCalledWith('/400');
  });

  it('handleSubmit invalid', () => {
    const wrapper = shallow(<HomeForm {...props} />);
    wrapper.find('Button').simulate('click');
    expect(wrapper.length).toBe(1);
    expect(history.push).not.toHaveBeenCalled();
  });

  it('handleAddressChange', () => {
    const wrapper = shallow(<HomeForm {...props} />);
    const handleAddressChange = wrapper.find('[data-target="autocomplete-address"]').invoke('onSelect');
    handleAddressChange('address', {}, {}, place);
    wrapper.find('Button').simulate('click');
    // expect(props.onSubmit).toHaveBeenCalled();
  });
});
