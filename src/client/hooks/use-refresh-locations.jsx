import React from 'react';
import useActionDispatch from './action-dispatch';
import useGetLocations from './use-get-locations';
import { resetList, updateListItems } from '../redux/actions/objects';

const OBJECT_LOCATIONS = 'locations';
const OBJECT_DEVICE_LOCATIONS = 'deviceLocations';
const reset = resetList(OBJECT_LOCATIONS);
const _update = updateListItems(OBJECT_DEVICE_LOCATIONS);

export default function useRefreshLocations() {
  const getLocations = useGetLocations();
  const resetLocations = useActionDispatch(reset);
  const update = useActionDispatch(_update);
  return React.useCallback(() => {
    resetLocations();
    getLocations().then((data)=>{
      update(data.locations, data.numberOfLocations);
    });
  }, [getLocations, resetLocations]);
}
