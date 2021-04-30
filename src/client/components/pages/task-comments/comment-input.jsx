import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import { useActionDispatch } from '../../../hooks';
import { postTaskCommunicationObject } from '../../../redux/actions/object';
import { addToList } from '../../../redux/actions/objects';
import ContactsPopup from './contacts-popup';
import TaskCommentAttachmentModal from './task-comment-attachment-modal';
import { uploadFileToDbxV2, uploadTaskCommentImages, insertCommentImages, updateCommentImageStatus } from '../../../redux/actions/files';
import { toBase64Array } from '../../../utils';
import CommentImageThumbnail from './comment-image-thumbnail';

const OBJECT_COMMENT = 'comment';
const OBJECT_COMMENTS = 'comments';

let showThumbnails = false;

const CommentInput = ({ scrollToBottom, task, fileArray, setFileArray, locationId }) => {
  const { t } = useTranslation();

  const taskFileInputRef = React.useRef();
  const inputRef = React.useRef(null);
  const imageInputRef = React.useRef();

  const [showContactsPopup, setShowContactsPopup] = React.useState(false);
  const [contactFilter, setcontactFilter] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [showTaskCommentAttachmentModal, setShowTaskCommentAttachmentModal] = React.useState(false);
  const [taskFilePathError, setTaskFilePathError] = React.useState(false);
  const [imageArray, setImageArray] = React.useState([]);
  const [thumbnailArray, setThumbnailArray] = React.useState([]);

  const contacts = useSelector(state => state.contacts?.items);
  const postComment = useActionDispatch(postTaskCommunicationObject(OBJECT_COMMENT));
  const addComment = useActionDispatch(addToList(OBJECT_COMMENTS));
  const uploadImages = useActionDispatch(uploadTaskCommentImages);
  const addImageToList = useActionDispatch(insertCommentImages);
  const updateImageOnList = useActionDispatch(updateCommentImageStatus);

  const profile = useSelector(state => state.profile.data);

  const getCurrentTZName = () => {
    return Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  
  const fields = [
    {
      name: 'comment',
      validations: [
        {
          rule: 'required',
        }
      ],
    },
  ];

  const onSubmit = async () => {
    showThumbnails = false;
    const comment = formik.values.comment;
    formik.handleReset();
    addComment(-1, {
      userName: profile.email.replace('@', '$'),
      comment,
      user: `${profile.firstName} ${profile.lastName}`,
      currentUser: true,
      tempUrlArray: thumbnailArray,
      tempFileArray: fileArray,
    });
    const response = await postComment({ taskId: task.taskId, comment, notifyUsername: tags, timezone: getCurrentTZName(), locationId });
    if (response) {
      addImageToList(task.taskId, 'adhoc', thumbnailArray, response.commentId);
      uploadImages(imageArray, task.taskId, 'adhoc', response.commentId);
      imageArray.forEach(image => {
        updateImageOnList(task.taskId, 'adhoc', image.imageName, response.commentId);
      });
      fileArray.forEach(file => {
        const path = preparePaths(task.taskId, file.fileType, file.fileName, response.commentId);
        uploadFileToDbxV2(path.fullPath, file.taskFile);
      });
    }

    setTags([]);
    setImageArray([]);
    setThumbnailArray([]);
    // setFileArray([]);
    scrollToBottom();
    formik.handleReset();
  };

  const formik = useForm({ fields, onSubmit });

  const handleContactSelect = (contact) => {
    const splitText = formik.values.comment.split('@');

    const contactName = `${contact.firstName} ${contact.lastName}`;
    const userName = `${contact.userName} `;
    if (contact.firstName) {
      formik.setFieldValue('comment', `${splitText[0]} ${contactName}`);
    } else if (contact.userName) {
      formik.setFieldValue('comment', `${splitText[0]} ${userName}`);
    }
    setTags([ ...tags, contact?.userName ]);
    setShowContactsPopup(false);
    setcontactFilter('');
    inputRef.current.focus();
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (value.endsWith('@')) {
      setShowContactsPopup(true);
    } else if (value.endsWith('\n')) {
      return;
    }
    if (showContactsPopup) {
      const splitText = formik.values.comment.split('@');
      setcontactFilter(splitText[1]);
    }
    formik.setFieldValue('comment', value);
  };

  const removedAtSymbolFromComment = () => {
    setShowContactsPopup(false);
    const splitText = formik.values.comment.split('@');
    formik.setFieldValue('comment', `${splitText[0]}`);
  };

  const handleAddImageButtonClick = () => {
    imageInputRef.current.click();
  };
  
  const preparePaths = (taskId, fileType, fileNameStr, commentId) => {
    const folderName = `${taskId}${commentId}-comment`;
    const fileName = `${fileNameStr || taskId}${fileType ? '.' + fileType : ''}`;
    const fullPath = `task-files/${folderName}/${fileName}`;
    return {folderName, fileName, fullPath};
  };

  const handleTaskFileClick = React.useCallback(() => {
    taskFileInputRef.current.click();
  }, []);

  const handleImageInputChange = React.useCallback(async ({ target: { files } }) => {
    setShowTaskCommentAttachmentModal(false);
    showThumbnails = true;
    if (files.length === 0) {
      return;
    }

    const imageFile = files[0];
    imageInputRef.current.value = null;
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
    setThumbnailArray([ ...thumbnailArray, insertImages[0] ]);
    setImageArray([ ...imageArray, images[0] ]);
  }, [task.taskId, uploadImages]);

  const handleTaskFileInputChange = async ({ target: { files } }) => {
    setShowTaskCommentAttachmentModal(false);
    showThumbnails = true;
    if (files.length === 0) {
      return;
    }

    const MB_50 = 50000000;
    const taskFile = files[0];
    if (taskFile.size > MB_50) {
      setTaskFilePathError(true);
      return;
    } else {
      setTaskFilePathError(false);
    }
    taskFileInputRef.current.value = null;
    const fileType = taskFile.name.substr(taskFile.name.lastIndexOf('.') + 1) || taskFile.type.split('/')[1];
    const fileName = taskFile.name.substr(0, taskFile.name.lastIndexOf('.'));

    setFileArray([ ...fileArray, { fileType, fileName, taskFile } ]);
  };
  
  const removePreloadedImage = (index) => {
    thumbnailArray.splice(index, 1);
    imageArray.splice(index, 1);

    setThumbnailArray(thumbnailArray);
    setImageArray(imageArray);
  };

  const removePreloadedFile = (index) => {
    fileArray.splice(index, 1);

    setFileArray(fileArray);
  };

  return (
    <>
      <div id="comment-input-container" className="fixed-bottom bg-light shadow border-top px-3 pt-3 pb-2">
        <ContactsPopup 
          contacts={contacts} 
          setShowContactsPopup={setShowContactsPopup}  
          showContactsPopup={showContactsPopup} 
          setcontactFilter={setcontactFilter} 
          contactFilter={contactFilter} 
          handleContactSelect={handleContactSelect} 
          removedAtSymbolFromComment={removedAtSymbolFromComment} 
        />
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="container px-0 px-md-3">
            <div className='d-flex mb-2'>
              <div className="pt-2 mr-3">
                <a className="text-secondary" data-toggle="modal" data-target="#add-attachment" onClick={() => setShowTaskCommentAttachmentModal(true)}>
                  <i className="far fa-lg fa-paperclip" aria-hidden="true" />
                </a>
              </div>
              <div className="w-100 pr-1">
                <textarea
                  id="comment-input"
                  name="comment"
                  className="form-control"
                  rows="1"
                  style={{ resize: 'none' }}
                  placeholder={t('Add comment to task...')}
                  onChange={handleChange}
                  value={formik.values.comment}
                  data-target="comment-input"
                  ref={inputRef}
                  onKeyPress={event => { if (event.key === 'Enter' && !event.shiftKey) { formik.handleSubmit(); }}}
                />
              </div>
              <div className="pl-2 pt-2">
                <Button
                  id="send"
                  type="submit"
                  variant="link"
                  className="p-0"
                  disabled={!formik.isValid || formik.isSubmitting || !formik.values.comment}
                >
                  <i className="fas fa-lg fa-paper-plane" aria-hidden="true"></i>
                </Button>
              </div>
            </div>
            <div className="d-flex mt-3">
              {taskFilePathError && <div className="d-flex small mt-2 mb-1"><span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> File size exceeds maximum limit 50 MB.</span></div>}
              {showThumbnails && thumbnailArray && thumbnailArray.map((image, index) => (
                <CommentImageThumbnail key={index} url={image.url} originUrl={image.originUrl} removePreloadedImage={removePreloadedImage} index={index} />
              ))}
              {showThumbnails && fileArray && fileArray.map((_, index) => (
                <CommentImageThumbnail isFile={true} key={index} url={'/assets/img/file-attachment.png'} removePreloadedImage={removePreloadedFile} index={index} />
              ))}
            </div>
          </div>
        </form>
      </div>

      <TaskCommentAttachmentModal 
        onClose={() => setShowTaskCommentAttachmentModal(false)}
        show={showTaskCommentAttachmentModal}
        handleTaskFileClick={fileArray.length < 3 ? handleTaskFileClick : undefined}
        handleAddImageButtonClick={imageArray.length < 3 ? handleAddImageButtonClick : undefined}
        imageLimitReached={imageArray.length >= 3}
        fileUploadLimitReached={fileArray.length >= 3}
        
      />

      <input
        type="file"
        name="taskFile"
        accept="image/*, application/pdf"
        style={{ display: 'none' }}
        ref={taskFileInputRef}
        onChange={handleTaskFileInputChange}
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={imageInputRef}
        onChange={handleImageInputChange}
      />
    </>
  );
};

CommentInput.propTypes = {
  scrollToBottom: PropTypes.func,
  setShowContactsPopup: PropTypes.func,
  task: PropTypes.object,
  fileArray: PropTypes.array,
  setFileArray: PropTypes.func,
  locationId: PropTypes.string,
};

CommentInput.defaultProps = {
  scrollToBottom: () => {},
};

CommentInput.displayName = CommentInput;
export default CommentInput;
