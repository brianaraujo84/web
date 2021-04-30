import React from 'react';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import InfiniteScroll from 'react-infinite-scroller';

import { useActionDispatch } from '../../../../hooks';
import { postConfidenceObject } from '../../../../redux/actions/object';
import Layout from '../../../shared/layout';
import { useTitle } from '../../../../hooks';
import * as URLS from '../../../../urls';
import { typeIcon } from '../../../../utils';

const OBJECT_LOCATIONS = 'locations';
const state = { searchData: {device: true, start: 0, limit: 10}, locations: [], numberOfLocations: 10000, page: 0 };
let isLoading = false;

const ActivateLocations = () => {
  const { t } = useTranslation();
  useTitle(t('ActivateLocations'));
  const history = useHistory();

  const [rePaint, setRePaint] = React.useState(false);
  const [locationId, setLocationId] = React.useState(false);
  const getLocs = useActionDispatch(postConfidenceObject(OBJECT_LOCATIONS, 'v2', OBJECT_LOCATIONS));

  const updateLocations = () => {
    if (isLoading) {
      return;
    }

    isLoading = true;
    getLocs(state.searchData).then((data = {}) => {
      const locationsAdd = data.locations || [];
      state.locations = [...state.locations, ...locationsAdd];
      state.numberOfLocations = data.numberOfLocations;
      state.page = state.page + 1;
      state.searchData.start = 10 * state.page;
      setRePaint(!rePaint);
    });
  };

  const isReadyToLoad = () => {
    return (state.numberOfLocations > state.locations.length);
  };

  const onSelect = (loc) => {
    /*const l = locationId === loc.locationId ? false : loc.locationId;
    setLocationId(l);
    setRePaint(!rePaint);*/
    setLocationId(loc.locationId);
    moveToGroups(loc.locationId);
  };

  const moveToGroups = (locId) => {
    history.push(URLS.ACTIVATE('groups', locId || locationId));
  };

  React.useEffect(() => {
    isLoading = true;
    updateLocations();
  },[]);

  React.useEffect(() => {
    isLoading = false;
  },[rePaint]);

  return (
    <Layout>
      <div className="container pb-4 content-wrapper">
        <div className="row justify-content-center">
          <div className="col-11 col-md-6">
            <h1 className="text-center mb-2 mt-4"><Trans i18nKey="select_space" defaults="Select Space" /></h1>
            <p className="lead text-center">Select the Workspace where this device will be displayed in.</p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <label className="sr-only">Search</label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text"><i className="fas fa-search" aria-hidden="true"></i></div>
              </div>
              <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search for space"/>
            </div>
          </div>
        </div>

        <div className="col-12 list-group pr-0">
          <InfiniteScroll pageStart={0} loadMore={updateLocations} hasMore={isReadyToLoad()}>
            {state.locations.map((loc, idx) => {
              return (<div onClick={() => onSelect(loc)} className={`list-group-item px-2 ${locationId === loc.locationId ? 'selected bg-primary text-white rounded' : locationId === false ? '' : 'd-none'}`} key={idx}>
                <div className="d-flex align-items-center">
                  <div className="space-icon small border text-primary rounded-circle text-center bg-light mr-2">
                    <span className="" aria-hidden="true"><i className={`fad ${typeIcon(loc.locationType)} text-primary`} aria-hidden="true"></i></span>
                  </div>
                  <div className="col d-flex align-items-center p-0">
                    <div>
                      <h6 className="mb-0 location-business-name">{loc.locationName}</h6>
                      <p className="mb-0 location-business-location-name"><small>{loc.locationDetails}</small></p>
                    </div>
                  </div>
                  <div className="col p-0 text-right">
                    <small className="d-block">{loc?.address?.addressLine1}</small>
                    <small className="d-block">{loc?.address?.city}{loc?.address?.state}</small>
                  </div>
                </div>
              </div>);
            })}
          </InfiniteScroll>
        </div>
        <div className="mt-4">
          <Button
            role="button"
            variant="primary"
            block
            className="text-white"
            disabled={!locationId}
            onClick={moveToGroups}>
              Continue
          </Button>
        </div>

      </div>
    </Layout>
  );
};

ActivateLocations.displayName = 'ActivateLocations';
export default ActivateLocations;
