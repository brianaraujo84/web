import {
  GET_FILES_LIST_START,
  GET_FILES_LIST_END,
  GET_FILES_ACTIVITY_LIST_START,
  GET_FILES_ACTIVITY_LIST_END,
  GET_TEMPLATE_FILES_LIST_START,
  GET_TEMPLATE_FILES_LIST_END,
  INSERT_TEMPLATE_IMAGES,
  UPLOAD_FILES_START,
  UPLOAD_FILES_END,
  DELETE_FILE_START,
  DELETE_FILE_END,
  COPY_FILE_START,
  COPY_FILE_END,
  INSERT_IMAGES,
  UPDATE_IMAGE_STATUS,
  INSERT_ACTIVITY_IMAGES,
  UPDATE_ACTIVITY_IMAGE_STATUS,
  GET_FILES_TASK_COMMENT_LIST_START,
  GET_FILES_TASK_COMMENT_LIST_END,
  DELETE_FILE_TASK_COMMENT_START,
  DELETE_FILE_TASK_COMMENT_END,
  INSERT_COMMENT_IMAGES,
  UPDATE_COMMENT_IMAGE_STATUS,
} from '../reducers/files';

import {
  _getTaskImages,
  _deleteTaskImage,
  _copyTaskImages,
  _uploadTaskImages,
  _getTemplateTaskImages,
  _uploadTemplateTaskImages,
  _deleteTemplateTaskImage,
  _getJobActivityImages,
  _deleteJobActivityImage,
  _uploadJobActivityImages,
  _copyJobActivityImage,
  _uploadFileToDbx,
  _uploadFileToDbxV2,
  _getFilePathFromDbx,
  _deleteFileFromDbx,
  _uploadTaskCommentImages,
  _getTaskCommentImages,
  _deleteTaskCommentImage,
  _getTaskCommentFilePathFromDbx,
  _copyFileFromDbx,
} from '../../services/files';

