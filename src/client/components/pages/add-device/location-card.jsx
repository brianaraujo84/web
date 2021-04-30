import React from 'react';
import { classnames } from 'react-form-dynamic';
import PropTypes from 'prop-types';

import { typeIcon } from '../../../utils';

const LocationCard = ({ location, selected, onClick }) => {
  return (
    <div className={classnames(['list-group-item px-2', selected && 'selected bg-primary text-white'])} onClick={onClick}>
      <div className="d-flex align-items-center">
        <div className="col col-auto p-0 text-center">
          <i
            className={classnames([`fad ${typeIcon(location.locationType)} mr-2 fa-2x location-type-icon`, selected ? 'text-white' : 'text-primary'])}
            aria-hidden="true"
          />
        </div>
        <div className="col d-flex align-items-center p-0">
          <div>
            <h6 className="mb-0 location-business-name">{location.locationName}</h6>
            <p className={classnames(['mb-0 location-business-location-name', selected ? 'text-white' : 'text-secondary'])}>
              <small>{location.locationDetails}</small>
            </p>
          </div>
        </div>
        <div className="col p-0 text-right">
          <small className="d-block">{location?.address?.addressLine1}</small>
          <small className={classnames(['d-block', selected ? 'text-white' : 'text-secondary'])}>
            {`${location?.address?.city}, ${location?.address?.state}`}
          </small>
        </div>
      </div>
    </div>
  );
};

LocationCard.propTypes = {
  location: PropTypes.object,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

LocationCard.defaultProps = {
  selected: false,
};

LocationCard.displayName = 'LocationCard';

export default LocationCard;
