import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import LocationCard from '../add-device/location-card';

const Workspaces = ({handleClickLocation}) => {

  const locations = useSelector(state => state.deviceLocations.items);

  return (
    <div className="list-group">
      {locations.map((l) => (
        <LocationCard key={l.locationId} location={l} onClick={handleClickLocation(l)} />
      ))}
    </div>
  );
};

Workspaces.propTypes = {
  handleClickLocation: PropTypes.func,
};

Workspaces.displayName = 'Workspaces';

export default Workspaces;
