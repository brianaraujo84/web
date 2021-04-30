import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import DeleteModal from '../../shared/modal/delete';
import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { postTaskCommunicationObject } from '../../../redux/actions/object';
import { removeFromList } from '../../../redux/actions/objects';
import { getTaskCommentImages } from '../../../redux/actions/files';
import CommentImages from './comment-images';
import { DateUtils } from '../../../utils';
import { COMMENT_ADDED_EVENT } from '../../../constants';

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
  loadTaskFilePath,
  taskFiles,
  tmpImgs,
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const { t } = useTranslation();

  const comments = useSelector(state => state.comments.items);
  const profile = useSelector(state => state.profile.data);

  const deleteComment = useActionDispatch(postTaskCommunicationObject(OBJECT_COMMENT));
  const removeComment = useActionDispatch(removeFromList(OBJECT_COMMENTS));
  const getTaskCommentImagesList = useActionDispatch(getTaskCommentImages);

  const handleDelete = async () => {
    const commentIndex = comments.findIndex(comment => comment.commentId === commentId);
    await deleteComment({ taskId, commentId, action: 'delete' });
    await removeComment(commentIndex);
    setShowDeleteModal(false);
  };

  const taskCommentImages = useSelector(state => {
    if (tmpImgs?.length) {
      return tmpImgs;
    }
    return state.files.list && state.files.list[commentId] ? state.files.list[commentId][commentId] : [];
  });

  const loadImages = () => {
    getTaskCommentImagesList(taskId, 'adhoc', commentId);
  };

  const formatURLs = (text) => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '"  target="_blank" class="text-break">' + url + '</a>';
    });
  };

  const loadFilePath = () => {
    if (commentId && taskId) {
      loadTaskFilePath(taskId, commentId);
    }
  };

  const handleCommentAddEvent = ({ detail }) => {
    if (detail?.taskId === taskId && commentId === detail?.commentId) {
      loadFilePath();
    }
  };

  React.useEffect(() => {
    if (!tmpImgs?.length) {
      loadImages();
    }

    document.addEventListener(COMMENT_ADDED_EVENT, handleCommentAddEvent);
    return () => {
      document.removeEventListener(COMMENT_ADDED_EVENT, handleCommentAddEvent);
    };
  }, []);

  React.useEffect(() => {
    loadFilePath();
  }, [commentId, taskId]);

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
            {(taskCommentImages?.length > 0 || tempUrlArray.length) > 0 && (
              <>
                <hr className='my-2' />
                <div className="attachments">
                  <CommentImages
                    tempUrlArray={tempUrlArray}
                    taskCommentImages={taskCommentImages}
                  />
                </div>
              </>)}
            {taskFiles?.list && taskFiles.list.map((file, index) => (
              <div key={index} className="d-flex small mb-2 mt-2 align-items-center">
                <span><i className="far fa-file lineitem-icon" aria-hidden="true"></i> <span className="sr-only">File attachment</span></span>
                {
                  taskFiles.new ? (
                    <Link className="truncate-1" to='#'>{`${file.fileName}.${file.fileType}`}</Link>
                  ) : (
                    <a target="_blank" rel="noreferrer" className="truncate-1" href={`/api/files/dbx/signed-read${file.link}`}>{file.link.split('/')[2]}</a>
                  )
                }
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
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userName: PropTypes.string,
  email: PropTypes.string,
  comment: PropTypes.string,
  createdDate: PropTypes.string,
  timezone: PropTypes.string,
  isCurrentUser: PropTypes.bool,
  tmpImgs: PropTypes.array,
  taskId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tempUrlArray: PropTypes.array,
  taskFiles: PropTypes.shape({
    list: PropTypes.array,
    new: PropTypes.bool,
  }),
  loadTaskFilePath: PropTypes.func.isRequired,
};

Comment.defaultProps = {
  user: '',
  userName: '',
  email: '',
  comment: '',
  createdDate: '',
  timezone: '',
  isCurrentUser: false,
  tmp: [],
  tempUrlArray: [],
  taskFileArray: [],
};

Comment.displayName = 'Comment';
export default Comment;
