import axios from 'axios';
import remote from './remote';

export const _getTaskCommentImages = (taskId, type, commentId) => {
  return remote()
    .get(`/files/task/${type}/${taskId}/comments/${commentId}`)
    .then(resolved => resolved.data);
};

export const _deleteTaskCommentImage = (taskId, type, name, commentId) => {
  return remote()
    .delete(`/files/task/${type}/${taskId}/comments/${commentId}/${name}`)
    .then(resolved => resolved.data);
};

export const _getTaskImages = (taskId, type) => {
  return remote()
    .get(`/files/task/${type}/${taskId}`)
    .then(resolved => resolved.data);
};

export const _uploadTaskCommentImages = (files, taskId, type, commentId) => {
  return remote()
    .post('/files/comment', { files, taskId, type, commentId })
    .then(resolved => resolved.data);
};

export const _uploadTaskImages = (files, taskId, type, commentId) => {
  return remote()
    .post('/files/task', { files, taskId, type, commentId })
    .then(resolved => resolved.data);
};

export const _getTemplateTaskImages = (templateId, taskId) => {
  return remote()
    .get(`/files/template/${templateId}/${taskId}`)
    .then(resolved => resolved.data);
};

export const _uploadTemplateTaskImages = (files, templateId, taskId, intendedFileName) => {
  return remote()
    .post('/files/template/', { files, templateId, taskId, intendedFileName })
    .then(resolved => resolved.data);
};

export const _deleteTemplateTaskImage = (templateId, taskId) => {
  return remote()
    .delete(`/files/template/${templateId}/${taskId}`)
    .then(resolved => resolved.data);
};

export const _deleteTaskImage = (taskId, type, name) => {
  return remote()
    .delete(`/files/task/${type}/${taskId}/${name}`)
    .then(resolved => resolved.data);
};

export const _copyTaskImages = (taskId, type, newTaskId, newType = type) => {
  return remote()
    .post('/files/task-copy', { taskId, type, newTaskId, newType })
    .then(resolved => resolved.data);
};

export const _getJobActivityImages = (activityId, trackedId) => {
  return remote()
    .get(`/files/job-activity/${activityId}/${trackedId}`)
    .then(resolved => resolved.data);
};

export const _uploadJobActivityImages = (files, activityId, trackedId) => {
  return remote()
    .post('/files/job-activity', { files, activityId, trackedId })
    .then(resolved => resolved.data);
};

export const _deleteJobActivityImage = (activityId, trackedId, name) => {
  return remote()
    .delete(`/files/job-activity/${activityId}/${trackedId}/${name}`)
    .then(resolved => resolved.data);
};

export const _copyJobActivityImage = (activityId, trackedId, newActivityId, newTrackedId) => {
  return remote()
    .post('/files/task-copy', { activityId, trackedId, newActivityId, newTrackedId })
    .then(resolved => resolved.data);
};

export const _getSignedUrl = (folderName, fileName) => {
  return remote()
    .get(`/files/dbx/signed-url/${folderName}/${fileName}`)
    .then(resolved => resolved.data);
};

export const _getSignedUrlV2 = (path) => {
  return remote()
    .post('/files/dbx/signed-url', { path })
    .then(resolved => resolved.data);
};

export const _uploadFileToDbx = async (folderName, fileName, data) => {
  const config = { headers: { 'Content-Type': 'application/octet-stream' } };
  const { link } = await _getSignedUrl(folderName, fileName);
  return axios
    .post(link, data, config)
    .then(resolved => resolved.data);
};

export const _uploadFileToDbxV2 = async (path, data) => {
  const config = { headers: { 'Content-Type': 'application/octet-stream' } };
  const { link } = await _getSignedUrlV2(path);
  return axios
    .post(link, data, config)
    .then(resolved => resolved.data);
};

export const _getTaskCommentFilePathFromDbx = async (folderName, fileName) => {
  return remote()
    .get(`/files/dbx/comment-file-path/${folderName}/${fileName}`)
    .then(resolved => resolved.data);
};

export const _getFilePathFromDbx = async (folderName, fileName) => {
  return remote()
    .get(`/files/dbx/file-path/${folderName}/${fileName}`)
    .then(resolved => resolved.data);
};

export const _deleteFileFromDbx = async (folderName, fileName) => {
  return remote()
    .get(`/files/dbx/file-delete/${folderName}/${fileName}`)
    .then(resolved => resolved.data);
};

export const _copyFileFromDbx = async (fromFolderName, toFolderName) => {
  return remote()
    .get(`/files/dbx/file-copy/${fromFolderName}/${toFolderName}`)
    .then(resolved => resolved.data);
};

