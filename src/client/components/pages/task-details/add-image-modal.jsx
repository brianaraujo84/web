import React from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useActionDispatch } from '../../../hooks';
import { uploadJobActivityImages } from '../../../redux/actions/files';
import { toBase64Array } from '../../../utils';

import TaskImage from '../../shared/task-image';

const AddImageModal = ({
  onClose,
  onUpload,
  show,
  task,
  updateTaskInNonGrpJobTasks
}) => {
  const [imageUrls, setImageUrls] = React.useState([]);
  const uploadImages = useActionDispatch(uploadJobActivityImages);
  const fileEl = React.useRef(null);

  const uploadImagesList = () => {
    onClose();
    onUpload();
  };

  const removePhoto = React.useCallback(index => {
    setImageUrls(imageUrls => {
      const ps = imageUrls.slice(0);
      URL.revokeObjectURL(ps[index]);
      ps.splice(index, 1);
      return ps;
    });
  }, []);

  const handlePhotoAdd = React.useCallback(async ({ target: { files } }) => {
    if (files.length === 0) {
      return;
    }

    const imageFile = files[0];
    fileEl.current.value = null;
    setImageUrls(imageUrls => ([...imageUrls, URL.createObjectURL(imageFile)]));
    const values = await toBase64Array([imageFile]);
    const images = values.reduce((acc, cur) => {
      acc.push(cur.value);
      return acc;
    }, []);
    await uploadImages(images, task.jobActivityId, task.taskActivityTrackerId);
  }, [task.jobActivityId, task.taskActivityTrackerId, uploadImages]);

  return (
    <>
      <Modal show={show} onHide={onClose} centered>
        <form>
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="fas fa-lg mr-1 fa-check text-success" /> <Trans i18nKey="comp_task" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><Trans i18nKey="take_pic_finish_task" /></p>
            <div className="task-images mt-3">
              {
                imageUrls.map((url, index) => {
                  return (
                    <TaskImage
                      key={url}
                      url={url}
                      editable
                      task={task}
                      data-target="task-image"
                      onDelete={() => removePhoto(index)}
                      updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                    />
                  );
                })
              }
              <div className="add-image collapse show" id="addImage0">
                <div className="task-image mb-2">
                  <div className="capture rounded border border-primary text-center">
                    <div className="camera-icon mx-auto d-block text-center text-primary blue position-absolute">
                      <i className="fad fa-camera-alt" aria-hidden="true"></i>
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      capture="environment"
                      data-target="input-file"
                      ref={fileEl}
                      onChange={handlePhotoAdd}
                    />
                  </div>
                </div>
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              data-target="cancel-btn"
              onClick={() => onClose(false)}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button
              variant="success"
              disabled={!imageUrls.length}
              data-target="button-done"
              onClick={uploadImagesList}
            >
              <Trans i18nKey="done" />
            </Button>

          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};


AddImageModal.propTypes = {
  onUpload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  updateTaskInNonGrpJobTasks: PropTypes.func,
  task: PropTypes.object.isRequired,
};

AddImageModal.defaultProps = {
  show: false,
};

AddImageModal.displayName = 'LocationDetailsAddImageModal';
export default AddImageModal;
