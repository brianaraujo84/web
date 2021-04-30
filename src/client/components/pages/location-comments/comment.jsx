import moment from 'moment-timezone';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DeleteModal from '../../shared/modal/delete';
import * as URLS from '../../../urls';
import { useActionDispatch } from '../../../hooks';
import { postCommunicationObject } from '../../../redux/actions/object';
import { removeFromList } from '../../../redux/actions/objects';

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

const Comment = ({ commentId, userName, email, comment, createdDate, timezone, isCurrentUser }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { t } = useTranslation();
  const { locationId } = useParams();

  const comments = useSelector(state => state.comments.items);
  const profile = useSelector(state => state.profile.data);

  const deleteComment = useActionDispatch(postCommunicationObject(OBJECT_COMMENT));
  const removeComment = useActionDispatch(removeFromList(OBJECT_COMMENTS));

  const handleDelete = async () => {
    const commentIndex = comments.findIndex(comment => comment.commentId === commentId);
    await deleteComment({ locationId, commentId, action: 'delete' });
    await removeComment(commentIndex);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="comment d-flex mb-3">
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
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: comment }} />
          </div>
          <span className="text-secondary fade-75 small">
            {
              (createdDate && timezone)
                ? moment(createdDate).tz(timezone).format('MM/DD/YYYY H:mm A')
                : moment().format('MM/DD/YYYY H:mm A')
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
};

Comment.defaultProps = {
  user: '',
  userName: '',
  email: '',
  comment: '',
  createdDate: '',
  timezone: '',
  isCurrentUser: false,
};

Comment.displayName = 'Comment';
export default Comment;
