import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { AIButton } from './index';

const StyledModal = styled(Modal)`
  .modal-content {
    background-color: transparent;
    border: 0;
  }
`;

const ImageModal = ({
  show,
  onHide,
  url,
  editable,
  onDelete,
  showImageScore,
  showAI,
  task,
  aiStatus,
  handleShowAiPopUpModalClick
}) => {
  return (
    <StyledModal show={show} onHide={onHide} centered dialogClassName="modal-lg modal-xl">
      <div className="text-right pb-1">
        <span role="button" aria-hidden="true" aria-label="Close" onClick={onHide}>
          <i className="fal fa-2x fa-times text-white" aria-hidden="true"></i>
        </span>
      </div>
      <div className="rounded">
        <div>
          <div className="d-flex w-100 justify-content-between position-absolute">
            {editable ?
              <button
                type="button"
                className="task-c-button p-1 btn rounded-circle btn-light border border-danger text-danger m-2"
                data-target="delete-image"
                onClick={onDelete}
              >
                <i className="far fa-trash-alt" aria-hidden="true"></i><span className="sr-only">Delete Image</span>
              </button>
              :
              <span />
            }
            {
              showAI &&
              (
                (showImageScore && task.imageScore !== undefined) ?
                  (
                    <button
                      className="task-c-button p-1 btn mt-2 mr-2 rounded-circle btn-success border border-white shadow"
                      type="button"
                    >
                      {task.imageScore}
                      <span className="sr-only">
                        AI score
                      </span>
                    </button>
                  ) :
                  (
                    <AIButton enabled={!!aiStatus} onClick={handleShowAiPopUpModalClick} data-target="ai-off-image" />
                  )
              )
            }
          </div>
          <img src={url} className="w-100 rounded shadow" />
        </div>
      </div>
    </StyledModal>
  );
};

ImageModal.propTypes = {
  url: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  showImageScore: PropTypes.bool,
  showAI: PropTypes.bool,
  task: PropTypes.object,
  aiStatus: PropTypes.number,
  handleShowAiPopUpModalClick: PropTypes.func,
};

ImageModal.defaultProps = {
  show: false,
  showAI: true,
  onDelete: () => { },
};

ImageModal.displayName = 'ImageModal';
export default ImageModal;