export const getTaskCommentImages = (dispatch, taskId, taskType, commentId) => {
  dispatch({ type: GET_FILES_TASK_COMMENT_LIST_START, taskId, taskType, commentId });
  return _getTaskCommentImages(taskId, taskType, commentId)
    .then(response => {
      dispatch({
        taskId,
        taskType,
        commentId,
        type: GET_FILES_TASK_COMMENT_LIST_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        taskId,
        taskType,
        commentId,
        type: GET_FILES_TASK_COMMENT_LIST_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const deleteTaskCommentImage = (dispatch, taskId, type, name, commentId) => {
  dispatch({ type: DELETE_FILE_TASK_COMMENT_START });
  return _deleteTaskCommentImage(taskId, type, name, commentId)
    .then(response => {
      dispatch({
        type: DELETE_FILE_TASK_COMMENT_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: DELETE_FILE_TASK_COMMENT_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const insertCommentImages = (dispatch, taskId, taskType, images, commentId) => {
  return dispatch({
    type: INSERT_COMMENT_IMAGES,
    taskId,
    taskType,
    images,
    commentId,
  });
};

export const updateCommentImageStatus = (dispatch, taskId, taskType, imageName, commentId) => {
  return dispatch({
    type: UPDATE_COMMENT_IMAGE_STATUS,
    taskId,
    taskType,
    imageName,
    commentId,
  });
};

export const getTaskImages = (dispatch, taskId, taskType) => {
  dispatch({ type: GET_FILES_LIST_START, taskId, taskType });
  return _getTaskImages(taskId, taskType)
    .then(response => {
      dispatch({
        taskId,
        taskType,
        type: GET_FILES_LIST_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        taskId,
        taskType,
        type: GET_FILES_LIST_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const deleteTaskImage = (dispatch, taskId, type, name) => {
  dispatch({ type: DELETE_FILE_START });
  return _deleteTaskImage(taskId, type, name)
    .then(response => {
      dispatch({
        type: DELETE_FILE_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: DELETE_FILE_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const copyTaskImages = (dispatch, taskId, type, newTaskId, newType = type) => {
  dispatch({ type: COPY_FILE_START });
  return _copyTaskImages(taskId, type, newTaskId, newType)
    .then(response => {
      dispatch({
        type: COPY_FILE_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: COPY_FILE_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const uploadTaskCommentImages = (dispatch, files, taskId, type, commentId) => {
  dispatch({ type: UPLOAD_FILES_START });
  return _uploadTaskCommentImages(files, taskId, type, commentId)
    .then(response => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: true
      });
      throw error;
    });
};

export const uploadTaskImages = (dispatch, files, taskId, type, commentId) => {
  dispatch({ type: UPLOAD_FILES_START });
  return _uploadTaskImages(files, taskId, type, commentId)
    .then(response => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: true
      });
      throw error;
    });
};

// template images
export const getTemplateTaskImages = (dispatch, templateId, taskId) => {
  dispatch({ type: GET_TEMPLATE_FILES_LIST_START, templateId, taskId });
  return _getTemplateTaskImages(templateId, taskId)
    .then(response => {
      dispatch({
        templateId,
        taskId,
        type: GET_TEMPLATE_FILES_LIST_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        templateId,
        taskId,
        type: GET_TEMPLATE_FILES_LIST_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const uploadTemplateTaskImages = (dispatch, files, templateId, taskId, intendedFileName) => {
  dispatch({ type: UPLOAD_FILES_START });
  return _uploadTemplateTaskImages(files, templateId, taskId, intendedFileName)
    .then(response => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: true
      });
      throw error;
    });
};

export const deleteTemplateTaskImage = (dispatch, templateId, taskId) => {
  dispatch({ type: DELETE_FILE_START });
  return _deleteTemplateTaskImage(templateId, taskId)
    .then(response => {
      dispatch({
        type: DELETE_FILE_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: DELETE_FILE_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const insertTemplateImages = (dispatch, templateId, taskId, images) => {
  return dispatch({
    type: INSERT_TEMPLATE_IMAGES,
    templateId,
    taskId,
    images
  });
};

export const getJobActivityImages = (dispatch, activityId, trackedId) => {
  dispatch({ type: GET_FILES_ACTIVITY_LIST_START, activityId, trackedId });
  return _getJobActivityImages(activityId, trackedId)
    .then(response => {
      dispatch({
        activityId,
        trackedId,
        type: GET_FILES_ACTIVITY_LIST_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        activityId,
        trackedId,
        type: GET_FILES_ACTIVITY_LIST_END,
        list: [],
        error: true
      });
      throw error;
    });
};


export const deleteJobActivityImage = (dispatch, activityId, trackedId, name) => {
  dispatch({ type: DELETE_FILE_START });
  return _deleteJobActivityImage(activityId, trackedId, name)
    .then(response => {
      dispatch({
        type: DELETE_FILE_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: DELETE_FILE_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const uploadJobActivityImages = (dispatch, files, activityId, trackedId) => {
  dispatch({ type: UPLOAD_FILES_START });
  return _uploadJobActivityImages(files, activityId, trackedId)
    .then(response => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: UPLOAD_FILES_END,
        error: true
      });
      throw error;
    });
};

export const copyJobActivityImages = (dispatch, activityId, trackedId, newactivityId, newTrackedId) => {
  dispatch({ type: COPY_FILE_START });
  return _copyJobActivityImage(activityId, trackedId, newactivityId, newTrackedId)
    .then(response => {
      dispatch({
        type: COPY_FILE_END,
        list: response.list,
        error: false
      });
      return response;
    }, error => {
      dispatch({
        type: COPY_FILE_END,
        list: [],
        error: true
      });
      throw error;
    });
};

export const insertImages = (dispatch, taskId, taskType, images) => {
  return dispatch({
    type: INSERT_IMAGES,
    taskId,
    taskType,
    images
  });
};

export const updateImageStatus = (dispatch, taskId, taskType, imageName) => {
  return dispatch({
    type: UPDATE_IMAGE_STATUS,
    taskId,
    taskType,
    imageName
  });
};

export const insertActivityImages = (dispatch, jobActivityId, taskActivityTrackerId, images) => {
  return dispatch({
    type: INSERT_ACTIVITY_IMAGES,
    jobActivityId,
    taskActivityTrackerId,
    images
  });
};

export const updateActivityImageStatus = (dispatch, jobActivityId, taskActivityTrackerId, imageName) => {
  return dispatch({
    type: UPDATE_ACTIVITY_IMAGE_STATUS,
    jobActivityId,
    taskActivityTrackerId,
    imageName
  });
};

export const uploadFileToDbx = (folderName, fileName, data) => {
  return _uploadFileToDbx(folderName, fileName, data)
    .then(response => {
      return response;
    }, error => {
      throw error;
    });
};

export const uploadFileToDbxV2 = (folderName, fileName, data) => {
  return _uploadFileToDbxV2(folderName, fileName, data)
    .then(response => {
      return response;
    }, error => {
      throw error;
    });
};

export const getTaskCommentFilePathFromDbx = (folderName, fileName) => {
  return _getTaskCommentFilePathFromDbx(folderName, fileName)
    .then(response => {
      return response;
    }, error => {
      throw error;
    });
};

export const getFilePathFromDbx = (folderName, fileName) => {
  return _getFilePathFromDbx(folderName, fileName)
    .then(response => {
      return response;
    }, error => {
      throw error;
    });
};

export const deleteFileFromDbx = (folderName, fileName) => {
  return _deleteFileFromDbx(folderName, fileName)
    .then(response => {
      return response;
    }, error => {
      throw error;
    });
};

export const copyFileFromDbx = (fromFolderName, toFolderName) => {
  return _copyFileFromDbx(fromFolderName, toFolderName)
    .then(response => {
      return response;
    }, error => {
      throw error;
    });
};

