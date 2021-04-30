export const GET_FILES_LIST_START = 'files/GET_FILES_LIST_START';
export const GET_FILES_LIST_END = 'files/GET_FILES_LIST_END';
export const GET_FILES_ACTIVITY_LIST_START = 'files/GET_FILES_ACTIVITY_LIST_START';
export const GET_FILES_ACTIVITY_LIST_END = 'files/GET_FILES_ACTIVITY_LIST_END';
export const GET_TEMPLATE_FILES_LIST_START = 'files/GET_TEMPLATE_FILES_LIST_START';
export const GET_TEMPLATE_FILES_LIST_END = 'files/GET_TEMPLATE_FILES_LIST_END';
export const UPLOAD_FILES_START = 'files/UPLOAD_FILES_START';
export const UPLOAD_TEMPLATE_FILES_START = 'files/UPLOAD_TEMPLATE_FILES_START';
export const UPLOAD_FILES_END = 'files/UPLOAD_FILES_END';
export const UPLOAD_TEMPLATE_FILES_END = 'files/UPLOAD_TEMPLATE_FILES_END';
export const DELETE_FILE_START = 'files/DELETE_FILE_START';
export const DELETE_FILE_END = 'files/DELETE_FILE_END';
export const COPY_FILE_START = 'files/COPY_FILE_START';
export const COPY_FILE_END = 'files/COPY_FILE_END';
export const INSERT_IMAGES = 'files/INSERT_IMAGES';
export const UPDATE_IMAGE_STATUS = 'files/UPDATE_IMAGE_STATUS';
export const INSERT_ACTIVITY_IMAGES = 'files/INSERT_ACTIVITY_IMAGES';
export const UPDATE_ACTIVITY_IMAGE_STATUS = 'files/UPDATE_ACTIVITY_IMAGE_STATUS';
export const INSERT_TEMPLATE_IMAGES = 'files/INSERT_TEMPLATE_IMAGES';
export const GET_FILES_TASK_COMMENT_LIST_START = 'files/GET_FILES_TASK_COMMENT_LIST_START';
export const GET_FILES_TASK_COMMENT_LIST_END = 'files/GET_FILES_TASK_COMMENT_LIST_END';
export const DELETE_FILE_TASK_COMMENT_START = 'files/DELETE_FILE_TASK_COMMENT_START';
export const DELETE_FILE_TASK_COMMENT_END = 'files/DELETE_FILE_TASK_COMMENT_END';
export const INSERT_COMMENT_IMAGES = 'files/INSERT_COMMENT_IMAGES';
export const UPDATE_COMMENT_IMAGE_STATUS = 'files/UPDATE_COMMENT_IMAGE_STATUS';

const initialState = {
  inprogress: false,
  error: false,
  list: {},
  activityList: {},
};

