import React from 'react';
import PropTypes from 'prop-types';

const CommentImageThumbnail = ({
  url,
  removePreloadedImage,
  index
}) => {

  return (
    <>
      <div className="attachment mx-2 rounded border picture" style={{ backgroundImage: `url(${url})` }}>
        <i className="remove border bg-dark text-white rounded-circle far fa-times" aria-hidden="true" onClick={() => removePreloadedImage(index)}></i>
      </div>
    </>
  );
};

CommentImageThumbnail.propTypes = {
  editable: PropTypes.bool,
  inProgress: PropTypes.bool,
  url: PropTypes.string.isRequired,
  originUrl: PropTypes.string,
  onDelete: PropTypes.func,
  index: PropTypes.number,
  removePreloadedImage: PropTypes.func,
};
CommentImageThumbnail.defaultProps = {
  editable: false,
  inProgress: false,
  originUrl: null,
  onDelete: () => { },
};
CommentImageThumbnail.displayName = 'CommentImageThumbnail';

export default CommentImageThumbnail;
