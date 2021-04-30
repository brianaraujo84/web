import React from 'react';
import PropTypes from 'prop-types';

import { Trans } from 'react-i18next';

import GooglePlacesAutocomplete from './google-place-autocomplete';

import { geocodeByPlaceId } from '../../../utils';

import './autocomplete.css';

const Autocomplete = ({
  initialValue,
  geolocation,
  onSelect,
  style,
  className,
  isAddress,
  types,
  idPrefix,
  selectOnly,
  ...rest
}) => {
  const [company, setCompany] = React.useState('');
  const [ts, setTs] = React.useState(new Date().getTime());

  geolocation = geolocation || { lat: 37.7749, lng: -122.4194 }; // default location for San Francisco

  const handleSelect = async (p) => {
    const name = isAddress ? p.description : p.structured_formatting.main_text;
    setCompany(name);

    try {
      const results = await geocodeByPlaceId(p.place_id);

      const componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'short_name',
        postal_code: 'short_name',
        subpremise: 'short_name',
      };

      if (!results || !results.length) {
        return;
      }

      const place = results[0];

      const addr = {};

      for (var i = 0; i < place.address_components.length; i++) {
        const addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          const val = place.address_components[i][componentForm[addressType]];
          addr[addressType] = val;
        }
      }

      const address = {
        address: `${addr.street_number ? addr.street_number + ' ' : ''}${addr.route}`,
        address2: addr.subpremise,
        city: addr.locality,
        state: addr.administrative_area_level_1,
        zip: addr.postal_code,
        country: addr.country,
      };
      onSelect(name, address, p, place);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  const handleChange = (value) => {
    if (selectOnly) {
      setTs(new Date().getTime());
      value = '';
    }
    onSelect(value, '', {});
    setCompany(value);
  };

  React.useEffect(() => {
    setCompany(initialValue);
  }, [initialValue]);

  return (
    <>
      <GooglePlacesAutocomplete
        initialValue={company}
        onSelect={handleSelect}
        inputStyle={style}
        ts={ts}
        inputClassName={className}
        handleChange={handleChange}
        autocompletionRequest={{
          location: geolocation,
          radius: 10,
          types: types
        }}
        idPrefix={idPrefix}
        loader={(
          <div className="google-places-autocomplete__suggestions-container">
            <div className="google-places-autocomplete__suggestions">
              <Trans>Loading...</Trans>
            </div>
          </div>
        )}
        {...rest}
      />

    </>
  );
};
Autocomplete.propTypes = {
  geolocation: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  initialValue: PropTypes.string,
  idPrefix: PropTypes.string,
  isAddress: PropTypes.bool,
  selectOnly: PropTypes.bool,
  types: PropTypes.arrayOf(PropTypes.oneOf(['establishment', 'address', 'geocode', '(regions)', '(cities)'])),
};
Autocomplete.defaultProps = {
  geolocation: null,
  style: {},
  className: 'google-places-autocomplete__input',
  idPrefix: 'geo',
  initialValue: '',
  isAddress: false,
  selectOnly: true,
  types: ['establishment'],
};
Autocomplete.displayName = 'GeoAutocomplete';
export default Autocomplete;
