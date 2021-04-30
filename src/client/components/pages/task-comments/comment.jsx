import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import DeleteModal from '../../shared/modal/delete';
import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { postTaskCommunicationObject } from '../../../redux/actions/object';
import { removeFromList } from '../../../redux/actions/objects';
import { getTaskCommentImages, getTaskCommentFilePathFromDbx } from '../../../redux/actions/files';
import CommentImages from './comment-images';
import { DateUtils } from '../../../utils';

const styles = {
  img: {
    width: '40px',
    height: '40px',
  },
  link: {
    cursor: 'pointer',
  }
};

const OBJECT_COMMENTS = 'comments';
const OBJECT_COMMENT = 'comment';

const Comment = ({ 
  commentId, 
  userName, 
  email, 
  comment, 
  createdDate, 
  isCurrentUser, 
  taskId, 
  tempUrlArray, 
  fileArray,
  setFileArray,
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [taskFileArray, setTaskFileArray] = React.useState([]);
  const { t } = useTranslation();

  const comments = useSelector(state => state.comments.items);
  const profile = useSelector(state => state.profile.data);

  const deleteComment = useActionDispatch(postTaskCommunicationObject(OBJECT_COMMENT));
  const removeComment = useActionDispatch(removeFromList(OBJECT_COMMENTS));
  const getTaskCommentImagesList = useActionDispatch(getTaskCommentImages);

  const preparePaths = (taskId, fileType, fileNameStr) => {
    const folderName = `${taskId}-comment`;
    const fileName = `${fileNameStr || taskId}${fileType ? '.' + fileType : ''}`;
    const fullPath = `task-files/${folderName}/${fileName}`;
    return {folderName, fileName, fullPath};
  };

  const getTaskFilePath = async (taskId, commentId) => {
    const path = preparePaths(taskId, commentId);
    getTaskCommentFilePathFromDbx(path.folderName, path.fileName).then(file => { setTaskFileArray(file); });
  };

  const handleDelete = async () => {
    const commentIndex = comments.findIndex(comment => comment.commentId === commentId);
    await deleteComment({ taskId, commentId, action: 'delete' });
    await removeComment(commentIndex);
    setShowDeleteModal(false);
  };

  const taskCommentImages = useSelector(state => {
    return state.files.list && state.files.list[commentId] ? state.files.list[commentId][commentId] : [];
  });

  const loadImages = () => {
    getTaskCommentImagesList(taskId, 'adhoc', commentId);
  };

  const formatURLs = (text) => {
    const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
      return '<a href="' + url + '"  target="_blank" class="text-break">' + url + '</a>';
    });
  };
  
  React.useEffect(() => {
    loadImages();
  },[]);

  React.useEffect(() => {
    if (commentId && taskId) {
      getTaskFilePath(taskId + commentId);
    }
  },[commentId, taskId]);

  React.useMemo(() => {
    if (taskFileArray.length > 0 && fileArray.length > 0) {
      setFileArray([]);
    }
  },[taskFileArray]);

  return (
    <>
      <div className={(taskCommentImages?.length > 0 || tempUrlArray.length) ? 'comment d-flex mb-3 has-attachment' : 'comment d-flex mb-3'}>
        <div className="mr-2">
          <img className="rounded-circle border border-secondary" src={URLS.PROFILE_IMAGE_THUMB(email)} style={styles.img} />
        </div>
        <div>
          <div
            className={`alert alert-${isCurrentUser ? 'secondary' : 'primary'} mb-0 pt-1 px-2 pb-2`}
            data-target="comment"
          >
            <small className="font-weight-bold">
              {userName} <span className="font-weight-normal text-secondary invisible">Title</span>
            </small>
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: formatURLs(comment) }} />
            {(taskCommentImages?.length > 0 || tempUrlArray.length)  > 0 && (
              <>
                <hr className='my-2' />
                <div className="attachments">
                  <CommentImages taskId={taskId} commentId={commentId} isJob={false} loadImages={loadImages} editable hideActivityImages={true} tempUrlArray={tempUrlArray} />
                </div>
              </>)}
            {taskFileArray && taskFileArray.length > 0 && taskFileArray.map((file, index) => (
              <div key={index} className="d-flex small mb-2 mt-2 align-items-center">
                <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                <a target="_blank" rel="noreferrer" className="truncate-1" href={`/api/files/dbx/signed-read${file.link}`}>{file.link.split('/')[2]}</a>
              </div>
            ))}
            {fileArray.length > 0 && taskFileArray.length === 0 && fileArray.map((file, index) => (
              <div key={index} className="d-flex small mb-2 mt-2 align-items-center">
                <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                <a target="_blank" rel="noreferrer" className="truncate-1" href='#'>{`${file.fileName}.${file.fileType}`}</a>
              </div>
            ))}
          </div>
          <span className="text-secondary fade-75 small">
            {
              (createdDate)
                ? DateUtils.unicodeFormat(DateUtils.parseISO(createdDate), 'P p')
                : moment().format('MM/DD/YYYY h:mm A')
            }
            {
              (isCurrentUser || profile.isOwner || profile.isManager) && (
                <>
                  {' • '}
                  <a
                    className="text-danger"
                    style={styles.link}
                    onClick={() => setShowDeleteModal(true)}
                    data-target="button-delete"
                  >
                    Delete
                  </a>
                </>
              )
            }
          </span>
        </div>
      </div>
      <DeleteModal
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        show={showDeleteModal}
        title={t('Delete Comment')}
        messageText={t('Are you sure you want to delete this comment?')}
        deleteText={t('Delete')}
        data-target="delete-modal"
      />
    </>
  );
};

Comment.propTypes = {
  commentId: PropTypes.number,
  userName: PropTypes.string,
  email: PropTypes.string,
  comment: PropTypes.string,
  createdDate: PropTypes.string,
  timezone: PropTypes.string,
  isCurrentUser: PropTypes.bool,
  taskId: PropTypes.string,
  tempUrlArray: PropTypes.string,
  tempFileArray: PropTypes.array,
  fileArray: PropTypes.array,
  setFileArray: PropTypes.func,
};

Comment.defaultProps = {
  user: '',
  userName: '',
  email: '',
  comment: '',
  createdDate: '',
  timezone: '',
  isCurrentUser: false,
  tempUrlArray: [],
  tempFileArray: []
};

Comment.displayName = 'Comment';
export default Comment;
