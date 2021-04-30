export const ADD_TOAST = 'toasts/ADD_TOAST';
export const REMOVE_TOAST = 'toasts/REMOVE_TOAST';
export const TRUNCATE_TOASTS = 'toasts/TRUNCATE_TOASTS';

const initialState = {
  list: [],
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TOAST: {
      const { message, delay, handlerName, handlerFn } = action;
      const toast = {
        message,
        delay,
        handlerName,
        handlerFn,
      };
      const list = [...state.list];
      list.push(toast);
      return {
        ...state,
        list,
      };
    }
    case REMOVE_TOAST: {
      const { index } = action;
      const list = [...state.list];
      list.splice(index, 1);
      return {
        ...state,
        list,
      };
    }
    case TRUNCATE_TOASTS: {
      return {
        ...state,
        list: [],
      };
    }

    default:
      return state;
  }
};

export default profileReducer;
