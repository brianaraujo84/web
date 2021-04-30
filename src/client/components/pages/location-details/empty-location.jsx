import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as URLS from '../../../urls';

const EmptyLocation = ({
  onAddTask,
  onAddGroup,
  onAddTemplate,
  my
}) => {

  const profile = useSelector(state => state.profile.data);

  const handleAddTask = () => {
    onAddTask();
  };
  if (profile.isWorker || my) {
    return (
      <>
        <div className="row mb-3">
          <div className="col">
            <h4 className="mt-1"><Trans i18nKey="tasks" /> <small className="text-muted">(0)</small></h4>
          </div>
          <div className="col text-right">
            <button className="btn btn-outline-primary disabled" role="button">
              <i className="fas fa-filter" aria-hidden="true"></i> <span className="sr-only"><Trans>Filter Tasks</Trans></span>
            </button>
          </div>
        </div>
        <div id="zero-tasks">
          <div className="row mb-3 pt-1">
            <div className="col text-center">
              <p className="mb-0 text-secondary"><em><Trans i18nKey="no_tasks_text" /></em></p>
              <Link to={URLS.LOCATIONS} className="d-block mt-3"><i className="far fa-arrow-left" aria-hidden="true"></i> <Trans i18nKey="back_to_space" /></Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div id="first-time-tasks" >
      <div className="row pt-1 mb-3">
        <div className="col text-center">
          <h4 className="mt-1">You're all set!</h4>
          <p className="lead mb-0">What would you like to do next?</p>
        </div>
      </div>
      {<div className="d-flex w-100">
        <a className="col text-center p-3 border border-primary bg-white rounded text-primary" id="create-task-first" role="button" onClick={handleAddTask} data-target="create-task-button">
          <i className="far fa-2x fa-plus" aria-hidden="true"></i>
          <br />
          <h5 className="mb-2">Create a Task</h5>
          <p className="text-secondary small mb-0">Tasks are individual work items.</p>
        </a>
        <a className="col text-center p-3 border border-primary bg-white rounded text-primary ml-3" id="create-task-first" role="button" onClick={onAddGroup} data-target="create-group-button">
          <i className="far fa-2x fa-file-plus" aria-hidden="true"></i>
          <br />
          <h5 className="mb-2">Create a Group</h5>
          <p className="text-secondary small mb-0">Groups are containers of tasks.</p>
        </a>
      </div>}
      <div>
        <div className="mt-3 d-none">
          <i className="far fa-info-circle text-primary mr-1" aria-hidden="true"></i>
          <p className="text-secondary" style={{ marginTop: -5 }}><strong className="text-dark">Tasks</strong> are individual work items. Create tasks for everyone!</p>
        </div>
        <div className="mt-3 d-none">
          <i className="far fa-info-circle text-primary mr-1" aria-hidden="true"></i>
          <p className="text-secondary" style={{ marginTop: -5 }}><strong className="text-dark">Groups</strong> are containers of tasks.<span className="d-block">In a standard group you can create multiple tasks. A predefined groups allow you to select on a template to populate a set of tasks.</span></p>
        </div>
        <hr className="my-4"/>
        <div className="text-center mb-3">
          <img className="rounded fade-50 mr-2" src="/assets/img/noun_hotel.svg" width="40"/>
          <img className="rounded fade-50 mr-2" src="/assets/img/noun_fire.svg" width="40" />
          <img className="rounded fade-50 mr-2" src="/assets/img/noun_plumbing.svg" width="40" />
          <img className="rounded fade-50 mr-2" src="/assets/img/noun_clean.svg" width="40" />
          <img className="rounded fade-50 mr-2" src="/assets/img/noun_construction.svg" width="40" />
          <img className="rounded fade-50 mr-2" src="/assets/img/noun_school.svg" width="40" />
        </div>
        <a className="d-block text-center p-3 border border-primary bg-white rounded text-primary mt-2" id="browse-mp" role="button" onClick={onAddTemplate}>
          <h5 className="mt-2">
            <Trans
              i18nKey="browse_marketplace"
              defaults="Browse Marketplace"
            />
          </h5>
          <p className="mb-0 small text-secondary">Jump start your work by creating a group using predefined industry templates.</p>
        </a>
      </div>
    </div>

  );
};

EmptyLocation.propTypes = {
  onAddTask: PropTypes.func.isRequired,
  onAddGroup: PropTypes.func,
  onAddTemplate: PropTypes.func,
  my: PropTypes.bool
};


EmptyLocation.displayName = 'EmptyLocation';
export default EmptyLocation;
