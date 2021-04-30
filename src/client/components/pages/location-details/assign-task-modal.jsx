import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm, Input } from 'react-form-dynamic';

import TaskImage from '../../shared/task-image';

const styles = {
  addImage: {
    backgroundColor: '#bee5eb',
  },
};

const AssignTaskModal = ({ show, task, onReassign, onCancel, updateTaskInNonGrpJobTasks }) => {

  const { t } = useTranslation();

  const fields = [
    {
      name: 'task',
      label: t('Title'),
      validations: [
        {
          rule: 'required',
        }
      ],
    },
    {
      name: 'taskDescription',
      label: t('Description'),
    },
  ];

  //const [values, setValues] = React.useState({});
  const [showDescription, setShowDescription] = React.useState(true);
  const [showAddPhoto, setShowAddPhoto] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);

  const fileEl = React.useRef(null);

  const handleChange = ({ target: { name, value } }) => {
    formik.setFieldValue(name, value);
  };

  const handleShowAddPhoto = () => {
    setShowAddPhoto(show => !show);
    window.setTimeout(() => {
      fileEl.current.click();
    });
  };

  const removePhoto = (index) => {
    const ps = photos.slice(0);
    ps.splice(index, 1);
    setPhotos(ps);
  };

  const handlePhotoAdd = ({ target: { files } }) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.match(/^image\//)) {
        const ps = photos.slice(0);
        ps.push(files[i]);
        setPhotos(ps);
        return;
      }
    }
  };

  const onSubmit = () => {
    onReassign({
      ...formik.values,
      photos
    });
  };

  const formik = useForm({ fields, onSubmit });

  React.useEffect(() => {
    formik.setValues({
      task: task.task,
      taskDescription: task.taskDescription,
    });
  }, []);

  return (
    <>
      <Modal show={show} onHide={onCancel} centered>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <Modal.Header closeButton>
            <Modal.Title as="h5">
              <i className="text-primary fa-lg mr-1 far fa-redo" aria-hidden="true" /> <Trans i18nKey="assign_rework" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="p-2 col">
              <div className="task-title-edit">
                <label className="sr-only">Title</label>
                <Input
                  type="text"
                  className="form-control mb-2"
                  placeholder={t('title')}
                  value={formik.values.task}
                  formik={formik}
                  name="task"
                  onChange={handleChange}
                  maxLength="100"
                />
              </div>

              <div className="form-group task-detail-overflow">
                {showDescription &&
                  <div className="task-description mt-3">
                    <div className="add-image collapse show" id="addDescription0">
                      <label className="sr-only">Notes/Description</label>
                      <textarea
                        name="taskDescription"
                        className="form-control mb-2"
                        placeholder={t('Describe what needs reworking (Optional)')}
                        value={formik.values.taskDescription}
                        data-target="textarea-description"
                        onChange={handleChange}
                        maxLength="500"
                      >
                      </textarea>
                    </div>
                  </div>
                }

                {showAddPhoto &&
                  <div className="task-images mt-3">
                    {
                      photos.map((p, index) => {
                        const img = new Image();
                        img.src = URL.createObjectURL(p);
                        img.onload = () => URL.revokeObjectURL(img.src);
                        return (
                          <TaskImage
                            key={index}
                            url={img.src}
                            task={task}
                            editable
                            data-target="task-image"
                            onDelete={() => removePhoto(index)}
                            updateTaskInNonGrpJobTasks={updateTaskInNonGrpJobTasks}
                          />
                        );
                      })
                    }
                    <div className="add-image collapse show" id="addImage0">
                      <div className="task-image mb-2">
                        <div className="capture rounded border border-info text-center" style={styles.addImage}>
                          <div className="camera-icon mx-auto d-block text-center text-info blue position-absolute">
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

                    <button
                      type="button"
                      className="task-add-image-btn task-c-button p-1 btn rounded-circle btn-outline-info"
                      data-target="button-show-add-photo"
                      onClick={() => setShowAddPhoto(false)}
                    >
                      <i className="far fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="cancel" /></span>
                    </button>
                  </div>
                }
              </div>

            </div>
          </Modal.Body>
          <Modal.Footer>

            <Button
              type="button"
              variant="outline-primary"
              className="task-c-button p-1 ml-2 btn rounded-circle"
              data-target="add-pictures"
              onClick={handleShowAddPhoto}
            >
              <i className="fas fa-camera" aria-hidden="true"></i><span className="sr-only"><Trans>Add Pictures</Trans></span>
            </Button>

            <Button
              type="button"
              variant="outline-primary"
              className="task-c-button p-1 ml-2 btn rounded-circle"
              data-target="add-description"
              onClick={() => setShowDescription(s => !s)}
            >
              <i className="fas fa-align-left" aria-hidden="true"></i><span className="sr-only"><Trans>Add Description</Trans></span>
            </Button>

            <Button variant="outline-secondary" onClick={onCancel}>
              <Trans i18nKey="cancel" />
            </Button>
            <Button variant="primary"
              disabled={!formik.isValid || formik.isSubmitting}
              data-target="submit-form"
              type="submit">
              {formik.isSubmitting && <i className="far fa-spinner fa-spin" aria-hidden="true"></i>} <Trans i18nKey="Send" />
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

AssignTaskModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onReassign: PropTypes.func.isRequired,
  show: PropTypes.bool,
  task: PropTypes.object.isRequired,
  updateTaskInNonGrpJobTasks: PropTypes.func
};

AssignTaskModal.displayName = 'AssignTaskModal';
export default AssignTaskModal;