const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FILES_TASK_COMMENT_LIST_START: {
      const { commentId } = action;
      return {
        ...state,
        error: false,
        list: {
          ...state.list,
          [commentId]: { ...state.list[commentId] }
        },
        inprogress: true,
      };
    }

    case GET_FILES_TASK_COMMENT_LIST_END: {
      const { commentId } = action;
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [commentId]: { ...state.list[commentId], [commentId]: action.list }
        },
      };
    }

    case DELETE_FILE_TASK_COMMENT_START: {
      return {
        ...state,
        error: false,
        inprogress: true,
      };
    }

    case DELETE_FILE_TASK_COMMENT_END: {
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    }

    case INSERT_COMMENT_IMAGES: {
      const { images, commentId } = action;
      let imagesList = state.list[commentId] && state.list[commentId][commentId] ? state.list[commentId][commentId] : [];
      imagesList = imagesList.concat(images);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [commentId]: { ...state.list[commentId], [commentId]: imagesList }
        },
      };
    }

    case UPDATE_COMMENT_IMAGE_STATUS: {
      const { imageName, commentId } = action;
      const imagesList = state.list[commentId] && state.list[commentId][commentId] ? state.list[commentId][commentId] : [];
      const imgData = imagesList.filter((img) => img.name === imageName);
      imgData.length && (imgData[0].inProgress = false);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [commentId]: { ...state.list[commentId], [commentId]: imagesList }
        },
      };
    }

    case GET_FILES_LIST_START: {
      const { taskType } = action;
      return {
        ...state,
        error: false,
        list: {
          ...state.list,
          [taskType]: { ...state.list[taskType] }
        },
        inprogress: true,
      };
    }

    case GET_FILES_LIST_END: {
      const { taskId, taskType } = action;
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [taskType]: { ...state.list[taskType], [taskId]: action.list }
        },
      };
    }

    case GET_FILES_ACTIVITY_LIST_START: {
      const { activityId } = action;
      return {
        ...state,
        error: false,
        activityList: {
          ...state.activityList,
          [activityId]: { ...state.activityList[activityId] }
        },
        inprogress: true,
      };
    }

    case GET_FILES_ACTIVITY_LIST_END: {
      const { activityId, trackedId } = action;
      return {
        ...state,
        inprogress: false,
        error: action.error,
        activityList: {
          ...state.activityList,
          [activityId]: { ...state.activityList[activityId], [trackedId]: action.list }
        },
      };
    }

    case GET_TEMPLATE_FILES_LIST_START: {
      const { templateId } = action;
      return {
        ...state,
        error: false,
        list: {
          ...state.list,
          [templateId]: { ...state.list[templateId] }
        },
        inprogress: true,
      };
    }

    case GET_TEMPLATE_FILES_LIST_END: {
      const { taskId, templateId } = action;
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [templateId]: { ...state.list[templateId], [taskId]: action.list }
        },
      };
    }

    case UPLOAD_FILES_START: {
      return {
        ...state,
        error: false,
        inprogress: true,
      };
    }

    case UPLOAD_TEMPLATE_FILES_START: {
      return {
        ...state,
        error: false,
        inprogress: true,
      };
    }

    case UPLOAD_FILES_END: {
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    }

    case UPLOAD_TEMPLATE_FILES_END: {
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    }

    case DELETE_FILE_START: {
      return {
        ...state,
        error: false,
        inprogress: true,
      };
    }

    case DELETE_FILE_END: {
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    }

    case COPY_FILE_START: {
      return {
        ...state,
        error: false,
        inprogress: true,
      };
    }

    case COPY_FILE_END: {
      return {
        ...state,
        inprogress: false,
        error: action.error,
      };
    }

    case INSERT_IMAGES: {
      const { taskId, taskType, images } = action;
      let imagesList = state.list[taskType] && state.list[taskType][taskId] ? state.list[taskType][taskId] : [];
      imagesList = imagesList.concat(images);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [taskType]: { ...state.list[taskType], [taskId]: imagesList }
        },
      };
    }

    case INSERT_TEMPLATE_IMAGES: {
      const { templateId, taskId, images } = action;
      let imagesList = state.list[templateId] && state.list[templateId][taskId] ? state.list[templateId][taskId] : [];
      imagesList = imagesList.concat(images);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [templateId]: { ...state.list[templateId], [taskId]: imagesList }
        },
      };
    }

    case UPDATE_IMAGE_STATUS: {
      const { taskId, taskType, imageName } = action;
      const imagesList = state.list[taskType] && state.list[taskType][taskId] ? state.list[taskType][taskId] : [];
      const imgData = imagesList.filter((img) => img.name === imageName);
      imgData.length && (imgData[0].inProgress = false);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        list: {
          ...state.list,
          [taskType]: { ...state.list[taskType], [taskId]: imagesList }
        },
      };
    }

    case INSERT_ACTIVITY_IMAGES: {
      const { jobActivityId, taskActivityTrackerId, images } = action;
      let imagesList = state.activityList[jobActivityId] && state.activityList[jobActivityId][taskActivityTrackerId] ? state.activityList[jobActivityId][taskActivityTrackerId] : [];
      imagesList = imagesList.concat(images);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        activityList: {
          ...state.activityList,
          [jobActivityId]: { ...state.activityList[jobActivityId], [taskActivityTrackerId]: imagesList }
        },
      };
    }

    case UPDATE_ACTIVITY_IMAGE_STATUS: {
      const { jobActivityId, taskActivityTrackerId, imageName } = action;
      const imagesList = state.activityList[jobActivityId] && state.activityList[jobActivityId][taskActivityTrackerId] ? state.activityList[jobActivityId][taskActivityTrackerId] : [];
      const imgData = imagesList.filter((img) => img.name === imageName);
      imgData.length && (imgData[0].inProgress = false);
      return {
        ...state,
        inprogress: false,
        error: action.error,
        activityList: {
          ...state.activityList,
          [jobActivityId]: { ...state.activityList[jobActivityId], [taskActivityTrackerId]: imagesList }
        },
      };
    }
    default:
      return state;
  }
};

export default filesReducer;
