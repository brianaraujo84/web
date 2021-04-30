import React from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';

import * as URLS from '../../../urls';

const SimpleTaskCardSkin = ({ task, methodRefs }) => {
  const { t } = useTranslation();

  const titleHolder = React.useRef();
  const [inLineMenuVisible, setInlineMenuVisible] = React.useState(false);

  const onTileKeyDown = (e) => {
    if (e.key === 'Enter') {
      methodRefs.handleShowEditTask();
    }
  };

  const onEditTileKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      methodRefs.inputTaskRef.current.blur();
    }
  };

  const onCtrlClick = (e) => {
    if (e.ctrlKey || e.metaKey) {
      methodRefs.handleBulkSelect();
      e.stopPropagation();
    }
  };

  const showInLineMenu = () => {
    setInlineMenuVisible(!inLineMenuVisible);
  };

  return (
    <>
      <div className={`d-flex align-items-center justify-content-between py-2 border-bottom task-compact ${methodRefs.selectedForBulk && 'selected'}`} onClickCapture={onCtrlClick}>
        <div className="d-flex align-items-center">
          <div className="d-flex task align-items-center delete">
            <button
              disabled={!(methodRefs.isOpenTask && !methodRefs.isCustomJobGroupCard && !methodRefs.isTemplateJobGroupCard && task.createdBy === methodRefs.profile.username)}
              onClick={methodRefs.handleQuickCompleteClick}
              type="button" className="key-nav task-c-button p-1 ml-2 btn rounded btn-outline-primary"
              data-toggle="modal"
              data-target="quick-complete">
              <i className="far fa-check-circle" aria-hidden="true"></i>
              <span className="sr-only"><Trans i18nKey="Complete Task" /></span>
            </button>
          </div>
          <div className={`title d-inline-block ${methodRefs.showEditTitle ? 'edit' : 'view'}`}>
            <input
              type="text"
              className="title form-control form-control-sm"
              placeholder={t('title')}
              value={methodRefs.values.task}
              name="task"
              onChange={methodRefs.handleChange}
              onBlur={methodRefs.handleSaveTitle}
              onKeyDown={onEditTileKeyDown}
              autoComplete="off"
              ref={methodRefs.inputTaskRef}
              maxLength="100"
            />
            <button ref={titleHolder} type="button" className={`key-nav btn btn-default btn-sm ${methodRefs.showEditTitle ? 'd-none' : ''}`}>
              <span onClick={methodRefs.handleShowEditTask} onKeyDown={onTileKeyDown} tabIndex="0">{task.task || task.templateName}</span>
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="assignee ml-2">
            {(task.assignee || task.dueDate || task.priority || inLineMenuVisible) &&
              <button type="button" className="key-nav btn btn-default btn-sm">
                {
                  task.assignee ?
                    <span onClick={methodRefs.onAssign}>
                      <img
                        className="rounded-circle border border-secondary avatar-small"
                        src={URLS.PROFILE_IMAGE_THUMB(task.assigneeUserName)}
                        style={{ width: '15px' }}
                      />&nbsp;
                      {task.assignee.substr(0, 7)}
                    </span> :
                    <div className="text-super-light" onClick={methodRefs.onAssign}>
                      <div type="button" className="task-c-button pl-2 btn rounded-circle btn-outline-secondary">
                        <i className="fas fa-user-plus" aria-hidden="true"></i>
                      </div>&nbsp;
                      Assign
                    </div>
                }
              </button>
            }
          </div>

          <div className="due ml-2">
            {(task.assignee || task.dueDate || task.priority || inLineMenuVisible) && (task.dueDate || (task.stage === 'Assigned' || task.stage === 'Open' || task.stage === 'Accepted')) &&
              <button type="button" className="key-nav btn btn-default btn-sm">
                {
                  task.dueDate ?
                    <span onClick={() => methodRefs.setShowDueDate(true)}><i className="ci ci-due-f" aria-hidden="true"></i>&nbsp;{task.dueDate}</span> :
                    <span onClick={() => methodRefs.setShowDueDate(true)} className="text-super-light"><i className="ci ci-due-f text-secondary" aria-hidden="true"></i>&nbsp;Set Date</span>
                }
              </button>
            }
          </div>

          <div className="priority ml-2">
            {(task.assignee || task.dueDate || task.priority || inLineMenuVisible) &&
              <button type="button" onClick={() => methodRefs.setShowPriority(true)} className="key-nav btn btn-default btn-sm">
                {
                  task.priority > 0 ?
                    <span><i className={`fas fa-flag-alt p${task.priority}-color`} aria-hidden="true"></i></span> :
                    <span className="text-super-light"><i className="fas fa-flag-alt" aria-hidden="true"></i></span>
                }
              </button>
            }
          </div>

          <div className="d-flex align-items-center delete">
            {!(task.assignee || task.dueDate || task.priority) &&
              <button className="key-nav delete-task btn btn-sm btn-default ml-2" data-toggle="modal" onClick={showInLineMenu}><i className="fas fa-ellipsis-v" aria-hidden="true"></i></button>
            }
          </div>

          <div className="d-flex align-items-center delete">
            <button className="key-nav delete-task btn btn-sm btn-default ml-2" data-toggle="modal" onClick={methodRefs.handleRemoveClick}><i className="far fa-trash-alt" aria-hidden="true"></i></button>
          </div>

        </div>
      </div>
    </>
  );
};

SimpleTaskCardSkin.propTypes = {
  task: PropTypes.object.isRequired,
  methodRefs: PropTypes.object.isRequired,
};

SimpleTaskCardSkin.displayName = 'SimpleTaskCardSkin';

export default SimpleTaskCardSkin;
