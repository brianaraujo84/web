import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-form-dynamic';
import { useActionDispatch } from '../../../hooks';
import { getCommunicationObjectsList, resetList, addToList } from '../../../redux/actions/objects';
import {
  uploadFileToDbxV2,
  uploadTaskCommentImages,
  insertCommentImages,
  updateCommentImageStatus,
  getTaskCommentImages,
  getTaskCommentFilePathFromDbx,
} from '../../../redux/actions/files';
import { postTaskCommunicationObject } from '../../../redux/actions/object';
import { COMMENT_ADDED_EVENT } from '../../../constants';
import { toBase64Array, toBase64, preLoadImageV2 } from '../../../utils';
import * as URLS from '../../../urls';
import Comment from './comment';
import CommentImageThumbnail from './comment-image-thumbnail';
import CommentFileThumbnail from './comment-file-thumbnail';
import useIsMobile from '../../../hooks/is-mobile';

const OBJECT_COMMENT = 'comment';
const OBJECT_COMMENTS = 'comments';

const COMMENTS_LIMIT = 5;
let maxCommentsShown;

let interval;

const styles = {
  filesContainer: {
    overflowX: 'scroll',
    overflowН: 'auto',
  },
  filesSubContainer: {
    width: 'max-content',
  },
};

const TaskComments = ({ activeComment, onBack, onClose, fromBack }) => {
  const {
    locationId,
    locationName,
    templateId,
    task,
    taskId,
  } = activeComment;

  const history = useHistory();
  const isMobile = useIsMobile();

  const [fileArray, setFileArray] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [initialState, setInitialState] = React.useState(false);
  const [showThumbnails, setShowThumbnails] = React.useState(false);
  const [thumbnailArray, setThumbnailArray] = React.useState([]);
  const [imageArray, setImageArray] = React.useState([]);
  const [taskFilePathError, setTaskFilePathError] = React.useState(false);
  const [taskFiles, setTaskFiles] = React.useState({});

  const inputRef = React.useRef();
  const taskFileInputRef = React.useRef();
  const imageInputRef = React.useRef();

  const uploadImages = useActionDispatch(uploadTaskCommentImages);
  const addImageToList = useActionDispatch(insertCommentImages);
  const updateImageOnList = useActionDispatch(updateCommentImageStatus);
  const getTaskCommentImagesList = useActionDispatch(getTaskCommentImages);

  const profile = useSelector(state => state.profile.data);

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

  const {
    items: comments,
    total: totalComments,
    inprogress,
  } = useSelector(state => state.comments);
  const { t } = useTranslation();

  const getCommentsByTaskId = useActionDispatch(
    getCommunicationObjectsList(OBJECT_COMMENTS, undefined, undefined, `task/${taskId}`, '/comment/list', undefined, 'totalCount')
  );
  const addComment = useActionDispatch(addToList(OBJECT_COMMENTS));

  const clearList = useActionDispatch(resetList(OBJECT_COMMENTS));
  const postComment = useActionDispatch(postTaskCommunicationObject(OBJECT_COMMENT));

  const fetchComments = (start, limit, firstFetch = false, append = false, prepend = false, readonly = false) => {
    return getCommentsByTaskId(
      { start, limit },
      '',
      {},
      '',
      firstFetch,
      append,
      prepend,
      readonly,
    );
  };

  const getCurrentTZName = () => {
    return Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const fetchMoreComments = async () => {
    await fetchComments(
      comments.length,
      COMMENTS_LIMIT,
      false,
      true,
      false,
    );
  };

  const preparePaths = (taskId, fileType, fileNameStr, commentId) => {
    const folderName = `${taskId}${commentId}-comment`;
    const fileName = `${fileNameStr || taskId}${fileType ? '.' + fileType : ''}`;
    const fullPath = `task-files/${folderName}/${fileName}`;
    return { folderName, fileName, fullPath };
  };

  const onSubmit = async (values) => {
    const { comment } = values;
    formik.handleReset();
    const commentId = 'new' + Math.floor(Math.random() * 1000);
    addComment(-1, {
      commentId,
      userName: profile.email.replace('@', '$'),
      comment,
      user: `${profile.firstName} ${profile.lastName}`,
      currentUser: true,
      tempUrlArray: [],
      tempFileArray: [],
      tmpImgs: thumbnailArray,
    });
    setShowThumbnails(false);
    const response = await postComment({ taskId: taskId, comment, notifyUsername: tags, timezone: getCurrentTZName(), locationId });
    if (response) {
      if (interval) {
        window.clearInterval(interval);
      }
      addImageToList(taskId, 'adhoc', thumbnailArray, response.commentId);
      await uploadImages(imageArray, taskId, 'adhoc', response.commentId);
      await preLoadImageV2(`api/files/task/adhoc/${taskId}/comments/${response.commentId}/comment_0.jpg/5`);
      getTaskCommentImagesList(taskId, 'adhoc', response.commentId);
      setThumbnailArray([]);
      setImageArray([]);

      imageArray.forEach(image => {
        updateImageOnList(taskId, 'adhoc', image.imageName, response.commentId);
      });

      if (fileArray.length) {
        await Promise.all(
          [fileArray.forEach(file => {
            const path = preparePaths(taskId, file.fileType, file.fileName, response.commentId);
            return uploadFileToDbxV2(path.fullPath, file.taskFile);
          })]
        );
        setTaskFiles(tf => {
          const newTF = { ...tf };
          newTF[response.commentId] = { list: fileArray, new: true };
          return newTF;
        });
        setFileArray([]);
      }
      const { commentId } = response;
      maxCommentsShown++;
      const evt = new CustomEvent(COMMENT_ADDED_EVENT, { detail: { taskId, commentId } });
      document.dispatchEvent(evt);
      await loadList();
      document.querySelector('#comment-detail-comments .infinite-scroll-component ').scrollIntoView(false);
    }
    setTags([]);
    formik.handleReset();
  };

  const loadList = async () => {
    if (interval) {
      window.clearInterval(interval);
    }
    await fetchComments(0, maxCommentsShown);
    setInitialState(false);
    interval = window.setInterval(() => {
      fetchComments(0, maxCommentsShown);
    }, 5000);
  };

  if (comments.length > maxCommentsShown) {
    maxCommentsShown = comments.length;
  }

  const handleBack = () => {
    onBack();
  };

  const handleAddImageButtonClick = () => {
    imageInputRef.current.click();
  };

  const handleTaskFileClick = () => {
    taskFileInputRef.current.click();
  };

  const focusInput = () => {
    if (!isMobile) {
      inputRef.current.focus();
    }
  };

  const handleImageInputChange = React.useCallback(async ({ target: { files } }) => {
    focusInput();
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

    setShowThumbnails(true);
    setThumbnailArray([...thumbnailArray, insertImages[0]]);
    setImageArray([...imageArray, images[0]]);
  }, [taskId, uploadImages]);

  const handleTaskFileInputChange = async (event) => {
    const { target: { files } } = event;
    focusInput();
    if (files.length === 0) {
      return;
    }

    const taskFile = files[0];
    if (/^image\//.test(taskFile.type)) {
      return handleImageInputChange(event);
    }

    const MB_50 = 50000000;
    if (taskFile.size > MB_50) {
      setTaskFilePathError(true);
      return;
    } else {
      setTaskFilePathError(false);
    }
    taskFileInputRef.current.value = null;
    const fileType = taskFile.name.substr(taskFile.name.lastIndexOf('.') + 1) || taskFile.type.split('/')[1];
    const fileName = taskFile.name.substr(0, taskFile.name.lastIndexOf('.'));

    setShowThumbnails(true);
    setFileArray([...fileArray, { fileType, fileName, taskFile }]);
  };

  const removePreloadedImage = (index) => {
    setThumbnailArray(tmpArr => {
      const arr = tmpArr.slice(0);
      arr.splice(index, 1);
      return arr;
    });
    setImageArray(tmpArr => {
      const arr = tmpArr.slice(0);
      arr.splice(index, 1);
      return arr;
    });
    focusInput();
  };

  const removePreloadedFile = (index) => {
    setFileArray(tmpArr => {
      const arr = tmpArr.slice(0);
      arr.splice(index, 1);
      return arr;
    });
    focusInput();
  };

  const handleNavigateToTask = () => {
    history.push(URLS.LOCATION_TASK_DETAILS(locationId, 'task', taskId, templateId));
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      formik.handleSubmit();
    }
  };

  const loadTaskFilePath = async (taskId, commentId, force, fileType, fileNameStr) => {
    if (!force && taskFiles[commentId]) {
      return;
    }

    const path = preparePaths(taskId, fileType, fileNameStr, commentId);
    const file = await getTaskCommentFilePathFromDbx(path.folderName, path.fileName);
    setTaskFiles(tf => {
      const newTF = { ...tf };
      newTF[commentId] = {
        list: Array.isArray(file) ? file : []
      };
      return newTF;
    });
  };

  const handleImagePaste = async ({ clipboardData }) => {
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];

      if (item.kind === 'file' && item.type === 'image/png') {
        const name = `image_${Date.now()}.png`;
        const blob = item.getAsFile();
        const img = await toBase64(blob);
        img.imageName = name;

        const imgContent = `data:image/${img.extension};base64,${img.content}`;
        const imgTempContent = `data:image/${img.extension};base64,${img.tempContent}`;
        const thumb = {
          name: img.imageName,
          originUrl: imgContent,
          url: imgTempContent,
          inProgress: true,
        };
        setThumbnailArray([...thumbnailArray, thumb]);
        setImageArray([...imageArray, img]);
        setShowThumbnails(true);
      }
    }
  };

  React.useEffect(() => {
    if (!taskId) {
      return;
    }
    setInitialState(true);
    formik.validateForm();
    maxCommentsShown = COMMENTS_LIMIT;
    loadList();
  }, [taskId]);

  React.useEffect(() => {
    return () => {
      setInitialState(true);
      clearList();
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, []);

  const formik = useForm({ fields, onSubmit });

  return (
    <>
      <div className="align-items-center justify-content-between p-2 d-flex" id="messaging-header-comment-detail">
        <div className="d-flex w-100">
          {fromBack && (
            <Link className="px-1 mr-2 collapsed" to="#" onClick={handleBack}>
              <i className="far text-secondary fa-arrow-left" aria-hidden="true"></i>
            </Link>
          )}

          <div className="w-100" onClick={onClose}>
            <h6 className="small mb-1 text-secondary">{locationName}</h6>
            <h6 className="mb-0">{task}</h6>
          </div>
          {fromBack && (
            <div className="ml-2">
              <Link to="#" onClick={handleNavigateToTask}><i className="far fa-external-link" aria-hidden="true"></i></Link>
            </div>
          )}
          {!fromBack && (
            <Link to="#" onClick={onClose} className="p-2 text-secondary" >
              <span>
                <i className="fal fa-times" aria-hidden="true"></i>
                <span className="sr-only"><Trans>Close</Trans></span>
              </span>
            </Link>
          )}
        </div>
      </div>
      <div className="border-top collapse show" id="comment-detail">
        <div className="p-3 keyboard" id="comment-detail-comments" style={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}>
          {
            comments.length === 0 && !(initialState && inprogress) && (
              <div id="zero-discussion" data-target="zero-discussion">
                <div className="row mb-3 pt-3">
                  <div className="col text-center">
                    <img className="mb-3" src="/assets/img/empty.png" width="200" />
                    <p className="mb-0 text-secondary"><em>{t('There is no discussion in your task.')}</em></p>
                  </div>
                </div>
              </div>
            )
          }
          {!!comments.length && (
            <InfiniteScroll
              dataLength={comments.length}
              next={fetchMoreComments}
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
              hasMore={comments?.length < totalComments}
              loader={<div style={{ textAlign: 'center', padding: 20, width: '100%' }}><i className="far fa-spinner fa-spin fa-3x" aria-hidden="true" /></div>}
              inverse={true}
              scrollThreshold="100px"
              scrollableTarget="comment-detail-comments"
            >
              {
                comments.map((comment) => (
                  <Comment
                    key={comment.commentId}
                    commentId={comment.commentId}
                    userName={comment.user}
                    email={comment.userName}
                    comment={comment.comment}
                    createdDate={comment.createdDate}
                    isCurrentUser={comment.currentUser}
                    taskId={taskId}
                    tempUrlArray={comment.tempUrlArray}
                    tmpImgs={comment.tmpImgs}
                    loadTaskFilePath={loadTaskFilePath}
                    taskFiles={taskFiles[comment.commentId] || {}}
                  />
                ))
              }
            </InfiniteScroll>
          )
          }
        </div>
        <div className="border-top">
          <Form onSubmit={formik.handleSubmit}>
            <Form.Control
              ref={inputRef}
              as="textarea"
              rows={2}
              name="comment"
              className="form-control border-0 rounded-0"
              placeholder={t('Type comment...')}
              value={formik.values.comment}
              onChange={({ target: { value } }) => formik.setFieldValue('comment', value)}
              onPaste={handleImagePaste}
              onKeyDown={handleKeyDown}
            />
          </Form>
        </div>
        {
          (showThumbnails && (!!thumbnailArray?.length || !!fileArray?.length || taskFilePathError)) && (
            <div className="py-3 px-2" style={styles.filesContainer}>
              <div style={styles.filesSubContainer}>
                {
                  taskFilePathError &&
                  (
                    <div className="float-left mx-2 rounded picture d-flex">
                      <span className="text-danger ml-1"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> <Trans>File size exceeds maximum limit 50 MB.</Trans></span>
                    </div>
                  )
                }
                {showThumbnails && !!thumbnailArray?.length && thumbnailArray.map((image, index) => (
                  <CommentImageThumbnail
                    key={index}
                    url={image.url}
                    originUrl={image.originUrl}
                    removePreloadedImage={() => removePreloadedImage(index)}
                  />
                ))}
                {showThumbnails && !!fileArray?.length && fileArray.map((file, index) => (
                  <CommentFileThumbnail
                    key={index}
                    label={file.taskFile.name}
                    type={file.fileType}
                    removePreloadedFile={() => removePreloadedFile(index)}
                  />
                ))}
              </div>
            </div>
          )
        }
        <div className="d-flex border-top justify-content-between px-2">
          <div className="d-flex">
            {
              isMobile && (
                <Link to="#" className="p-2 mr-3 text-secondary" onClick={handleAddImageButtonClick}>
                  <i className="far fa-camera" aria-hidden="true"></i> <span className="sr-only">Take Photo</span>
                </Link>
              )
            }

            <Link to="#" className="p-2 mr-3 text-secondary" onClick={handleAddImageButtonClick}>
              <i className="far fa-image" aria-hidden="true"></i> <span className="sr-only">Upload Image</span>
            </Link>
            <Link to="#" className="p-2 text-secondary" onClick={handleTaskFileClick}>
              <i className="far fa-file" aria-hidden="true"></i> <span className="sr-only">Upload Filt</span>
            </Link>
          </div>
          <Link to="#" id="send" className={`d-inline-block p-2${formik.isValid ? '' : ' disabled'}`} onClick={formik.handleSubmit}>
            <i className="fas fa-lg fa-paper-plane" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
      <input
        type="file"
        name="taskFile"
        accept="*"
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

TaskComments.propTypes = {
  activeComment: PropTypes.shape({
    locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    taskId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    templateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locationName: PropTypes.string,
    task: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  fromBack: PropTypes.bool,
};

TaskComments.defaultProps = {
  activeComment: {},
  fromBack: false,
};

TaskComments.displayName = 'TaskComments';
export default TaskComments;
