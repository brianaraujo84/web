import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import Layout from '../../shared/layout';
import { useTitle } from '../../../hooks';
import ZonePopupModal from './zone-popup-modal';

import { useActionDispatch } from '../../../hooks';
import { resetObject, getStandardObject } from '../../../redux/actions/object';
import { resetList, getStandardObjectsList, postStandardObjectsList } from '../../../redux/actions/objects';

import * as URLS from '../../../urls';

import Content from './content';
import Tasks from './tasks';

const OBJECT_LOСATION = 'location';
const OBJECT_TASKS = 'tasks';
const OBJECT_ZONE_TYPES = 'zoneTypes';
const OBJECT_LOСATION_ZONES = 'locationZones';

const MyLocationDetails = () => {
  const { t } = useTranslation();
  const { locationId } = useParams();
  const history = useHistory();

  const resetLocation = useActionDispatch(resetObject(OBJECT_LOСATION));
  const resetTasks = useActionDispatch(resetList(OBJECT_TASKS));
  const getZoneTypes = useActionDispatch(getStandardObjectsList(OBJECT_ZONE_TYPES, undefined, undefined, 'zones'));
  const updateLocationZones = useActionDispatch(postStandardObjectsList(OBJECT_LOСATION_ZONES, undefined, undefined, 'location', '/configuration'));
  const getLocation = useActionDispatch(getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary'));

  const profile = useSelector(state => state.profile.data);
  const { locationType } = useSelector(state => state.loc.data);

  const [showZonePopup, setShowZonePopup] = React.useState(false); // zone popup bypassed. use isFirstTime as initial state to reinstate popup

  const handleViewZones = () => {
    setShowZonePopup(false);
    getZones();
  };
  useTitle(t('loc_details'));

  const getZones = async () => {
    const { zoneTypes } = await getZoneTypes(locationType);
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

  React.useMemo(() => {
    if (locationId) {
      getLocation(locationId);
    }
  }, [locationId]);

  React.useEffect(() => {
    return () => {
      resetLocation();
      resetTasks();
    };
  }, []);

  const loading = useSelector(state => {
    return !state.loc || state.loc.initialLoading
      || !state.tasks || state.tasks.initialLoading;
  });

  return (
    <Layout>
      <div className="content-wrapper">
        <div className="pt-3 bg-white">
          <Content isLoading={loading} my setShowZonePopup={setShowZonePopup} />
        </div>
        <Tasks isLoading={loading} my />
      </div>
      {
        showZonePopup && (
          <ZonePopupModal
            show={showZonePopup}
            locationType={locationType}
            onViewZones={handleViewZones}
            onCancel={() => setShowZonePopup(false)}
          />
        )
      }
    </Layout>
  );
};

MyLocationDetails.displayName = 'MyLocationDetails';
export default MyLocationDetails;
