import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'react-form-dynamic';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import scrollIntoView from 'smooth-scroll-into-view-if-needed';
import { Draggable } from 'react-beautiful-dnd';

import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { DeleteModal } from '../../shared/modal';
import RequireImageVerificationModal from '../location-details/require-image-verification-modal';
import { MAX_ALLOWED_IMAGES } from '../../../constants';

import TaskImage from '../../shared/task-image';
import ZoneModal from './zone-modal';
import EllipsisMenu from '../../shared/ellipsis-menu';
import { insertTemplateImages, deleteTemplateTaskImage } from '../../../redux/actions/files';
import { toBase64Array, preloadImage, dataUrlToFile } from '../../../utils';
import * as URLS from '../../../urls';
import DescriptionEditor from '../../shared/description-editor';
import { descriptionFocused } from '../../../redux/actions/tasks-actions';

const TemplateTaskCard = ({
  task,
  order,
  templateId,
  onUpdate,
  onRemove,
  onUploadImages,
  setAllCustomeJobReviewsInListCompleted,
  numberofCustomTasksReviewed,
  numberofCustomTasksToReview,
  index,
  zoneTypes,
  isDragging,
  isDragDisabled,
}) => {
  const { t } = useTranslation();

  const taskImages = useSelector(state => {
    const taskId = task.taskId;
    return templateId && taskId && state.files.list && state.files.list[templateId] && state.files.list[templateId][taskId] ? state.files.list[templateId][taskId] : [];
  });

  const [showTaskDetails, setShowTaskDetails] = React.useState(false);
  const [showEditTaskDescription, setShowEditTaskDescription] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEditTitle, setShowEditTitle] = React.useState(false);
  const [values, setValues] = React.useState({ task: '', taskDescription: '' });
  const [showZoneModal, setShowZoneModal] = React.useState(false);
  const [openMenuPopup, setOpenMenuPopup] = React.useState(false);
  const [preloadTplUrl, setPreloadedTemplateImageObj] = React.useState(false);
  const [imageUpdated, setImageUploaded] = React.useState(false);
  const [showRequireImageVerificationModal, setShowRequireImageVerificationModal] = React.useState(false);
  const [imageRequired, setImageRequired] = React.useState(0);
  const [editorHtml, setEditorHtml] = React.useState(task.taskDescription);

  const cardRef = React.useRef(null);
  const inputTaskRef = React.useRef();
  const inputDescRef = React.useRef();
  const imageInputRef = React.useRef();

  const toast = useActionDispatch(addToast);
  const addImageToList = useActionDispatch(insertTemplateImages);
  const deleteTemplateImage = useActionDispatch(deleteTemplateTaskImage);
  const desFocused = useActionDispatch(descriptionFocused);

  const handleEditorChange = (html) => {
    setEditorHtml(html);
  };

  const handleRemove = async () => {
    setShowDeleteModal(false);
    await onRemove(task);
    toast(t('task_del'));
  };

  const handleAddImageButtonClick = React.useCallback(() => {
    imageInputRef.current.click();
    scrollToVisibility();
    setShowTaskDetails(true);
  }, []);

  const handleAddScreenshotButtonClick = React.useCallback(() => {
    if (window.electron) {
      window.electron.send('take-partial-screenshot', task.taskId);
    }
  }, []);

  const handleRequireVerificationClick = () => {
    setShowRequireImageVerificationModal(true);
  };

  const handleRequireVerificationSelectItem = async (value) => {
    const data = {
      ...task,
      imageRequired: value,
    };
    setShowRequireImageVerificationModal(false);
    onUpdate(data);
  };

  const [templateImageUrl, templateOriginImageUrl] = React.useMemo(() => {
    if (templateId && task && task.taskId) {
      const tplUrl = URLS.TEMPLATE_IMAGE_THUMB(templateId, task.taskId);
      const tplOriginUrl = URLS.TEMPLATE_IMAGE(templateId, task.taskId);
      preloadImage(tplUrl, () => setPreloadedTemplateImageObj(true));
      return [
        tplUrl,
        tplOriginUrl,
      ];
    }
    return [];
  }, [task, templateId]);

  const handleImageInputChange = React.useCallback(async ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }
    const imageFile = files[0];
    const values = await toBase64Array([imageFile]);
    const images = values.reduce((acc, cur) => {
      acc.push({ ...cur.value, imageName: `image_${Date.now()}.${cur.value.extension}` });
      return acc;
    }, []);
    const insertImages = [];
    images.forEach((img) => {
      const imgContent = `data:image/${img.extension};base64,${img.content}`;
      const imgTempContent = `data:image/${img.extension};base64,${img.tempContent}`;
      insertImages.push({
        name: img.imageName,
        originUrl: imgContent,
        url: imgTempContent,
        inProgress: true
      });
    });
    addImageToList(templateId, task.taskId, insertImages);
    scrollToVisibility();
    await onUploadImages({taskId: task.taskId, images});
    setImageUploaded(true);
    // loadImages();
  }, [task.taskId]);

  const handleChange = ({ target: { name, value } }) => {
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleSaveTitle = async () => {
    const { taskName } = values;
    
    const data = {
      ...task,
      taskName: taskName,
    };
    
    await onUpdate(data);
    setShowEditTitle(false);
    task.taskName = taskName;
    toast(t('title_upd'));
  };

  const handleShowEditDescription = () => {
    setShowTaskDetails(true);
    setShowEditTaskDescription(true);
  };

  const handleSaveDescription = async () => {
    if (!editorHtml) {
      setShowEditTaskDescription(false);
      return;
    }
    const data = {
      ...task,
      taskDescription: editorHtml,
    };

    onUpdate(data);
    setShowEditTaskDescription(false);
    task.taskDescription = editorHtml;
    toast(t('desc_updated'));
  };

  const handleShowTaskDetails = () => {
    setShowTaskDetails(show => !show);
    scrollToVisibility();
  };

  const scrollToVisibility = () => {
    setTimeout(() => {
      scrollIntoView(cardRef.current, {
        block: 'end',
        behavior: 'smooth'
      });
    },100);
  };

  const handleAssociateZoneToTask = async (selectedZoneId) => {
    const data = {
      ...task,
      zoneTypeId: selectedZoneId,
    };
    await onUpdate(data);
    setShowZoneModal(false);
    toast(t('task_assoc'));
  };

  const handleRemoveClick = () => {
    setShowDeleteModal(true);
  };

  const removeImage = async () => {
    await deleteTemplateImage(templateId, task.taskId);
  };

  const zoneTypeIdNameFinder = (zoneTypeId) => {
    const zone = zoneTypes.filter(zone => zone.zoneTypeId === zoneTypeId);
    return zone[0]?.zoneType;
  };

  React.useEffect(() => {
    if (task) {
      const { taskName = '', taskDescription = '' } = task;
      setValues({ taskName, taskDescription });
    }
  }, [task]);

  React.useEffect(() => {
    if (showEditTaskDescription) {
      inputDescRef.current && inputDescRef.current.focus();
    }
  }, [showEditTaskDescription]);

  React.useEffect(() => {
    if ((numberofCustomTasksReviewed === numberofCustomTasksToReview) && numberofCustomTasksReviewed !== 0 && setAllCustomeJobReviewsInListCompleted) {
      setAllCustomeJobReviewsInListCompleted(true);
    }
  },[numberofCustomTasksReviewed]);

  React.useEffect(() => {
    if (task) {
      setImageRequired(task.imageRequired || 0);
    }
  }, [task]);

  React.useEffect(() => {
    const handleScreenshot = (taskId, base64Screenshot) => {
      if (task.taskId === taskId) {
        dataUrlToFile(base64Screenshot, `image_${Date.now()}.png`).then((file) => {
          handleImageInputChange({ target: { files: [file] } });
          scrollToVisibility();
          setShowTaskDetails(true);
        });
      }
    };

    let unsubscribe;

    if (window.electron) {
      unsubscribe = window.electron.receive('partial-screenshot-taken', handleScreenshot);
    }
    return () => {
      if (window.electron && unsubscribe) {
        unsubscribe();
      }
    };
  }, [task.taskId]);

  const handleEditorDiscard = () => {
    setShowEditTaskDescription(false);
  };

  return (
    <Draggable draggableId={task?.taskId?.toString()} index={order} isDragDisabled={isDragDisabled}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={classnames(['task alert alert-secondary p-0', isDragging && 'dragging' ])} ref={cardRef}>
            <a
              className='text-center task-status justify-content-between d-flex text-white rounded-left'
              {...provided.dragHandleProps}
            >
              {!isDragDisabled && <img className='task-drag-indicator' src='/assets/img/drag-dots-top.png' width='40'  />}
              <span className='p-2 h-100'>Step {index + 1}</span>
              {!isDragDisabled && <img className='task-drag-indicator' src='/assets/img/drag-dots-bottom.png' width='40'  />}
            </a>
            <div className='p-2'>
              <p className='mb-2'>
                <span className='badge badge-primary zone-badge' data-toggle='modal' data-target='#associate-zone-edit' onClick={() => setShowZoneModal(true)}>{zoneTypeIdNameFinder(task.zoneTypeId)}</span>
              </p>
              
              {!showEditTitle 
                ? <h5 className='task-title alert-heading mb-1' onClick={()=>{setShowEditTitle(true);}}>{task.taskName}</h5>
                :(
                  <div className='task-title-edit'>
                    <label className='sr-only'>Title</label>
                    <input
                      type='text'
                      className='form-control mb-2'
                      placeholder={t('task name')}
                      value={values.taskName}
                      name='taskName'
                      onChange={handleChange}
                      ref={inputTaskRef}
                      maxLength='100'
                    />
                    <div className='text-right actions'>
                      <Button
                        type='button'
                        variant='outline-primary'
                        className='task-c-button p-1 btn rounded-circle'
                        data-target='discard-title-button'
                        onClick={() => {
                          setShowTaskDetails(false);
                          setShowEditTitle(false);
                        }}
                      >
                        <i className='far fa-times' aria-hidden='true'></i><span className='sr-only'><Trans i18nKey='discard' /></span>
                      </Button>
                      <Button
                        type='button'
                        variant='primary'
                        className='task-c-button p-1 ml-2 btn rounded-circle'
                        data-target='save-title-button'
                        onClick={handleSaveTitle}
                        disabled={!values.taskName}
                      >
                        <i className='fas fa-check' aria-hidden='true'></i><span className='sr-only'><Trans i18nKey='save' /></span>
                      </Button>
                    </div>
                  </div>
                )}
              <div
                className={classnames(['task-detail-overflow collapse', showTaskDetails && 'show' ])}
                id='taskDetail1'
              >
                { (task.taskDescription || showEditTaskDescription) && <div className='task-description'>
                  <div className='task-subtitle'>
                    {!showEditTaskDescription 
                      ? <div className='view d-flex' onClick={handleShowEditDescription}>
                        <i className='fas fa-align-left pt-1' aria-hidden='true'></i><span className='sr-only'>Task Description</span>
                        <div dangerouslySetInnerHTML={{__html: editorHtml}} className='small line-height-1 ml-2 mb-0 task-description' />
                      </div>
                      : <DescriptionEditor
                        onDiscard={handleEditorDiscard}
                        onSave={handleSaveDescription}
                        onChange={handleEditorChange}
                        editedDescription={editorHtml}
                        desFocused={desFocused}
                        inputDescRef={inputDescRef}
                      />}
                  </div>
                </div> }
                {
                  imageUpdated && (
                    <div className='task-images pt-3'>
                      <h6><Trans i18nKey='task_imgs' /></h6>
                      <TaskImage
                        url={`/api/files/template/${templateId}/${task.taskId}/6`}
                        originUrl={`/api/files/template/${templateId}/${task.taskId}`}
                        data-target='task-image'
                        editable
                        task={task}
                        onDelete={removeImage}
                      />
                    </div>
                  )
                }
                {
                  !!templateImageUrl && !!preloadTplUrl && (
                    <div className='task-images pt-3'>
                      <h6><Trans i18nKey='task_imgs' /></h6>
                      <TaskImage
                        url={templateImageUrl}
                        originUrl={templateOriginImageUrl}
                        data-target='task-image'
                        editable
                        task={task}
                        onDelete={removeImage}
                      />
                    </div>
                  )
                }
              </div>
              {!!imageRequired && (
                <div className='d-flex small mb-2 mt-2 align-items-center'>
                  <span>
                    <i className='fas fa-check-square lineitem-icon' aria-hidden='true'></i>
                    <span className='sr-only'>{`${imageRequired === 1 ? 'Image' : 'Screenshot'} Verification`}</span>
                  </span>
                  {
                    imageRequired === 1
                      ? <Trans i18nKey='photo_required_for_verification' defaults='Photo required for verification' />
                      : <Trans i18nKey='screenshot_required_for_verification' defaults='Screenshot required for verification' />
                  }
                </div>
              )}
              <hr className='my-2' />
              <div className='text-right'>
                <button
                  type='button'
                  className='task-c-button p-1 ml-1 btn rounded-circle btn-outline-primary'
                  data-toggle='modal'
                  data-target='#delete-task'
                  onClick={handleRemoveClick}
                >
                  <i className='far fa-trash-alt' aria-hidden='true'></i>
                  <span className='sr-only'>Delete Task</span>
                </button>
                <button
                  type='button'
                  className='task-c-button p-1 ml-1 btn rounded-circle btn btn-outline-primary'
                  onClick={() => setOpenMenuPopup(!openMenuPopup)}
                >
                  <i className='fas fa-ellipsis-v' aria-hidden='true'></i>
                  <span className='sr-only'>Menu</span>
                </button>
                {openMenuPopup && <EllipsisMenu
                  handler={setOpenMenuPopup}
                  isDescriptionActive={true}
                  handleShowEditDescription={handleShowEditDescription}
                  isAddImagesActive={taskImages.length < MAX_ALLOWED_IMAGES}
                  handleAddImageButtonClick={handleAddImageButtonClick}
                  isAddScreenshotsActive={window.electron && taskImages.length < MAX_ALLOWED_IMAGES}
                  handleAddScreenshotButtonClick={handleAddScreenshotButtonClick}
                  isCopyActive={false}
                  isAssociateActive={false}
                  isRequireVerificationActive
                  handleRequireVerificationClick={handleRequireVerificationClick}
                />}
                <button
                  type='button'
                  className='task-c-button p-1 ml-1 btn rounded-circle btn-outline-primary task-detail-toggle'
                  data-toggle='collapse'
                  href='#taskDetail1'
                  aria-expanded='false'
                  aria-controls='taskDetail1'
                  onClick={handleShowTaskDetails}
                >
                  <i className='fas fa-chevron-down' aria-hidden='true'></i>
                  <span className='sr-only'>View Detail</span>
                </button>
              </div>
            </div>
          </div>
          <input
            type='file'
            name='image'
            accept='image/*'
            capture='environment'
            style={{ display: 'none' }}
            ref={imageInputRef}
            onChange={handleImageInputChange}
          />
          <ZoneModal
            onClose={() => setShowZoneModal(false)}
            show={showZoneModal}
            onAssociate={handleAssociateZoneToTask}
            zoneTypeId={task?.zoneTypeId?.toString() || 16}
            zoneTypes={zoneTypes}
          />
          <DeleteModal
            data-target='delete-modal'
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleRemove}
            show={showDeleteModal}
            title={t('del_task')}
            messageText={t('del_task_prmt')}
          />
          <RequireImageVerificationModal
            show={showRequireImageVerificationModal}
            onClose={() => setShowRequireImageVerificationModal(false)}
            onSelectItem={handleRequireVerificationSelectItem}
            selectedItem={imageRequired}
          />
        </div>)}
    </Draggable>
  );

};

TemplateTaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  order: PropTypes.number,
  templateId: PropTypes.string,
  taskSummary: PropTypes.object,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
  onUploadImages: PropTypes.func,
  index: PropTypes.number,
  setAllCustomeJobReviewsInListCompleted: PropTypes.func,
  setNumberofCustomTasksReviewed: PropTypes.func,
  numberofCustomTasksReviewed: PropTypes.number,
  numberofCustomTasksToReview: PropTypes.number,
  customJobCompleted: PropTypes.bool,
  DragHandle: PropTypes.any,
  zoneTypes: PropTypes.array,
  isDragging: PropTypes.bool,
  isDragDisabled: PropTypes.bool,
};

TemplateTaskCard.defaultProps = {
  taskSummary: {},
  zoneTypes: [],
  isDragging: false
};

TemplateTaskCard.displayName = 'TemplateTaskCard';
export default TemplateTaskCard;
