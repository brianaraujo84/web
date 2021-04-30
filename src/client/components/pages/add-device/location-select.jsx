import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

import LocationCard from './location-card';
// import ScrollableList from '../../shared/scrollable-list';
import { useActionDispatch } from '../../../hooks';
import { getPostStandardObjectsList } from '../../../redux/actions/objects';
import * as URLS from '../../../urls';
import GroupsList from '../activate/steps/activate-groups';

const OBJECT_DEVICE_LOCATIONS = 'deviceLocations';

const LocationSelect = ({ onContinue, isVirtualDevice, error }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [location, setlocation] = React.useState(null);
  const [keyword, setKeyword] = React.useState('');

  const {
    items: locations,
    total: locationsTotal,
  } = useSelector(state => state.deviceLocations);
  const newTemplateData = useSelector(state => state.newTemplate?.data);

  const getDeviceLocations = useActionDispatch(getPostStandardObjectsList(
    OBJECT_DEVICE_LOCATIONS,
    'locations',
    'v2',
    'locations',
    '',
    10,
    'numberOfLocations'
  ));

  const locationsNumber = locations.length;
  const hasMore = !Number.isInteger(locationsTotal) || locationsTotal > locationsNumber;

  const fetchLocations = (firstFetch = false) => {
    getDeviceLocations({ device: true, searchTerm: keyword }, undefined, '', '', firstFetch);
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
    setlocation(null);
  };

  const handleClickLocation = (l) => () => {
    if (newTemplateData && newTemplateData?.selectedTemplate) {
      history.push({
        pathname: URLS.TASK_DETAILS(l.locationId, newTemplateData.taskTemplateId, newTemplateData.tm),
        state: { 
          tabType: 'groups',
          templateType: 'Main',
        }
      });
    } else {
      if (!location) {
        setlocation(l);
      } else {
        setlocation(null);
      }
    }
  };

  const filteredLocation = React.useMemo(() => {
    if (newTemplateData?.selectedTemplate?.locationType) {
      return locations.filter(loc => loc.locationType === newTemplateData?.selectedTemplate?.locationType);
    } else {
      return locations;
    }
  },[locations, newTemplateData]);

  React.useEffect(()=> {
    fetchLocations(true);
  }, [keyword]);

  return (
    <div className="container pb-4">
      <div className="row row justify-content-center">
        <div className="col-11 col-md-6">
          <h1 className="text-center mb-2 mt-4">
            {isVirtualDevice ? (
              <Trans>Add Virtual Smart Display</Trans>
            ) : (newTemplateData && newTemplateData.selectedTemplate) ? (
              <Trans>Add Workspace</Trans>
            ) : (
              <Trans>Add Device</Trans>
            )}
          </h1>
          <p className="lead text-center">
            {isVirtualDevice ? (
              <Trans>Select the Workpace where this virtual smart display will be displayed in.</Trans>
            ): (newTemplateData && newTemplateData.selectedTemplate) ? (
              <Trans>Select on workspace for the template</Trans>
            ) : (
              <Trans>Select the Workpace where this device will be displayed in.</Trans>
            )}
          </p>
        </div>
      </div>

      {!location && <div className="row mb-2">
        <div className="col">
          <form>
            <label className="sr-only" htmlFor="inlineFormInputGroup"><Trans>Search</Trans></label>
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text"><i className="fas fa-search" aria-hidden="true"></i></div>
              </div>
              <input type="text" className="form-control" placeholder={t('Search for space')} onChange={handleSearchChange}/>
            </div>
          </form>
        </div>
      </div>}
      {error && <p className="error-message">{error}</p>}

      {!location && <div className="list-group" id="space-select">
        <InfiniteScroll
          height={300}
          dataLength={locationsNumber}
          next={fetchLocations}
          hasMore={hasMore}
          loader={<div style={{ textAlign: 'center', padding: 20 }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
        >
          {location ? (
            <LocationCard location={location} onClick={handleClickLocation(location)} selected />
          ) : (
            <>
              {filteredLocation.map((l) => (
                <LocationCard key={l.locationId} location={l} onClick={handleClickLocation(l)} />
              ))}
            </>
          )}
        </InfiniteScroll>
      </div>}
      {location && <div>
        <GroupsList locIdFromVD={location.locationId} setTemplateIdToVD={(templateId) => {location.templateId = templateId; onContinue(location);}}/>
      </div>}

      <div className="mt-4">
        <Button variant="primary" disabled={!location} onClick={() => onContinue(location)} block>
          <Trans>Continue</Trans>
        </Button>
      </div>
    </div>
  );
};

LocationSelect.propTypes = {
  onContinue: PropTypes.func.isRequired,
  isVirtualDevice: PropTypes.bool,
  error: PropTypes.string,
};

LocationSelect.displayName = 'LocationSelect';

export default LocationSelect;
