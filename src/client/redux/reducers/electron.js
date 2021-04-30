export const SAVE_SHORTCUTS = 'electron/SAVE_SHORTCUTS';

const initialState = {
  shortcuts: [],
};

const electronReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_SHORTCUTS: {
      const { payload } = action;
      return {
        ...state,
        shortcuts: payload,
      };
    }
    default:
      return state;
  }
};

export default electronReducer;
