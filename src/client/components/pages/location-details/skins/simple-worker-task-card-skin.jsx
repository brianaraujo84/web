import React from 'react';
import PropTypes from 'prop-types';

import * as URLS from '../../../../urls';

const SimpleWorkerTaskCardSkin = ({ task, methodRefs }) => {

  return (
    <>
      <div className="d-flex align-items-center justify-content-between py-2 border-bottom task-compact">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center delete">
            <button className="key-nav delete-task btn btn-sm btn-default ml-2 text-super-light" data-toggle="modal">
              <i className="far fa-circle" aria-hidden="true"></i>
            </button>
          </div>
          <div className={`title d-inline-block ${methodRefs.showEditTitle ? 'edit' : 'view'}`}>
            <button type="button" className="key-nav btn btn-default btn-sm">
              <span tabIndex="0">{task.task || task.templateName}</span>
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="assignee ml-2">
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

          <div className="due ml-2">
            {(task.dueDate || (task.stage === 'Assigned' || task.stage === 'Open' || task.stage === 'Accepted')) &&
              <button type="button" className="key-nav btn btn-default btn-sm">
                {
                  task.dueDate ?
                    <span><i className="ci ci-due-f" aria-hidden="true"></i>&nbsp;{task.dueDate}</span> :
                    <span className="text-super-light"><i className="ci ci-due-f text-secondary" aria-hidden="true"></i>&nbsp;Set Date</span>
                }
              </button>
            }
          </div>

          <div className="priority ml-2">
            <button type="button" className="key-nav btn btn-default btn-sm">
              {
                task.priority > 0 ?
                  <span><i className={`fas fa-flag-alt p${task.priority}-color`} aria-hidden="true"></i></span> :
                  <span className="text-super-light"><i className="fas fa-flag-alt" aria-hidden="true"></i></span>
              }
            </button>
          </div>

          <div className="d-flex align-items-center delete">
            <button className="key-nav delete-task btn btn-sm btn-default ml-2 text-super-light">
              <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
            </button>
          </div>

          <div className="d-flex align-items-center delete">
            <button className="key-nav delete-task btn btn-sm btn-default ml-2" data-toggle="modal">
              <i className="far fa-trash-alt" aria-hidden="true"></i>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

SimpleWorkerTaskCardSkin.propTypes = {
  task: PropTypes.object.isRequired,
  methodRefs: PropTypes.object.isRequired,
};

SimpleWorkerTaskCardSkin.displayName = 'SimpleWorkerTaskCardSkin';

export default SimpleWorkerTaskCardSkin;
