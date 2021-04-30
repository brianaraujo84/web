const SETTINGS = require('./settings');

const paths = {};
paths.profile = (username) => `/${SETTINGS.ENVIRONMENT}/user/${username}`;
paths.task = (taskId, type) => `/${SETTINGS.ENVIRONMENT}/task/${(type === 'predefined' ? 'predefined' : 'adhoc')}/${taskId}`;
paths.taskComment = (taskId, type, commentId) => `/${SETTINGS.ENVIRONMENT}/task/${(type === 'predefined' ? 'predefined' : 'adhoc')}/${taskId}/comments/${commentId}`;
paths.jobActivity = (activityId, activityTrackerId) => `/${SETTINGS.ENVIRONMENT}/activity/${activityId}/${activityTrackerId}`;
paths.device = (deviceId, name) => `/${SETTINGS.ENVIRONMENT}/template/${deviceId}/virtualdevice/${name}`;
paths.logoTemplate = (templateId, name) => `/${SETTINGS.ENVIRONMENT}/template/${templateId}/logo/${name}`;
paths.templateImage = (templateId, taskId) => `/${SETTINGS.ENVIRONMENT}/template/${templateId}/${taskId}`;
paths.header = `/${SETTINGS.ENVIRONMENT}/header`;
paths.taskFilePath = (folderName, fileName) => `/${SETTINGS.ENVIRONMENT}/task-files/${folderName}/${fileName ? fileName : ''}`;
paths.taskFileActivityPath = (folderName, jaId) => `/${SETTINGS.ENVIRONMENT}/task-files/${folderName}-${jaId}/`;
paths.taskFilePathCopy = (folderName, fileName) => `/${SETTINGS.ENVIRONMENT}/task-files/${folderName}${fileName ? '/' + fileName : ''}`;
paths.wrapEnvName = (path) => `/${SETTINGS.ENVIRONMENT}/${path}`;

module.exports = paths;
