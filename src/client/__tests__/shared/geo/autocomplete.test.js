import React from 'react';
import { shallow } from 'enzyme';

import Autocomplete from '../../../components/shared/geo/autocomplete';
import Utils from '../../../utils';

const flushPromises = () => new Promise(setImmediate);

describe('GeoAutocomplete', () => {
  let props;

  beforeEach(() => {
    props = {
      initialValue: '',
      onSelect: jest.fn(),
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = shallow(<Autocomplete {...props} />);
    expect(wrapper.length).toBe(1);
  });

  it('useEffect', () => {
    const setCompany = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementationOnce(f => f());
    jest.spyOn(React, 'useState').mockReturnValueOnce(['company', setCompany]);
    shallow(<Autocomplete {...props} />);
    expect(setCompany).toHaveBeenCalled();
  });

  it('handleChange', () => {
    const wrapper = shallow(<Autocomplete {...props} />);
    const handleChange = wrapper.find('GooglePlacesAutocomplete').invoke('handleChange');
    handleChange('some value');
    expect(props.onSelect).toHaveBeenCalledWith('', '', {});
  });

  it('handleChange selectOnly', () => {
    const wrapper = shallow(<Autocomplete {...{ ...props, selectOnly: false }} />);
    const handleChange = wrapper.find('GooglePlacesAutocomplete').invoke('handleChange');
    handleChange('some value');
    expect(props.onSelect).toHaveBeenCalledWith('some value', '', {});
  });

  it('handleSelect', () => {
    const setCompany = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['company', setCompany]);
    jest.spyOn(Utils, 'geocodeByPlaceId').mockRejectedValueOnce();
    jest.spyOn(global.console, 'error').mockImplementationOnce(jest.fn());
    const p = {
      structured_formatting: {
        main_text: 'something',
      },
      description: 'desc',
      place_id: 'someid',
    };
    const wrapper = shallow(<Autocomplete {...props} />);
    const handleSelect = wrapper.find('GooglePlacesAutocomplete').invoke('onSelect');
    handleSelect(p);
    expect(setCompany).toHaveBeenCalled();
  });

  it('handleSelect isAddress', async () => {
    const setCompany = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['company', setCompany]);
    const result = {
      address_components: [
        {
          long_name: '4470',
          short_name: '4470',
          types: [
            'street_number'
          ]
        },
        {
          long_name: 'El Camino Real',
          short_name: 'El Camino Real',
          types: [
            'route'
          ]
        },
        {
          long_name: 'North Los Altos',
          short_name: 'North Los Altos',
          types: [
            'neighborhood',
            'political'
          ]
        },
        {
          long_name: 'Los Altos',
          short_name: 'Los Altos',
          types: [
            'locality',
            'political'
          ]
        },
        {
          long_name: 'Santa Clara County',
          short_name: 'Santa Clara County',
          types: [
            'administrative_area_level_2',
            'political'
          ]
        },
        {
          long_name: 'California',
          short_name: 'CA',
          types: [
            'administrative_area_level_1',
            'political'
          ]
        },
        {
          long_name: 'United States',
          short_name: 'US',
          types: [
            'country',
            'political'
          ]
        },
        {
          long_name: '94022',
          short_name: '94022',
          types: [
            'postal_code'
          ]
        },
        {
          long_name: '1003',
          short_name: '1003',
          types: [
            'postal_code_suffix'
          ]
        }
      ],
    };
    jest.spyOn(Utils, 'geocodeByPlaceId').mockResolvedValueOnce([result]);
    const pl = {
      structured_formatting: {
        main_text: 'something',
      },
      description: 'desc',
      place_id: 'someid',
    };
    const p = { ...props, isAddress: true };
    const wrapper = shallow(<Autocomplete {...p} />);
    const handleSelect = wrapper.find('GooglePlacesAutocomplete').invoke('onSelect');
    handleSelect(pl);
    await flushPromises();
    expect(setCompany).toHaveBeenCalled();
    expect(p.onSelect).toHaveBeenCalled();
  });

  it('handleSelect empty street number', async () => {
    const setCompany = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['company', setCompany]);
    const result = {
      address_components: [
        {
          long_name: 'Main str',
          short_name: 'Main str',
          types: [
            'route'
          ]
        },
        {
          long_name: 'Los Altos',
          short_name: 'Los Altos',
          types: [
            'locality',
            'political'
          ]
        },
        {
          long_name: 'California',
          short_name: 'CA',
          types: [
            'administrative_area_level_1',
            'political'
          ]
        },
        {
          long_name: 'United States',
          short_name: 'US',
          types: [
            'country',
            'political'
          ]
        },
        {
          long_name: '94022',
          short_name: '94022',
          types: [
            'postal_code'
          ]
        },
      ],
    };
    jest.spyOn(Utils, 'geocodeByPlaceId').mockResolvedValueOnce([result]);
    const pl = {
      structured_formatting: {
        main_text: 'something',
      },
      description: 'desc',
      place_id: 'someid',
    };
    const wrapper = shallow(<Autocomplete {...props} />);
    const handleSelect = wrapper.find('GooglePlacesAutocomplete').invoke('onSelect');
    handleSelect(pl);
    await flushPromises();
    expect(setCompany).toHaveBeenCalled();
    expect(props.onSelect).toHaveBeenCalled();
  });


  it('handleSelect no result', () => {
    const setCompany = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValueOnce(['company', setCompany]);
    jest.spyOn(Utils, 'geocodeByPlaceId').mockResolvedValueOnce();
    const p = {
      structured_formatting: {
        main_text: 'something',
      },
      description: 'desc',
      place_id: 'someid',
    };
    const wrapper = shallow(<Autocomplete {...props} />);
    const handleSelect = wrapper.find('GooglePlacesAutocomplete').invoke('onSelect');
    handleSelect(p);
    expect(props.onSelect).not.toHaveBeenCalled();
  });
});
