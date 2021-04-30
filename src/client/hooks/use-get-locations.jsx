import useActionDispatch from './action-dispatch';
import { getPostStandardObjectsList } from '../redux/actions/objects';

const OBJECT_LOCATIONS = 'locations';
const fetch = getPostStandardObjectsList(OBJECT_LOCATIONS, OBJECT_LOCATIONS, 'v2', OBJECT_LOCATIONS, '', 10, 'numberOfLocations');

export default function useGetLocations() {
  return useActionDispatch(fetch);
}
