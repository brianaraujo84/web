import {
  SAVE_SHORTCUTS,
} from '../reducers/electron';

export const saveShortcuts = (dispatch, shortcuts) => {
  dispatch({ type: SAVE_SHORTCUTS, payload: shortcuts });
};
