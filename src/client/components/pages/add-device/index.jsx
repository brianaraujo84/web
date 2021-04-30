import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from '../../shared/layout';
import { useTitle, useActionDispatch } from '../../../hooks';
import {
  getStandardObject,
} from '../../../redux/actions/object';

import LocationSelect from './location-select';
import DeviceAdd from './device-add';
import VirtualDeviceAdd from './virtual-device-add';
import { _postObject } from '../../../services/services';
import * as URLS from '../../../urls';
import { setItem } from '../../../utils/storage-utils';
import { StorageKeys } from '../../../constants';

const STATE_LOCATION_SELECT = 0;
const STATE_DEVICE_ADD = 1;

const OBJECT_LOСATION = 'location';

const AddDevice = ({ location: locationData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  useTitle(t('Add Device'));

  const [status, setStatus] = React.useState(STATE_LOCATION_SELECT);
  const [locationId, setLocationId] = React.useState('');
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [error, setError] = React.useState(null);

  const locations = useSelector(state => state.locations.items);
  const newTemplateData = useSelector(state => state.newTemplate?.data);

  const getLocation = useActionDispatch(
    getStandardObject(OBJECT_LOСATION, undefined, undefined, '/summary')
  );

  const location = React.useMemo(() => {
    return locations && locations.find(item => item.locationId === locationId);
  }, [locations, locationId]);

  const handleSelectLocation = (data) => {
    if (newTemplateData && newTemplateData?.selectedTemplate) {
      return;
    }
    if (data.templateId) {
      handleAddVirtualDisplay(data);
      return;
    }
    setSelectedLocation(data);
    setStatus(STATE_DEVICE_ADD);
  };

  const handleAddVirtualDisplay = async (location) => {
    try {
      const data = {
        locationId: location.locationId,
        templateId: location.templateId,
        virtualDevice: true,
      };
      const { deviceId, passcode } = await _postObject('confidenceiot/v1/device/registration', data);
      setItem(StorageKeys.DEVICE_PASSCODE_KEY, passcode);
      history.push(URLS.DEVICE_ACTIVATE(deviceId));
    } catch (err) {
      setError(err?.data?.message);
    }
  };

  React.useEffect(() => {
    if (history?.location?.state?.locationId) {
      setLocationId(history.location.state.locationId);
    }

  },[history]);

  React.useEffect(() => {
    if (locationId) {
      getLocation(locationId);
    }
  },[locationId]);

  return (
    <Layout>
      <div className="content-wrapper">
        {status === STATE_LOCATION_SELECT && !locationId && (
          <LocationSelect isVirtualDevice={locationData?.data?.virtualDevice} onContinue={handleSelectLocation} error={error}/>
        )}
        {locationData?.data && (status === STATE_DEVICE_ADD && (location || selectedLocation) || (locationId && location)) ? (
          <VirtualDeviceAdd locationId={selectedLocation ? selectedLocation.locationId : location.locationId} />
        ):(status === STATE_DEVICE_ADD && (location || selectedLocation) || (locationId)) && (
          <DeviceAdd locationId={locationId} location={location} templateId={history?.location?.state?.templateId || null}/>
        )}
      </div>
    </Layout>
  );
};

AddDevice.propTypes = {
  location: PropTypes.object,
};

AddDevice.displayName = 'AddDevice';

export default AddDevice;
