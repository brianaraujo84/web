import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import CommentImage from '../../shared/comment-image';

const CommentImages = ({ commentId, editable, tempUrlArray }) => {

  const taskCommentImages = useSelector(state => {
    return state.files.list && state.files.list[commentId] ? state.files.list[commentId][commentId] : [];
  });

  if (!taskCommentImages) {
    return <div />;
  }
  return (
    <>
      {tempUrlArray && tempUrlArray.map((pic, idx) => (
        <CommentImage
          key={idx}
          url={pic.url}
          originUrl={pic.originUrl}
          editable={editable}
          inProgress={pic.inprogress}
          data-target="comment-image"
        />
      ))}
      {taskCommentImages && taskCommentImages.map((pic, idx) => (
        <CommentImage
          key={idx}
          url={pic.url}
          originUrl={pic.originUrl}
          editable={editable}
          inProgress={pic.inprogress}
          data-target="comment-image"
        />
      ))}
    </>
  );
};
CommentImages.propTypes = {
  commentId: PropTypes.number.isRequired,
  isJob: PropTypes.bool.isRequired,
  editable: PropTypes.bool,
  editableActivityImages: PropTypes.bool,
  loadImages: PropTypes.func.isRequired,
  hideActivityImages: PropTypes.bool,
  taskId: PropTypes.string,
  tempUrlArray: PropTypes.array
};
CommentImages.defaultProps = {
  editable: false,
  editableActivityImages: false,
};
CommentImages.displayName = 'CommentImages';
export default CommentImages;
