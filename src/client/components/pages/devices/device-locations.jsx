import React from 'react';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';

import LocationCard from './location-card';

const DeviceLocations = () => {

  const locations = useSelector(state => state.deviceLocations.items);

  return (
    <div className="container pb-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 mt-3">
          <div className="row mb-1">
            <div className="col-12">
              <h3 className="mt-1"><Trans i18nKey="devices_connected" defaults="Connected Devices" /></h3>
              <p className="lead mb-0">Workspaces with devices connected</p>
            </div>
          </div>

          <div>
            <div className="row justify-content-center">
              <div className="col-12">
                {locations.map((location) => (
                  <LocationCard key={location.locationId} location={location} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DeviceLocations.displayName = 'DeviceLocations';

export default DeviceLocations;
