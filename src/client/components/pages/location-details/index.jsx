import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams, useHistory } from 'react-router-dom';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';

import { useActionDispatch } from '../../../hooks';
import { resetList, getStandardObjectsList, postStandardObjectsList } from '../../../redux/actions/objects';
import { getStandardObject } from '../../../redux/actions/object';

import * as URLS from '../../../urls';

import Content from './content';
import Tasks from './tasks';
import ZonePopupModal from './zone-popup-modal';

const OBJECT_LOСATION = 'location';
const OBJECT_TASKS = 'tasks';
const OBJECT_LOСATION_ZONES = 'locationZones';
const OBJECT_ZONE_TYPES = 'zoneTypes';

const LocationDetails = () => {
  const { t } = useTranslation();

  const resetTasks = useActionDispatch(resetList(OBJECT_TASKS));
  const getZoneTypes = useActionDispatch(getStandardObjectsList(OBJECT_ZONE_TYPES, undefined, undefined, 'zones'));
  const updateLocationZones = useActionDispatch(postStandardObjectsList(OBJECT_LOСATION_ZONES, undefined, undefined, 'location', '/configuration'));
  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));

  const profile = useSelector(state => state.profile.data);
  const { locationType } = useSelector(state => state.loc.data);

  const history = useHistory();
  const { locationId, filter } = useParams();
  const { data = {} } = useLocation();
  const { isFirstTime = false } = data;

  const [showZonePopup, setShowZonePopup] = React.useState(false); // zone popup bypassed. use isFirstTime as initial state to reinstate popup
  const [numberofTasks, setNumberofTasks] = React.useState();

  useTitle(t('loc_details'));

  const handleViewZones = () => {
    setShowZonePopup(false);
    getZones();
  };

  const getZones = async () => {
    const { zoneTypes = [] } = await getZoneTypes(locationType);
    const defaultZone = zoneTypes.filter(z => z.default);
    if (defaultZone.length) {
      const allDefaultZones = [];
      defaultZone.forEach((z, i) => {
        allDefaultZones.push({
          sequenceOrder: i + 1,
          type: z.zoneType,
        });
      });
      const zoneData = {
        zones: allDefaultZones,
        userName: profile.username,
      };
      updateLocationZones(zoneData, locationId).then(() => {
        getLocation(locationId);
        history.push({ pathname: URLS.LOCATION_CONFIGURE_ZONES(locationId) });
      });
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      resetTasks();
    };
  }, []);

  React.useMemo(() => {
    if (locationId) {
      resetTasks();
      getLocation(locationId, undefined, undefined, true).then(data => {
        if (data && data.numberofTasks) {
          setNumberofTasks(data.numberofTasks);
        }
      });
    }
  }, [locationId]);

  const loading = useSelector(state => {
    return !state.loc || state.loc.initialLoading
      || !state.managers || state.managers.initialLoading
      || !state.tasks || state.tasks.initialLoading;
  });

  return (
    <Layout>
      <div className="content-wrapper">
        <div className='pt-3 bg-white'>
          <Content
            isLoading={loading}
            isFirstTime={isFirstTime}
            setShowZonePopup={setShowZonePopup}
            numberofTasks={numberofTasks}
          />
        </div>
        <Tasks
          isLoading={loading}
          filter={filter}
        />
      </div>
      {
        showZonePopup ? (
          <ZonePopupModal
            show={showZonePopup}
            locationType={locationType}
            onViewZones={handleViewZones}
            onCancel={() => setShowZonePopup(false)}
          />
        ) : null
      }
    </Layout>
  );
};

LocationDetails.displayName = 'LocationDetails';
export default LocationDetails;
