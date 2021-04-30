import React from 'react';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';

import { smoothScrollToRef } from '../../../utils';
import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { DeleteModal } from '../../shared/modal';
// import { toBase64 } from '../../../utils';

const NewTask = ({
  initData,
  defaultZoneTypeId,
  onDelete,
  onUpdate,
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
    // {
    //   name: 'taskDescription',
    //   label: t('Description'),
    // },
  ];

  // const [showDescription, setShowDescription] = React.useState(false);
  // const [assignData, setAssignData] = React.useState(false);
  // const [scheduleData, setScheduleData] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  // const [locationZoneId, setLocationZoneId] = React.useState(-1);
  const [isTitleValid, setIsTitleValid] = React.useState(false);

  const newTaskRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const toast = useActionDispatch(addToast);
  // const locationZones = useSelector(state => state.locationZones.items);

  const handleUpdate = async (values) => {
    const data = {
      zoneTypeId: defaultZoneTypeId,
      taskName: values.title,
      taskDescription: '',
      imageRequired: 0
    };

    // if (locationZoneId >= 0) {
    //   data.locationZoneId = locationZoneId;
    // }

    // setAssignData({});
    // setScheduleData({});
    // setLocationZoneId(-1);

    onUpdate(data);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
    toast(t('Task Discarded'));
    // setShowDescription(showDescription);
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

  // const selectedZone = React.useMemo(() => {
  //   return locationZones && locationZones.find((locationZone) => locationZone.id === locationZoneId);
  // }, [locationZones, locationZoneId]);

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
      <div className="task create alert alert-info p-0" ref={newTaskRef}>
        <a className="p-1 text-center task-status d-block text-white rounded-left">
          <Trans i18nKey="new" />
        </a>
        <div className="p-2">
          <p className="mb-3">
            <span className="badge badge-primary zone-badge" data-toggle="modal" data-target="#associate-zone-edit">General</span>
          </p>
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            {/* {selectedZone && (
              <div className="d-inline-block text-white bg-primary rounded px-1 mb-2">
                <small className="font-weight-bold">
                  {`${selectedZone.type}${selectedZone.label ? ` "${selectedZone.label}"` : ''}`}
                </small>
              </div>
            )} */}
            <div className="d-flex">
              <div className="form-group mb-0 flex-grow-1">
                <label className="sr-only">Title</label>
                <Input
                  formik={formik}
                  classes={{ input: 'form-control' }}
                  placeholder={t('title')}
                  name="title"
                  showError={false}
                  ref={inputRef}
                  maxLength="100"
                  value={formik.values.title}
                  onFocus={()=>smoothScrollToRef(newTaskRef, 72)}
                />
              </div>
            </div>
            <hr className="my-2" />
            <div>
              <div className="text-right">
                <button
                  type="button"
                  className="task-c-button task-discard p-1 ml-2 btn rounded-circle btn-outline-primary"
                  data-target="button-delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="far fa-trash-alt" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="discard" /></span>
                </button>
                <Button
                  type="submit"
                  variant="info"
                  disabled={!formik.isValid || formik.isSubmitting || !isTitleValid}
                  className="task-c-button task-create p-1 ml-2 btn rounded-circle"
                  data-target="button-toggle-save"
                >
                  <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="create" /></span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
  defaultZoneTypeId: PropTypes.number,
  // isCustomTaskOfJob: PropTypes.bool,
};

NewTask.defaultProps = {
  // isCustomTaskOfJob: false,
};

NewTask.displayName = 'LocationDetailsNewTask';
export default NewTask;
