import React from 'react';
import PropTypes from 'prop-types';

import CommentImage from '../comment-image';

const CommentImages = ({ tempUrlArray, taskCommentImages }) => {

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
          editable={false}
          inProgress={pic.inprogress}
          data-target="comment-image"
        />
      ))}
      {taskCommentImages && taskCommentImages.map((pic, idx) => (
        <CommentImage
          key={idx}
          url={pic.url}
          originUrl={pic.originUrl}
          editable={false}
          inProgress={pic.inprogress}
          data-target="comment-image"
        />
      ))}
    </>
  );
};
CommentImages.propTypes = {
  tempUrlArray: PropTypes.array,
  taskCommentImages: PropTypes.array,
};
CommentImages.defaultProps = {
  taskCommentImages: [],
  tempUrlArray: [],
};
CommentImages.displayName = 'CommentImages';
export default CommentImages;
