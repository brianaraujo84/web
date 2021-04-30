import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useForm, Input, ErrorMessage } from 'react-form-dynamic';
import Button from 'react-bootstrap/Button';


import { useActionDispatch } from '../../../hooks';
import { addToast } from '../../../redux/actions/toasts';
import { setObject } from '../../../redux/actions/object';
import { getStandardObjectsList } from '../../../redux/actions/objects';
import { DeleteModal } from '../../shared/modal';

import * as URLS from '../../../urls';

const OBJECT_TEMPLATES = 'templates';
const NEW_TEMPLATE = 'newTemplate';
const SELECT_STATUS = {
  default: -1,
  task: 0,
  template: 1,
};

const NewTaskTemplate = ({
  onDelete,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const { locationId } = useParams();
  const history = useHistory();

  const fields = [
    {
      name: 'title',
      label: t('Title'),
      initialValue: '',
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

  const [showTemplateSelection, setShowTemplateSelection] = React.useState(SELECT_STATUS.default);
  const [assignData, setAssignData] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isTitleValid, setIsTitleValid] = React.useState(false);
  const [isExpandChecked, setIsExpandChecked] = React.useState(false);
  const [showEditTitle, setShowEditTitle] = React.useState(false);

  const inputRef = React.useRef();

  const newTemplateData = useSelector(state => state.newTemplate.data);

  const getTemplates = useActionDispatch(getStandardObjectsList(OBJECT_TEMPLATES, 'templates', undefined, 'template/reference'));
  const toast = useActionDispatch(addToast);
  const updateTemplateData = useActionDispatch(setObject(NEW_TEMPLATE));

  React.useEffect(() => {
    inputRef.current.focus();
    getTemplates();
  }, []);

  const handleUpdate = async (values) => {

    const data = {
      ...values,
      custom: true,
      assignData,
      isTasks: true,
    };

    setAssignData({});

    await onUpdate(data);
    resetTemplateData();
    setIsExpandChecked(false);
  };

  const selectTemplate = () => {
    const { activeList, selectedTemplate } = newTemplateData;
    updateTemplateData({ assignData, values: formik.values, activeList, selectedTemplate, inProgress: true });
    history.push(URLS.TASK_TEMPLATES(locationId));
  };

  const resetTemplateData = () => {
    updateTemplateData({});
  };

  const updateTemplate = (template) => {
    formik.setFieldValue('template', template.templateName);
    formik.setFieldValue('templateId', template.templateId);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    onDelete();
    toast(t('Job Discarded'));
  };

  const handleClickTemplate = (event) => {
    event.preventDefault();
    setShowTemplateSelection(SELECT_STATUS.template);
    selectTemplate();
    return;
  };

  const handleClickTask = (event) => {
    event.preventDefault();
    updateTemplate({});
    resetTemplateData();
    setShowTemplateSelection(SELECT_STATUS.task);
  };

  React.useEffect(() => {
    if (newTemplateData.values) {
      formik.setValues(newTemplateData.values);
      window.setTimeout(() => {
        formik.validateForm();
      });
    }
    if (newTemplateData.selectedTemplate) {
      updateTemplate(newTemplateData.selectedTemplate);
      setShowTemplateSelection(SELECT_STATUS.template);
    }
  }, [newTemplateData]);

  React.useEffect(() => {
    formik.validateForm();
  }, [showTemplateSelection]);

  const formik = useForm({ fields, onSubmit: handleUpdate });

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
      <div className="task create alert alert-info p-0">
        <a className="p-1 text-center task-status text-white rounded-left">
          <Trans i18nKey="new" />
        </a>
        <div className="p-2">
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            {(showEditTitle || (showTemplateSelection === SELECT_STATUS.default && !isExpandChecked)) ? (
              <>
                <div className="form-group mb-2">
                  <label className="sr-only">Title</label>
                  <Input
                    formik={formik}
                    classes={{ input: 'form-control' }}
                    placeholder={t('title')}
                    name="title"
                    showError={false}
                    ref={inputRef}
                    maxLength="100"
                  />
                </div>
                {showEditTitle && (
                  <div className="text-right actions">
                    <Button
                      type="button"
                      variant="outline-primary"
                      className="task-c-button p-1 btn rounded-circle"
                      data-target="discard-title-button"
                      onClick={() => setShowEditTitle(false)}
                    >
                      <i className="far fa-times" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="discard" /></span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      className="task-c-button p-1 ml-2 btn rounded-circle"
                      data-target="save-title-button"
                      onClick={() => setShowEditTitle(false)}
                      disabled={!formik.values.title}
                    >
                      <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans i18nKey="save" /></span>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <h5
                className="alert-heading mb-1 task-title"
                data-target="task-title"
                onClick={() => setShowEditTitle(true)}
              >
                {formik.values.title}
              </h5>
            )}
            {(isExpandChecked || formik.values.template) && <div>
              <p className="mb-2 text-info"><Trans i18nKey="select_job_type" /></p>
              <div className="form-group d-flex">
                <div className="col pl-0 pr-2">
                  <a
                    className={`
                      d-block text-center p-3 border border-info rounded 
                      jobType-btn task ${showTemplateSelection === SELECT_STATUS.template && 'active'}
                    `}
                    id="showTemplate"
                    onClick={handleClickTemplate}
                    aria-expanded="false"
                    aria-controls="typeTemplate"
                    href="#"
                  >
                    <i className="fas fa-2x fa-tasks" aria-hidden="true"></i>
                    <br />
                    <small><Trans i18nKey="template" /></small>
                  </a>
                </div>
                <div className="col pr-0 pl-2 align-center">
                  <a
                    className={`
                    task-c-button task-create p-1 ml-2 btn rounded btn btn-outline-info ${showTemplateSelection === SELECT_STATUS.task && 'active'}
                    `}
                    id="showJobTempCls"
                    onClick={handleClickTask}
                    aria-expanded="false"
                    aria-controls="typeTasks"
                    href="#"
                  >
                    <i className="far fa-2x fa-plus-square" aria-hidden="true"></i>
                    <br />
                    <small><Trans i18nKey="tasks" /></small>
                  </a>
                </div>
              </div>
              <div>
                <div
                  className="form-group"
                  hidden={showTemplateSelection === SELECT_STATUS.task || !formik.values.template}
                >
                  <label className="sr-only"><Trans>Job Template</Trans></label>
                  <div className="input-group mb-2" onClick={handleClickTemplate}>
                    <div className="input-group-prepend">
                      <div className="input-group-text bg-info text-white">
                        <i className="far fa-file-spreadsheet" aria-hidden="true"></i>
                      </div>
                    </div>
                    <Input
                      formik={formik}
                      classes={{ input: 'form-control' }}
                      styles={{ container: { flex: '1 1 0%' } }}
                      placeholder={t('Template')}
                      name="template"
                      readOnly
                      showError={false}
                    // ref={templateRef}
                    />
                  </div>
                  <ErrorMessage
                    formik={formik}
                    name="template"
                    className="error-message"
                  />
                </div>
              </div>
            </div>}
            <hr className="my-2" />
            <div>
              <div className="text-right">
                <button
                  type="button"
                  className="task-c-button task-discard p-1 ml-2 btn rounded-circle btn-outline-primary"
                  data-target="button-delete"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="far fa-trash-alt" aria-hidden="true"></i><span className="sr-only"><Trans>Discard</Trans></span>
                </button>
                <Button
                  type="submit"
                  variant="info"
                  className="task-c-button task-create p-1 ml-2 btn rounded-circle"
                  disabled={!formik.isValid || formik.isSubmitting || !isTitleValid}
                  data-target="button-toggle-save"
                >
                  <i className="fas fa-check" aria-hidden="true"></i><span className="sr-only"><Trans>Create</Trans></span>
                </Button>
              </div>
            </div>
          </form>
        </div>
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          show={showDeleteModal}
          title={t('Discard Job')}
          messageText={t('Are you sure you want to discard this group?')}
          deleteText={t('Discard')}
        />
      </div>
    </>
  );
};


NewTaskTemplate.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

NewTaskTemplate.displayName = 'LocationDetailsNewTaskTemplate';
export default NewTaskTemplate;
