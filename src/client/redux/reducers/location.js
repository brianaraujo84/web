export const GET_LOCATION_STARTED = 'location/GET_LOCATION_STARTED';
export const GET_LOCATION_ENDED = 'location/GET_LOCATION_ENDED';

const initialState = {
  location: null,
  inprogress: false,
  error: false,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOCATION_STARTED:
      return {
        ...state,
        inprogress: true,
        error: false,
      };
    case GET_LOCATION_ENDED:
      return {
        ...state,
        inprogress: false,
        location: action.location,
        error: action.error,
      };
    default:
      return state;
  }
};

export default profileReducer;
