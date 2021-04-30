import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useForm } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import { smoothScrollToRef } from '../../../utils';
import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { DeleteModal } from '../../shared/modal';
import PlaceHolderTaskCard from './placeHolderTaskCard';
import SimpleNewTaskSkin from './skins/simple-new-task-skin';
// import { toBase64 } from '../../../utils';

export const styles = {
  textImageRequired: {
    color: '#007bff',  
  },
  textNoImageRequired: {
    color: '#6c757d',
  },
};

const NewTask = ({
  initData,
  onDelete,
  onUpdate,
  cardSkin,
}) => {
  const { t } = useTranslation();
  const fields = [
    {
      name: 'title',
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

  const [showDescription, setShowDescription] = React.useState(false);
  const [assignData, setAssignData] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [locationZoneId, setLocationZoneId] = React.useState(-1);
  const [isTitleValid, setIsTitleValid] = React.useState(false);
  const [showPlaceHolerCard, setShowPlaceHolderCard] = React.useState(false);

  const newTaskRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const toast = useActionDispatch(addToast);
  const locationZones = useSelector(state => state.locationZones.items);

  const handleUpdate = async (values) => {
    setShowPlaceHolderCard(true);
    const data = {
      ...values,
      imageRequired: 0,
      assignData,
      taskRecurring: scheduleData,
    };

    if (locationZoneId >= 0) {
      data.locationZoneId = locationZoneId;
    }

    setAssignData({});
    setScheduleData({});
    setLocationZoneId(-1);

    onUpdate(data);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
    toast(t('Task Discarded'));
    setShowDescription(showDescription);
  };

  const handleChange = ({ target: { name, value } }, restoreFocus = false) => {
    formik.setFieldValue(name, value);
    if (restoreFocus) {
      inputRef.current.focus();
    }
  };

  const formik = useForm({ fields, onSubmit: handleUpdate });

  React.useEffect(() => {
    inputRef.current.focus();
    // Somehow, formik doesn't validate the form on mount. Let's force validation again
    formik.validateForm();
  }, []);
  
  React.useEffect(() => {
    formik.setValues({
      title: initData && initData.title || '',
    });
  }, []);

  const selectedZone = React.useMemo(() => {
    return locationZones && locationZones.find((locationZone) => locationZone.id === locationZoneId);
  }, [locationZones, locationZoneId]);

  const checkForValidTitle = () => {
    if (formik.values.title.length >= 3) {
      setIsTitleValid(true);
    } else {
      setIsTitleValid(false);
    }
  };

  React.useEffect(() => {
    checkForValidTitle();
  },[formik.values.title]);

  return (
    <>
      {cardSkin === 'simple' &&
        <>
          <SimpleNewTaskSkin
            methodRefs={{ formik, smoothScrollToRef, inputRef, newTaskRef, isTitleValid, setShowDeleteModal, }}
          />
        </>
      }
      {!cardSkin && !showPlaceHolerCard ? (
        <div className="task create alert alert-info p-0" ref={newTaskRef}>
          <a className="p-1 text-center task-status text-white rounded-left">
            <Trans i18nKey="new" />
          </a>
          <div className="p-2">
            <form onSubmit={formik.handleSubmit} autoComplete="off">
              {selectedZone && (
                <div className="d-inline-block text-white bg-primary rounded px-1 mb-2">
                  <small className="font-weight-bold">
                    {`${selectedZone.type}${selectedZone.label ? ` "${selectedZone.label}"` : ''}`}
                  </small>
                </div>
              )}
              <div className="input-group input-group-seamless-append" id="password-input">
                <input
                  type="text"
                  className="form-control"
                  onChange={handleChange}
                  formik={formik}
                  placeholder={t('title')}
                  name="title"
                  showError={false}
                  ref={inputRef}
                  maxLength="100"
                  value={formik.values.title}
                />
                <div className="input-group-append" onClick={() => handleChange({ target: { name: 'title', value: '' }}, true)}>
                  <span className="input-group-text border-0 bg-white" id="show_hide_password">
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                    <span className="sr-only">Clear Text</span>
                  </span>
                </div>
              </div>
              <hr className="my-2" />
              <div>
                <div className="text-right">
                  <button
                    type="button"
                    className="task-c-button p-1 ml-2 btn rounded btn-outline-info"
                    data-target="button-delete"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <i className="fas fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="discard" /></span>
                  </button>
                  <Button
                    type="submit"
                    variant="outline-info"
                    disabled={!formik.isValid || formik.isSubmitting || !isTitleValid}
                    className="task-c-button p-1 ml-2 rounded btn"
                    data-target="button-toggle-save"
                  >
                    <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="create" /></span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>) : (
        <>{!cardSkin && <PlaceHolderTaskCard title={formik.values.title} />}</>
      )}
      <DeleteModal
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        show={showDeleteModal}
        title={t('discard_task')}
        messageText={t('discard_task_prmpt')}
        deleteText={t('discard')}
      />
    </>
  );
};


NewTask.propTypes = {
  initData: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isCustomTaskOfJob: PropTypes.bool,
  cardSkin: PropTypes.string,
};

NewTask.defaultProps = {
  isCustomTaskOfJob: false,
  cardSkin: '',
};

NewTask.displayName = 'LocationDetailsNewTask';
export default NewTask;
