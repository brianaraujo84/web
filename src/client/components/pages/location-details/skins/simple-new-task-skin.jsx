import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Input } from 'react-form-dynamic';

import * as URLS from '../../../../urls';

const SimpleNewTaskSkin = ({ task, methodRefs }) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    methodRefs.formik.submitForm();
  };

  const onTitleKeyDown = (e) => {
    if (e.key === 'Enter' && methodRefs.formik.isValid && !methodRefs.formik.isSubmitting && methodRefs.isTitleValid) {
      methodRefs.formik.submitForm();
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between py-2 border-bottom task-compact" style={{marginBottom: '200px'}}>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center delete">
            <button className="key-nav delete-task btn btn-sm btn-default ml-2" data-toggle="modal"><i className="far fa-circle" aria-hidden="true"></i></button>
          </div>
          <div className="title d-inline-block edit key-nav btn btn-default btn-sm error">
            <Input
              formik={methodRefs.formik}
              classes={{ input: 'form-control' }}
              placeholder={t('title')}
              name="title"
              showError={false}
              ref={methodRefs.inputRef}
              maxLength="100"
              value={methodRefs?.formik?.values?.title}
              onFocus={()=>methodRefs.smoothScrollToRef(methodRefs.newTaskRef, 72)}
              autoComplete="off"
              onKeyDown={onTitleKeyDown}
              onBlur={handleSubmit}
            />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="assignee ml-2 d-none">
            <div className="assignee ml-2">
              <button type="button" className="key-nav btn btn-default btn-sm">
                {
                  task.assignee ?
                    <span>
                      <img
                        className="rounded-circle border border-secondary avatar-small"
                        src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)}
                        style={{ width: '15px' }}
                      />&nbsp;
                      {task.assignee.substr(0, 7)}
                    </span> :
                    <div className="text-super-light">
                      <div type="button" className="task-c-button pl-2 btn rounded-circle btn-outline-secondary">
                        <i className="fas fa-user-plus" aria-hidden="true"></i>
                      </div>&nbsp;
                      Assign
                    </div>
                }
              </button>
            </div>
          </div>

          <div className="due ml-2 d-none">
            <button type="button" className="key-nav btn btn-default btn-sm">
              {
                task.dueDate ?
                  <span><i className="ci ci-due-f" aria-hidden="true"></i>&nbsp;{task.dueDate}</span> :
                  <span className="text-super-light"><i className="ci ci-due-f text-secondary" aria-hidden="true"></i>&nbsp;Set Date</span>
              }
            </button>
          </div>

          <div className="priority ml-2 d-none">
            <button type="button" className="key-nav btn btn-default btn-sm">
              {
                task.priority > 0 ?
                  <span><i className={`fas fa-flag-alt p${task.priority}-color`} aria-hidden="true"></i></span> :
                  <span className="text-super-light"><i className="fas fa-flag-alt" aria-hidden="true"></i></span>
              }
            </button>
          </div>

          <div className="d-flex align-items-center">
            <button className="delete-task btn btn-sm btn-default ml-2" data-toggle="modal" onClick={() => methodRefs.setShowDeleteModal(true)}><i className="far fa-trash-alt" aria-hidden="true"></i></button>
          </div>

        </div>
      </div>
    </>
  );
};

SimpleNewTaskSkin.propTypes = {
  task: PropTypes.object.isRequired,
  methodRefs: PropTypes.object.isRequired,
};

SimpleNewTaskSkin.defaultProps = {
  task: {},
};

SimpleNewTaskSkin.displayName = 'SimpleNewTaskSkin';

export default SimpleNewTaskSkin;
