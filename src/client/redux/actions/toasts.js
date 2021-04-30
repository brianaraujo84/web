import {
  ADD_TOAST,
  REMOVE_TOAST,
  TRUNCATE_TOASTS,
} from '../reducers/toasts';

export const addToast = (dispatch, message, delay, handlerName, handlerFn) => {
  dispatch({ type: ADD_TOAST, message, delay, handlerName, handlerFn });
};

export const removeToast = (dispatch, index) => {
  dispatch({ type: REMOVE_TOAST, index });
};

export const truncateToasts = (dispatch) => {
  dispatch({ type: TRUNCATE_TOASTS });
};
