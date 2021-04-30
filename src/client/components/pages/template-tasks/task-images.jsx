import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';

import TaskImage from '../../shared/task-image';
import { useActionDispatch } from '../../../hooks';
import { deleteTemplateTaskImage } from '../../../redux/actions/files';


const TaskImages = ({ templateId, task, images, loadImages, editable }) => {
  const deleteTemplateTaskImg = useActionDispatch(deleteTemplateTaskImage);

  const deleteImage = async (imageName) => {
    await deleteTemplateTaskImg(templateId, task.taskId, imageName);
    loadImages();
  };

  return (
    <>
      <div className="task-images pt-3">
        {images && !!images.length && <p className="mb-1"><Trans i18nKey="task_imgs" /></p>}
        {images && images.map((pic, idx) => (
          <TaskImage
            key={idx}
            url={pic.url}
            task={task}
            originUrl={pic.originUrl}
            editable={editable}
            // inProgress={pic.inProgress}
            data-target="task-image"
            onDelete={() => deleteImage(pic.name)}
          />
        ))}
      </div>
    </>
  );
};
TaskImages.propTypes = {
  templateId: PropTypes.string.isRequired,
  task: PropTypes.object.isRequired,
  images: PropTypes.array,
  isJob: PropTypes.bool.isRequired,
  editable: PropTypes.bool,
  // editableActivityImages: PropTypes.bool,
  loadImages: PropTypes.func.isRequired,
};
TaskImages.defaultProps = {
  editable: false,
  images: [],
  // editableActivityImages: false,
};
TaskImages.displayName = 'TaskImages';
export default TaskImages;
