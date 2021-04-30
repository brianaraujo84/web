import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';

import TaskImage from '../../shared/task-image';
import { useActionDispatch } from '../../../hooks';
import { deleteTaskImage, deleteJobActivityImage } from '../../../redux/actions/files';
import { TaskStatus } from '../../../constants';


const TaskImages = ({ task, isJob, loadImages, editable, editableActivityImages, hideActivityImages, updateTaskInNonGrpJobTasks }) => {
  // const { t } = useTranslation();
  const taskType = isJob ? 'predefined' : 'adhoc';
  // const getTaskImagesList = useActionDispatch(getTaskImages);
  const deleteTaskImg = useActionDispatch(deleteTaskImage);
  // const getTaskActivityImagesList = useActionDispatch(getJobActivityImages);
  const deleteTaskActivityImg = useActionDispatch(deleteJobActivityImage);
  const [isLastTaskImgDelete, setLastTaskImgDelete] = React.useState(false);
  const [isLastActivityImgDelete, setLastActivityImgDelete] = React.useState(false);

  // const profile = useSelector(state => state.profile.data);
  const taskImages = useSelector(state => {
    const isCloneTask = task.stage && TaskStatus.copy === task.stage.toLowerCase();
    const taskId = isCloneTask ? task.orginalTaskId : task.taskId;
    return state.files.list && state.files.list[taskType] && state.files.list[taskType][taskId] ? state.files.list[taskType][taskId] : [];
  });
  const taskActivityImages = useSelector(state => (
    state.files.activityList && state.files.activityList[task.jobActivityId]
      && state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] ? state.files.activityList[task.jobActivityId][task.taskActivityTrackerId] : []
  ));

  const deleteImage = async (imageName) => {
    try {
      await deleteTaskImg(task.taskId, taskType, imageName);
    } catch (error) {
      // 
    }
    loadImages();
  };

  const deleteActivityImage = async (imageName) => {
    setLastActivityImgDelete(taskActivityImages.length === 1 ? true : false);
    setLastTaskImgDelete(taskImages.length === 1 ? true : false);
    await deleteTaskActivityImg(task.jobActivityId, task.taskActivityTrackerId, imageName);
    loadImages();
  };

  return (
    <>
      <div className={`${taskImages.length && 'task-images'}`}>
        {taskImages && !!taskImages.length && !isLastTaskImgDelete && <h6><Trans i18nKey="task_imgs" /></h6>}
        {taskImages && taskImages.map((pic, idx) => (
          <TaskImage
            key={idx}
            url={pic.url}
            task={task}
            originUrl={pic.originUrl}
            editable={editable}
            inProgress={pic.inProgress}
            data-target="task-image"
            onDelete={() => deleteImage(pic.name)}
            updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
          />
        ))}

        {
          !hideActivityImages && !!taskActivityImages && !!taskActivityImages.length && !isLastActivityImgDelete && (
            <>
              <p className="mb-1"><Trans i18nKey="imgs_submitted" /> {task.assignee }</p>
              {taskActivityImages && taskActivityImages.map((pic, idx) => (
                <TaskImage
                  key={idx}
                  url={pic.url}
                  task={task}
                  originUrl={pic.originUrl}
                  editable={editableActivityImages}
                  inProgress={pic.inProgress}
                  data-target="task-image-activity"
                  onDelete={() => deleteActivityImage(pic.name)}
                  showImageScore={idx === 0}
                  updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                />
              ))}
            </>
          )
        }
      </div>
    </>
  );
};
TaskImages.propTypes = {
  task: PropTypes.object.isRequired,
  isJob: PropTypes.bool.isRequired,
  editable: PropTypes.bool,
  editableActivityImages: PropTypes.bool,
  loadImages: PropTypes.func.isRequired,
  hideActivityImages: PropTypes.bool,
  updateTaskInNonGrpJobTasks: PropTypes.func
};
TaskImages.defaultProps = {
  editable: false,
  editableActivityImages: false,
};
TaskImages.displayName = 'TaskImages';
export default TaskImages;
