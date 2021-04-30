export const actions = {
  IS_DESCRIPTION_FOCUSED: 'tasksActions/IS_DESCRIPTION_FOCUSED',
  SET_LOC_DATA: 'tasksActions/SET_LOC_DATA',
};

const initialState = {
  data: {},
  isDescriptionFocused: false,
  inprogress: false,
  error: false,
};

const tasksActionsReducer = (state = initialState, action) => {
  switch (action.type) {

    case actions.IS_DESCRIPTION_FOCUSED:
      return {
        ...state,
        isDescriptionFocused: action.isDescriptionFocused,
      };

    case actions.SET_LOC_DATA:
      return {
        ...state,
        data: {...state.data, ...action.data},
      };

    default:
      return state;
  }
};

export default tasksActionsReducer;
