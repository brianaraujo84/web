import React from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import DeviceLocations from './device-locations';
import Empty from './empty';
import { useActionDispatch } from '../../../hooks';
import { getPostStandardObjectsList } from '../../../redux/actions/objects';

const OBJECT_DEVICE_LOCATIONS = 'deviceLocations';

const Content = () => {
  const [loading, setLoading] = React.useState(true);

  const {
    items: locations,
    total: locationsTotal,
    inprogress: locationsLoading,
  } = useSelector(state => state.deviceLocations);

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
    getDeviceLocations({ device: true }, undefined, '', '', firstFetch);
  };

  const getDevices = React.useCallback(async () => {
    setLoading(false);
    fetchLocations(true);
  }, []);

  React.useEffect(() => {
    getDevices();
  }, [getDevices]);

  if ((!locationsNumber && locationsLoading) || loading) {
    return (
      <div className="container mt-12 pb-4 w-75">
        <div style={{ textAlign: 'center', padding: 30 }}>
          <i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        {locationsNumber > 0 ? (
          <InfiniteScroll
            dataLength={locationsNumber}
            next={fetchLocations}
            hasMore={hasMore}
            loader={<div style={{ textAlign: 'center', padding: 20 }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
          >
            <DeviceLocations />
          </InfiniteScroll>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
};

Content.displayName = 'DevicesContent';

export default Content;
