import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import * as URLS from '../../../urls';

const Breadcrumb = () => {
  const loc = useSelector(state => state.loc.data);
  return (
    <>
      {!!loc.address && (
        <nav aria-label="breadcrumb" className="mt-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={URLS.LOCATION(loc.locationId)}>{loc?.address?.addressLine1}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page"><Trans>Configure</Trans></li>
          </ol>
        </nav>
      )}
    </>
  );
};

Breadcrumb.displayName = 'LocationsConfigureZonesBreadcrumb';
export default Breadcrumb;
