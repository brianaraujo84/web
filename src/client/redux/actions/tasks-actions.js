import { actions } from '../reducers/tasks-actions';

export const descriptionFocused = (dispatch, flag) => {
  return dispatch({ type: actions.IS_DESCRIPTION_FOCUSED, isDescriptionFocused: flag });
};

export const setLocData = (dispatch, data) => {
  return dispatch({ type: actions.SET_LOC_DATA, data });
};
