import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { postConfidenceObject, postConfidenceManageObject } from '../../../redux/actions/object';
import { useActionDispatch, useModal } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { preloadImage } from '../../../utils';

import AIOffModal from './ai-off-modal';
import ConfirmDeleteModal from './confirm-delete-modal';
import ImageModal from './image-modal';

const Preview = styled.div`
  background-image: url(${({ url }) => url});
  transition: opacity 1s ease-out;
  ${({ visible }) => `opacity: ${visible ? 1 : 0};`}
`;

const Actions = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

export const AIButton = styled.button`
  appearance: none;
  border: none;
  margin: 0.5rem;
  width: 40px;
  height: 40px;
  background: url(${({ enabled }) => enabled ? '/assets/img/ai-on-blue.png' : '/assets/img/ai-off.png'}) no-repeat center;
  background-size: contain;
  transition: background .5s ease-out;
  outline: none !important;
`;

const OBJECT_MANAGE_TASK = 'manage/task';
const OBJECT_TASK_STATUS = 'taskStatus';
const OBJECT_TASK = 'task';

const TaskImage = ({
  editable,
  inProgress,
  url,
  originUrl,
  onDelete,
  task,
  showImageScore,
  updateTaskInNonGrpJobTasks
}) => {
  const { t } = useTranslation();
  const { locationId, taskTemplateId, templateId } = useParams();

  const [updatedTask, setUpdatedTask] = React.useState(task);
  const [showAIModal, setShowAIModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [hide, setHide] = React.useState(false);
  const [preloaded, setPreloaded] = React.useState(false);
  const [openImageModal, closeImageModal] = useModal(ImageModal);

  const aiStatus = updatedTask.aiEnabled || 0;

  React.useEffect(() => {
    setPreloaded(false);
    preloadImage(url, () => setPreloaded(true));
    preloadImage(originUrl, () => { });
  }, [url]);

  const toast = useActionDispatch(addToast);
  const enableAi = useActionDispatch(postConfidenceObject(OBJECT_MANAGE_TASK));
  const getTaskStatus = useActionDispatch(postConfidenceObject(OBJECT_TASK_STATUS, undefined, 'task/details'));
  const manageTask = useActionDispatch(postConfidenceManageObject(OBJECT_TASK));

  const {
    data: { locationUserRole },
  } = useSelector((state) => state.loc);

  const updateTaskStatus = async () => {
    const response = await getTaskStatus({
      templateId: templateId || taskTemplateId || updatedTask.templateId,
      taskId: updatedTask.taskId,
    });
    setUpdatedTask(response.taskDetails);
  };

  const handleRequireVerificationSelectItem = async (value) => {
    const data = {
      taskId: task.taskId,
      imageRequired: value,
    };
    await manageTask(data);
    updateTaskInNonGrpJobTasks(task.taskId, task.templateId);
  };

  const handleManageAiClick = async () => {
    const aiEnabled = aiStatus === 0 ? 1 : 0;
    const data = {
      locationId,
      templateId: templateId || taskTemplateId || updatedTask.templateId,
      taskId: updatedTask.taskId,
      aiEnabled,
    };
    await enableAi(data);
    updateTaskStatus();
    handleRequireVerificationSelectItem(aiEnabled);
    setShowAIModal(false);
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setHide(true);
    closeImageModal();
    await onDelete();
    toast(t('Image deleted.'));
  };

  const handleImageClick = React.useCallback(() => {
    openImageModal({
      url: originUrl || url,
      editable,
      showImageScore,
      task,
      aiStatus,
      handleShowAiPopUpModalClick,
      onDelete: () => setShowDeleteModal(true),
    });
  }, [openImageModal, originUrl, url, editable, showImageScore, task, aiStatus]);

  const handleShowAiModalClick = () => {
    if ((locationUserRole === 'Owner' || locationUserRole === 'Manager') && (task.stage === 'Open' || task.stage === 'Rework' || task.stage === 'Assigned' || task.stage === 'Accepted')) {
      setShowAIModal(true);
    }
  };

  const handleShowAiPopUpModalClick = () => {
    if ((locationUserRole === 'Owner' || locationUserRole === 'Manager') && (task.stage === 'Open' || task.stage === 'Rework' || task.stage === 'Assigned' || task.stage === 'Accepted')) {
      closeImageModal();
      setShowAIModal(true);
    }
  };

  if (hide) {
    return null;
  }

  return (
    <>
      <div className="task-image mb-2 position-relative" data-target="container">
        <Actions className="d-flex justify-content-between">
          {inProgress && (
            <button
              type="button"
              className="task-c-button p-1 btn rounded-circle btn-light border border-danger text-danger m-2"
              data-target="Uploading-image"
            >
              <i className="far fa-spinner fa-spin" aria-hidden="true" />
              <span className="sr-only"><Trans>Uploading Image</Trans></span>
            </button>
          )}
          {(editable && !inProgress && task.stage !== 'Review' && task.stage !== 'Completed') ? (
            <button
              type="button"
              className="task-c-button p-1 btn rounded-circle btn-light border border-danger text-danger m-2"
              data-target="delete-image"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="far fa-trash-alt" aria-hidden="true"></i>
              <span className="sr-only"><Trans>Delete Image</Trans></span>
            </button>
          ) : <span />}
          {!editable && <span></span>}
          {(showImageScore && task.imageScore !== undefined) ? <button className="task-c-button p-1 btn mt-2 mr-2 rounded-circle btn-success border border-white shadow" type="button">{task.imageScore}<span className="sr-only">AI score</span></button> :
            <AIButton enabled={!!aiStatus} onClick={handleShowAiModalClick} data-target="ai-off-image" />}
        </Actions>
        <div
          className="rounded border border-secondary"
          data-target="task-image"
          onClick={handleImageClick}
        >
          <Preview className="preview" url={url} visible={preloaded} />
        </div>
      </div>
      <AIOffModal show={showAIModal} aiEnabled={!!aiStatus} onConfirm={handleManageAiClick} onClose={() => setShowAIModal(false)} />
      <ConfirmDeleteModal
        show={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

TaskImage.propTypes = {
  editable: PropTypes.bool,
  inProgress: PropTypes.bool,
  url: PropTypes.string.isRequired,
  originUrl: PropTypes.string,
  onDelete: PropTypes.func,
  task: PropTypes.object,
  showImageScore: PropTypes.bool,
  updateTaskInNonGrpJobTasks: PropTypes.func
};
TaskImage.defaultProps = {
  editable: false,
  inProgress: false,
  originUrl: null,
  onDelete: () => { },
  showImageScore: false,
};
TaskImage.displayName = 'TaskImage';

export default TaskImage;
