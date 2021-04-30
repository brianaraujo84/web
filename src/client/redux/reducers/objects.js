export const _GET_OBJECTS_STARTED = (name) => name + 'objects/_GET_OBJECTS_STARTED';
export const _GET_OBJECTS_ENDED = (name) => name + 'objects/_GET_OBJECTS_ENDED';
export const _POST_OBJECTS_STARTED = (name) => name + 'objects/_POST_OBJECTS_STARTED';
export const _POST_OBJECTS_ENDED = (name) => name + 'objects/_POST_OBJECTS_ENDED';
export const _REMOVE_FROM_LIST = (name) => name + 'objects/_REMOVE_FROM_LIST';
export const _ADD_TO_LIST = (name) => name + 'objects/_ADD_TO_LIST';
export const _RESET_LIST = (name) => name + 'objects/_RESET_LIST';
export const _RESET_LIST_ITEMS = (name) => name + 'objects/_RESET_LIST_ITEMS';
export const _UPDATE_LIST_ITEMS = (name) => name + 'objects/_UPDATE_LIST_ITEMS';

const initialState = {
  items: [],
  pagination: {},
  error: false,
  inprogress: false,
  initialLoading: false,
  total: null, // For pagination only
};

const lookupReducer = (name) => (state = initialState, action) => {
  switch (action.type) {
    case _GET_OBJECTS_STARTED(name):
      return {
        ...state,
        items: (!action.readonly && action.firstFetch) ? [] : state.items,
        pagination: {},
        error: false,
        inprogress: !action.readonly,
        initialLoading: !action.readonly && action.firstFetch,
      };
    case _GET_OBJECTS_ENDED(name): {
      const newItems = action.list || [];
      const readonly = action.readonly || false;
      let items = state.items;
      let total = state.total;
      if (!readonly) {
        items = newItems;
        if (action.prepend) { items = [...newItems, ...state.items]; }
        if (action.append) { items = [...state.items, ...newItems]; }
        total = action.total;
      }

      return {
        ...state,
        pagination: action.pagination,
        items,
        total,
        error: action.error,
        inprogress: false,
        initialLoading: false,
      };
    }
    case _POST_OBJECTS_STARTED(name):
      return {
        ...state,
        pagination: {},
        error: false,
        inprogress: true,
      };
    case _POST_OBJECTS_ENDED(name):
      return {
        ...state,
        pagination: action.pagination,
        error: action.error,
        inprogress: false,
      };
    case _REMOVE_FROM_LIST(name): {
      const { index } = action;
      const { items: itemsOld } = state;
      const items = itemsOld.slice(0);
      items.splice(index, 1);
      return {
        ...state,
        items,
        total: state.total - 1,
      };
    }
    case _ADD_TO_LIST(name): {
      const { index, task } = action;
      const { items: itemsOld } = state;
      const items = itemsOld.slice(0);
      items.splice(index + 1, 0, task);
      return {
        ...state,
        items,
        total: state.total + 1,
      };
    }
    case _RESET_LIST(name): {
      return {
        ...initialState,
      };
    }
    case _UPDATE_LIST_ITEMS(name): {
      return {
        ...state,
        items: action.items,
        total: action.total,
      };
    }

    default:
      return state;
  }
};

export default lookupReducer;

