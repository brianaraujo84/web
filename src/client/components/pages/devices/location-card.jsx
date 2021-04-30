import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans } from 'react-i18next';
import PropTypes from 'prop-types';

import { typeIcon } from '../../../utils';
import * as URLS from '../../../urls';

const LocationCard = ({ location }) => {
  const history = useHistory();

  const handleClick = () => {
    if (location.numberofDevices > 0) {
      history.push(URLS.DEVICES_LIST(location.locationId));
    }
  };

  return (
    <div className="card location-card mt-3">
      <div className="d-flex align-items-center">
        <div className="col-7 pl-2 pr-0 d-flex align-items-center py-3">
          <div className="space-icon small border text-primary rounded-circle text-center bg-light mr-2">
            <span aria-hidden="true"><i className={`fad ${typeIcon(location.locationType)}`} aria-hidden="true"></i></span>
          </div>
          <div>
            <h6 className="mb-0 location-business-name">{location.locationName}</h6>
            <p className="text-secondary mb-0 location-business-location-name"><small>{location.locationDetails}</small></p>
          </div>
        </div>
        <div className="col py-3 w-100 text-right">
          <small className="d-block">{location?.address?.addressLine1}</small>
          <small className="text-secondary d-block">{`${location?.address?.city}, ${location?.address?.state}`}</small>
        </div>
      </div>
      <div className="card-body border-top p-0 p-0 text-center text-primary">
        <div className="row">
          <div className="col ml-3 p-3 pt-2 pb-4">
            <p className="mb-0 text-uppercase"><small><Trans i18nKey="devices" /></small></p>
            <h4 className="display-3 mb-0" onClick={handleClick}><strong>{location.numberofDevices}</strong></h4>
          </div>
        </div>
      </div>
    </div>
  );
};

LocationCard.propTypes = {
  location: PropTypes.object.isRequired,
};

LocationCard.displayName = 'LocationCard';

export default LocationCard;
