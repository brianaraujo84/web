export const _OBJECT_GET_STARTED = name => `${name}/objects/OBJECT_GET_STARTED`;
export const _OBJECT_GET_ENDED = name => `${name}/objects/OBJECT_GET_ENDED`;
export const _OBJECT_UPDATE_STARTED = name => `${name}/objects/OBJECT_UPDATE_STARTED`;
export const _OBJECT_UPDATE_ENDED = name => `${name}/objects/OBJECT_UPDATE_ENDED`;
export const _OBJECT_RESET = name => `${name}/objects/OBJECT_RESET`;
export const _OBJECT_SET = name => `${name}/objects/_OBJECT_SET`;

const initialState = {
  data: {},
  error: false,
  inprogress: false,
  initialLoading: false,
};

const object = name => (store = initialState, action) => {
  switch (action.type) {
    case _OBJECT_GET_STARTED(name):
      return {
        ...store,
        error: false,
        // data: {},
        inprogress: true,
        initialLoading: action.firstFetch,
      };
    case _OBJECT_GET_ENDED(name):
      return {
        ...store,
        data: action.data,
        error: action.error,
        inprogress: false,
        initialLoading: false,
      };
    case _OBJECT_UPDATE_STARTED(name):
      return {
        ...store,
        error: false,
        data: {},
        inprogress: true
      };
    case _OBJECT_UPDATE_ENDED(name):
      return {
        ...store,
        error: action.error,
        data: action.data,
        inprogress: false
      };
    case _OBJECT_RESET(name):
      return { ...initialState };
    case _OBJECT_SET(name):
      return {
        ...store,
        error: false,
        data: action.data,
        inprogress: false
      };
    default:
      return { ...store };
  }
};

export default object;
