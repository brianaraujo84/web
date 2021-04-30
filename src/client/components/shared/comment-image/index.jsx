import React from 'react';
import PropTypes from 'prop-types';

import { useModal } from '../../../hooks';
import { preloadImage } from '../../../utils';

import ImageModal from '../task-image/image-modal';

const CommentImage = ({
  editable,
  url,
  originUrl,
}) => {
  const [preloaded, setPreloaded] = React.useState(false);
  const [openImageModal, closeImageModal] = useModal(ImageModal);

  React.useEffect(() => {
    setPreloaded(false);
    preloadImage(url, () => setPreloaded(true));
    preloadImage(originUrl, () => { });
  }, [url]);

  const handleImageClick = React.useCallback(() => {
    openImageModal({
      url: originUrl || url,
      editable,
      showAI: false,
    });
  }, [openImageModal, originUrl, url, editable, closeImageModal]);

  return (
    <>
      <div className="image mb-2" data-target="modal">
        <div
          data-target="task-image"
          onClick={handleImageClick}
        >
          {preloaded && <div className="preview rounded border border-secondary" style={{ backgroundImage: `url(${url || originUrl})` }} />}
        </div>
      </div>
    </>
  );
};

CommentImage.propTypes = {
  editable: PropTypes.bool,
  inProgress: PropTypes.bool,
  url: PropTypes.string.isRequired,
  originUrl: PropTypes.string,
  onDelete: PropTypes.func,
};
CommentImage.defaultProps = {
  editable: false,
  inProgress: false,
  originUrl: null,
  onDelete: () => { },
};
CommentImage.displayName = 'CommentImage';

export default CommentImage;
