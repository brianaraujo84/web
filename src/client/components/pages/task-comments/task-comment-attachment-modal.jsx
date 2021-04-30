import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';

const TaskCommentAttachmentModal = ({
  onClose,
  show,
  handleTaskFileClick,
  handleAddImageButtonClick,
  imageLimitReached,
  fileUploadLimitReached
}) => {

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <form>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="mr-1 far fa-paperclip" /> <Trans>Add Attachment</Trans>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!!imageLimitReached &&
              (
                <div className="error text-danger mb-3" role="alert">
                  <small className="mb-0">
                    <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true" /><Trans>Image upload limit of 3 reached</Trans>
                  </small>
                </div>
              )
            }
            {!!fileUploadLimitReached &&
              (
                <div className="error text-danger mb-3" role="alert">
                  <small className="mb-0">
                    <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true" /><Trans>File upload limit of 3 reached</Trans>
                  </small>
                </div>
              )
            }
            <a className={imageLimitReached ? 'd-block border-bottom p-3 disabled' : 'd-block border-bottom p-3'} onClick={handleAddImageButtonClick}><i className="text-secondary far fa-camera mr-1" aria-hidden="true"></i> Take Photo</a>
            <a className={imageLimitReached ? 'd-block border-bottom p-3 disabled' : 'd-block border-bottom p-3'} onClick={handleAddImageButtonClick}><i className='text-secondary far fa-image mr-1' aria-hidden="true" onClick={handleAddImageButtonClick}></i> Add Image</a>
            <a className={fileUploadLimitReached ? 'd-block p-3 disabled' : 'd-block p-3'} onClick={handleTaskFileClick}><i className="text-secondary far fa-file mr-1" aria-hidden="true"></i> Add File</a>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
};


TaskCommentAttachmentModal.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  show: PropTypes.bool,
  handleTaskFileClick: PropTypes.func,
  handleAddImageButtonClick: PropTypes.func,
  imageLimitReached: PropTypes.bool,
  fileUploadLimitReached: PropTypes.bool,
};

TaskCommentAttachmentModal.defaultProps = {
  imageLimitReached: false,
};

TaskCommentAttachmentModal.displayName = 'TaskCommentAttachmentModal';
export default TaskCommentAttachmentModal;
