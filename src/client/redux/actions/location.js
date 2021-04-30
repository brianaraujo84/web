import {
  GET_LOCATION_STARTED,
  GET_LOCATION_ENDED,
} from '../reducers/location';

export const getLocation = (dispatch) => {
  dispatch({ type: GET_LOCATION_STARTED });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { coords } = position;
      const { latitude, longitude } = coords;
      const location = { lat: latitude, lng: longitude };
      dispatch({
        type: GET_LOCATION_ENDED,
        location,
        error: true,
      });
    });
  } else {
    dispatch({
      type: GET_LOCATION_ENDED,
      location: null,
      error: true,
    });
  }
};
