import React from 'react';
import PropTypes from 'prop-types';

const CommentImageThumbnail = ({
  url,
  removePreloadedImage,
}) => {

  return (
    <>
      <div className="float-left attachment mx-2 rounded border picture d-flex" style={{ backgroundImage: `url(${url})` }}>
        <i className="remove border bg-dark text-white rounded-circle far fa-times" aria-hidden="true" onClick={removePreloadedImage}></i>
      </div>
    </>
  );
};

CommentImageThumbnail.propTypes = {
  isFile: PropTypes.bool,
  url: PropTypes.string,
  label: PropTypes.string,
  removePreloadedImage: PropTypes.func,
};
CommentImageThumbnail.defaultProps = {
  label: '',
  isFile: false,
  inProgress: false,
  originUrl: null,
};
CommentImageThumbnail.displayName = 'CommentImageThumbnail';

export default CommentImageThumbnail;
